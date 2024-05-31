const cp = require('child_process');

const images = [
  "reactive-graph/api",
  "reactive-graph/kubernetes-provider",

  //"reactive-graph/source-cosmosdb-reactivator",
  "reactive-graph/source-debezium-reactivator",
  "reactive-graph/source-kubernetes-reactivator",

  "reactive-graph/source-change-dispatcher",
  "reactive-graph/source-change-svc",
  "reactive-graph/source-query-api",
  "reactive-graph/source-gremlin-proxy",
  "reactive-graph/source-sql-proxy",
  "reactive-graph/source-passthru-proxy",

  "reactive-graph/query-container-publish-api",
  "reactive-graph/query-container-query-host",
  "reactive-graph/query-container-view-svc",

  "reactive-graph/reaction-signalr",
  "reactive-graph/reaction-gremlin",
];

async function loadDrasiImages(clusterName) {
  let promises = [];

  for (let image of images) {
    promises.push(new Promise((resolve, reject) => {
      let p = cp.spawn("kind", ["load", "docker-image", image, "--name", clusterName]);
      p.stdout.on('data', function(msg){         
        console.log(`${image} - ${msg.toString()}`);
      });
      p.stderr.on('data', function(msg){         
        console.log(`${image} - ${msg.toString()}`);
      });
      p.once("exit", (code) => {
        if (code == 0)
          resolve(null);
        else
          reject();
      });
    }));
  }
  
  await Promise.all(promises);
}

async function tryLoadInfraImages(clusterName) {
  let promises = [];

  for (let image of ["mongo:6"]) {
    promises.push(new Promise((resolve) => {
      let pull = cp.spawn("docker", ["pull", image]);
      pull.stdout.on('data', function(msg){         
        console.log(`${image} - ${msg.toString()}`);
      });
      pull.once("exit", () => {      
        let p = cp.spawn("kind", ["load", "docker-image", image, "--name", clusterName]);
        p.stdout.on('data', function(msg){         
          console.log(`${image} - ${msg.toString()}`);
        });
        p.stderr.on('data', function(msg){         
          console.log(`${image} - ${msg.toString()}`);
        });
        p.once("exit", () => resolve(null));
      });
    }));
  }
  
  await Promise.all(promises);
}

async function installDrasi() {
  await waitForChildProcess(cp.exec("drasi init --local", {
    encoding: 'utf-8'
  }), "install");
}

/**
 * @param {cp.ChildProcess} childProcess
 * @param {string} logPrefix
 */
function waitForChildProcess(childProcess, logPrefix = "") {
  return new Promise((resolve, reject) => {
    childProcess.once("exit", (code) => {
      if (code == 0)
        resolve(null);
      else
        reject(`${logPrefix} ${childProcess.spawnfile} exit code ${code}`);
    });
    childProcess.stdout?.on('data', function(msg){         
      console.info(`${logPrefix} ${childProcess.spawnfile} - ${msg.toString()}`);
    });

    childProcess.stderr?.on('data', function(msg){         
      console.error(`${logPrefix} ${childProcess.spawnfile} - ${msg.toString()}`);
    });
  });
}

exports.loadDrasiImages = loadDrasiImages;
exports.installDrasi = installDrasi;
exports.tryLoadInfraImages = tryLoadInfraImages;
exports.waitForChildProcess = waitForChildProcess;
