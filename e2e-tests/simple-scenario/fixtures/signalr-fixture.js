const signalR = require("@microsoft/signalr");
const deployResources = require("./deploy-resources");
const PortForward = require('./port-forward');

class SignalrFixture {

  /**
  * @param {Array} queryIds
  */
  constructor(queryIds) {
    //this.queryIds = resources.filter(x => !!x && x.kind == "ContinuousQuery").map(x => x.metadata.name);
    this.queryIds = queryIds;
    this.portForward = new PortForward("test-signalr-gateway", 8080, "drasi-system");
    this.changeListeners = new Map();

    for (let queryId of this.queryIds) {
      this.changeListeners.set(queryId, []);
    }
  }

  async start() {
    await deployResources([signalrReactionManifest(this.queryIds)]);
    this.localPort = await this.portForward.start();
    this.signalr = new signalR.HubConnectionBuilder()
      .withUrl(`http://127.0.0.1:${this.localPort}/hub`)
      .withAutomaticReconnect()
      .build();

    let self = this;
    for (let queryId of this.queryIds) {
      this.signalr.on(queryId, (data) => self.onEvent(queryId, data));
    }

    await this.signalr.start();

    for (let queryId of this.queryIds) {
      this.signalr.invoke("subscribe", queryId);
    }
  }

  async stop() {
    await this.signalr?.stop();
    this.portForward?.stop();
  }

  /**
   * @param {(any) => boolean} predicate
   * @param {number} timeoutMs
   * @returns {Promise<boolean>}>
   */
  async waitForChange(queryId, predicate, timeoutMs = 5000) {
    var cl = new ChangeListener(predicate, timeoutMs);
    let listeners = this.changeListeners.get(queryId);
    listeners.push(cl);

    return await cl.waitForCondition();
  }

  async requestReload(queryId) {
    let reloadData = [];
    const streamPromise = new Promise((resolve, reject) => {
      this.signalr?.stream("reload", queryId).subscribe({
        next: item => {
        console.log(queryId + " reload next: " + JSON.stringify(item));

        switch (item['op']) {
            case 'h':
            reloadData = [];                  
            break;
            case 'r':
            reloadData.push(item.payload.after);
            break;
        }
        },
        complete: () => {
          console.log(queryId + " reload complete");
          console.log("reload data" + JSON.stringify(reloadData));
          resolve(reloadData);
          
        },
        error: err => reject(err)
      });
    });
    return await streamPromise;
  }

  async requestSubscribe(queryId) {
    await this.signalr?.invoke("subscribe", queryId);
  }

  /**
   * @param {any} queryId
   * @param {any} data
   */
  async onEvent(queryId, data) {
    if (!this.changeListeners.has(queryId))
      return;

    console.info(`SignalrFixture.onEvent ${queryId} ${JSON.stringify(data)}`);

    let listeners = this.changeListeners.get(queryId);
    for (let listener of listeners) {
      listener.evaluate(data);
    }
    this.changeListeners.set(queryId, listeners.filter((/** @type {{ complete: any; }} */ x) => !x.complete));
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
    // eslint-disable-next-line no-unused-vars
    this.resolve = (/** @type {any} */ value) => { };
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
   * 
   * @returns {Promise<boolean>}
   */
  async waitForCondition() {
    try {
      await this.promise;
      return true;
    }
    catch (err) {
      return false;
    }
  }
}

/**
 * @param {Array} queryIds
 */
function signalrReactionManifest(queryIds) {
  let result = {
    "apiVersion": "v1",
    "kind": "Reaction",
    "name": "test-signalr",
    "spec": {
      "kind": "SignalR",
      "queries": queryIds.reduce((a, v) => ({ ...a, [v]: ""}), {})
    }
  };

  return result;
}

module.exports = SignalrFixture;