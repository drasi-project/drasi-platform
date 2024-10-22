/**
 * Copyright 2024 The Drasi Authors.
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

const portfinder = require('portfinder');
const cp = require('child_process');

class PortForward {

  /**
 * @param {string} serviceName
 * @param {number} servicePort
 * @param {string} namespace
 */
  constructor(serviceName, servicePort, namespace = "default") {
    this.serviceName = serviceName;
    this.servicePort = servicePort;
    this.namespace = namespace;
  }

  /**
 * @returns {Promise<number>}
 */
  async start() {
    let self = this;
    let localPort = await portfinder.getPortPromise();

    let promise = new Promise((resolve, reject) => {
      let proc = cp.spawn("kubectl", ["port-forward", `services/${this.serviceName}`, `${localPort}:${this.servicePort}`, "-n", self.namespace]);
      
      proc.stdout.on('data', function(msg){         
        console.log(`PortForward: ${self.serviceName} ${msg.toString()}`);
        resolve(proc);
      });

      proc.stderr.on('data', function(err){         
        console.error(`PortForward: ${self.serviceName} ${err.toString()}`);
        reject(err.toString());
      });
    });

    this.process = await promise;

    return localPort;
  }

  stop() {
    this.process?.kill();
  }

}

module.exports = PortForward;
