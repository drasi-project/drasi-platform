import k8s = require('@kubernetes/client-node');

export function getCurrentKubeContext(): string {
    const kc = new k8s.KubeConfig();
    kc.loadFromDefault();    
    const currentContext = kc.getCurrentContext();
    return currentContext;
}