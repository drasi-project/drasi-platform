import * as portfinder from 'portfinder';
import * as cp from 'child_process';

export class PortForward {
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
    let localPort = await portfinder.getPortPromise();

    let promise = new Promise<cp.ChildProcess>((resolve, reject) => {
      let proc = cp.spawn("kubectl", ["port-forward", `services/${this.serviceName}`, `${localPort}:${this.servicePort}`, "-n", "drasi-system"]);
      
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

  stop() {
    this.process?.kill();
  }
}
