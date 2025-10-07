/**
 * Copyright 2025 The Drasi Authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

const axios = require('axios');
const signalR = require("@microsoft/signalr");
const portfinder = require('portfinder');
const deployResources = require('./deploy-resources');
const deleteResources = require('./delete-resources');

class SignalRFixture {
  /**
   * @param {Array<string>} queryIds - Array of query IDs to subscribe to
   * @param {string} ingressServiceName - Name of the ingress service (default: contour-envoy)
   * @param {string} ingressNamespace - Namespace of the ingress service (default: projectcontour)
   */
  constructor(queryIds, ingressServiceName = 'contour-envoy', ingressNamespace = 'projectcontour') {
    this.reactionManifest = signalrReactionManifest(queryIds);
    this.queryIds = queryIds;
    this.ingressServiceName = ingressServiceName;
    this.ingressNamespace = ingressNamespace;
    this.localPort = null;

    // SignalR change listeners
    this.changeListeners = new Map();
    for (let queryId of this.queryIds) {
      this.changeListeners.set(queryId, []);
    }
  }

  async start() {
    await deployResources([this.reactionManifest]);
    await new Promise((r) => setTimeout(r, 10000));
    // Use the port that was configured in kind-config.yaml by cluster-setup.js
    this.localPort = parseInt(process.env.INGRESS_PORT) || 8001;

    // Generate the hostname that the ingress expects
    // Format: {reaction-name}.drasi.{ip}.nip.io
    // For local testing with kind, we can use localhost
    this.hostname = `${this.reactionManifest.name}.drasi.localhost`;

    console.log(`SignalRFixture: Using localhost access on port ${this.localPort}`);
    console.log(`SignalRFixture: Using hostname: ${this.hostname}`);

    // Initialize SignalR connection through ingress
    await this.connectSignalR();
  }

  async stop() {
    await this.signalr?.stop();
    await deleteResources([this.reactionManifest]);
  }
  
  async connectSignalR() {
    // Create SignalR connection through ingress via localhost
    const hubUrl = `http://localhost:${this.localPort}/hub`;
    
    this.signalr = new signalR.HubConnectionBuilder()
      .withUrl(hubUrl, {
        headers: {
          'Host': this.hostname  // Set Host header for ingress routing
        },
        //transport: signalR.HttpTransportType.LongPolling, // Force long polling instead of WebSockets
        //timeout: 30000, // Increase timeout to 30 seconds
        //logLevel: signalR.LogLevel.Warning,
        //keepAliveIntervalInMilliseconds: 30000,  // Send ping every 30s
        //serverTimeoutInMilliseconds: 60000       // Expect response within 60s
      })
      .withAutomaticReconnect()
      //.withAutomaticReconnect([0, 2000, 10000, 30000]) // Custom retry intervals
      .build();

    let self = this;
    for (let queryId of this.queryIds) {
      this.signalr.on(queryId, (data) => self.onEvent(queryId, data));
    }

    await this.signalr.start();

    for (let queryId of this.queryIds) {
      await this.signalr.invoke("subscribe", queryId);
    }

    console.log(`SignalRFixture: SignalR connected through ingress for queries: ${this.queryIds.join(', ')}`);
  }
 
  
  /**
   * Wait for a change event that matches the predicate
   * @param {string} queryId - The query ID to listen for changes on
   * @param {function} predicate - Function that returns true when the desired change is detected
   * @param {number} timeoutMs - Timeout in milliseconds (default: 5000)
   * @returns {Promise<boolean>} - True if condition met, false if timeout
   */
  async waitForChange(queryId, predicate, timeoutMs = 5000) {
    var cl = new ChangeListener(predicate, timeoutMs);
    let listeners = this.changeListeners.get(queryId);
    listeners.push(cl);

    return await cl.waitForCondition();
  }

  /**
   * Request reload data from the SignalR hub through ingress
   * @param {string} queryId - The query ID to reload
   * @returns {Promise<Array<any>>} - The reload data
   */
  async requestReload(queryId) {
    let reloadData = [];
    const streamPromise = new Promise((resolve, reject) => {
      this.signalr?.stream("reload", queryId).subscribe({
        next: (item) => {
          console.log(queryId + " reload next (ingress): " + JSON.stringify(item));

          switch (item["op"]) {
            case "h":
              reloadData = [];
              break;
            case "r":
              reloadData.push(item.payload.after);
              break;
          }
        },
        complete: () => {
          console.log(queryId + " reload complete (ingress)");
          console.log("reload data (ingress): " + JSON.stringify(reloadData));
          resolve(reloadData);
        },
        error: (err) => reject(err),
      });
    });
    return await streamPromise;
  }

  /**
   * Handle SignalR change events
   * @param {string} queryId - The query ID
   * @param {any} data - The change data
   */
  async onEvent(queryId, data) {
    if (!this.changeListeners.has(queryId)) return;

    console.info(`SignalRFixture.onEvent ${queryId} ${JSON.stringify(data)}`);

    let listeners = this.changeListeners.get(queryId);
    for (let listener of listeners) {
      listener.evaluate(data);
    }
    this.changeListeners.set(
      queryId,
      listeners.filter(x => !x.complete),
    );
  }
}

class ChangeListener {
  /**
   * @param {function} predicate
   * @param {number} timeoutMs
   */
  constructor(predicate, timeoutMs) {
    this.complete = false;
    this.predicate = predicate;
    this.resolve = (_value) => {};
    let self = this;
    this.promise = new Promise((resolve, reject) => {
      self.resolve = resolve;
      setTimeout(reject, timeoutMs);
    });
  }

  /**
   * @param {array} data
   * @returns {boolean}
   */
  evaluate(data) {
    let result = false;
    try {
      result = this.predicate(data);
    } catch (err) {
      console.debug(err);
    }
    if (result) {
      this.resolve();
      this.complete = true;
    }

    return result;
  }

  /**
   * @returns {Promise<boolean>}
   */
  async waitForCondition() {
    try {
      await this.promise;
      return true;
    } catch (err) {
      return false;
    }
  }
}

/**
 * @param {Array<string>} queryIds
 */
function signalrReactionManifest(queryIds) {
  let result = {
    apiVersion: "v1",
    kind: "Reaction",
    name: `signalr-${crypto.randomUUID().toString()}`, 
    // Sometimes the uuid will begin with a number, which is not allowed in k8s resource names
    // as a result, we prepend the name with 'signalr-' to ensure it is a valid name
    spec: {
      kind: "SignalR",
      queries: queryIds.reduce((a, v) => ({ ...a, [v]: "" }), {}),
      services: {
        endpoints: {
          service: {
            setting: "external",
            target: "8080"
          }
        }
      }
    },
  };

  return result;
}

module.exports = SignalRFixture;