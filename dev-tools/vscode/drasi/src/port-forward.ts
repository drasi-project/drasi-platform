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

import * as portfinder from 'portfinder';
import * as cp from 'child_process';
import { Mutex } from 'async-mutex';
import { Stoppable } from './models/stoppable';
import { getNamespace } from './utilities/getNamespace';

let portMutex = new Mutex();

export class PortForward implements Stoppable {
  serviceName: string;
  servicePort: number;
  process?: cp.ChildProcess = undefined;
  
  /**
 * @param {string} serviceName
 * @param {number} servicePort
 */
  constructor(serviceName: string, servicePort: number) {
    this.serviceName = serviceName;
    this.servicePort = servicePort;
  }

  /**
 * @returns {Promise<number>}
 */
  async start(): Promise<number> {
    let self = this;
    const release = await portMutex.acquire();
    try {
      let localPort = await portfinder.getPortPromise();

      let promise = new Promise<cp.ChildProcess>((resolve, reject) => {
        let proc = cp.spawn("kubectl", ["port-forward", `services/${this.serviceName}`, `${localPort}:${this.servicePort}`, "-n", getNamespace()]);
        
        proc.stdout.on('data', function(msg: any){         
          console.log(`PortForward: ${self.serviceName} ${msg.toString()}`);
          resolve(proc);
        });

        proc.stderr.on('data', function(err: any){         
          console.error(`PortForward: ${self.serviceName} ${err.toString()}`);
          reject(err.toString());
        });
      
      });

      this.process = await promise;

      return localPort;
    }      
    finally {
      release();      
    }    
  }

  stop() {
    console.log(`Stopping port-forward for ${this.serviceName}`);
    this.process?.kill();
  }
}
