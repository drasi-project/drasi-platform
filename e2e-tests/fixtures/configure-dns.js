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

const cp = require('child_process');
const util = require('util');
const execAsync = util.promisify(cp.exec);

/**
 * Configures CoreDNS to use Google DNS servers for external resolution.
 * This ensures that reactions can reach external services like Azure OpenAI.
 */
async function configureDNS() {
  console.log("Configuring CoreDNS with Google DNS servers for external resolution...");
  
  const coreDNSConfig = `.:53 {
    errors
    health {
       lameduck 5s
    }
    ready
    kubernetes cluster.local in-addr.arpa ip6.arpa {
       pods insecure
       fallthrough in-addr.arpa ip6.arpa
       ttl 30
    }
    prometheus :9153
    forward . 8.8.8.8 8.8.4.4 {
       max_concurrent 1000
    }
    cache 30
    loop
    reload
    loadbalance
}`;

  try {
    // Create the patch JSON
    const patchData = {
      data: {
        Corefile: coreDNSConfig
      }
    };
    
    // Apply the patch
    await execAsync(`kubectl patch configmap/coredns -n kube-system --type merge -p '${JSON.stringify(patchData)}'`);
    console.log("CoreDNS ConfigMap patched successfully.");
    
    // Restart CoreDNS to apply changes
    await execAsync('kubectl rollout restart deployment/coredns -n kube-system');
    console.log("CoreDNS deployment restarted.");
    
    // Wait for CoreDNS to be ready
    await execAsync('kubectl rollout status deployment/coredns -n kube-system --timeout=60s');
    console.log("CoreDNS is ready with Google DNS configuration.");
    
  } catch (error) {
    console.error("Failed to configure DNS:", error.message);
    throw error;
  }
}

module.exports = { configureDNS };