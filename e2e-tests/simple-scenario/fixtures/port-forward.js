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
