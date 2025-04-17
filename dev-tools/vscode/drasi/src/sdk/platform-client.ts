import { KubeConfig ,PortForward, KubernetesObjectApi, CoreV1Api } from "@kubernetes/client-node";
import net, { AddressInfo } from 'node:net';
import { Stoppable } from "../models/stoppable";
import { DockerConfig, KubernetesConfig, Registration } from "./config";
import yaml from 'js-yaml';


export interface ManagementEndpoint {
    close(): Promise<void>;
    getManagementAddr(): Promise<string>;
}


export interface PlatformClient {
    getManagementEndpoint(): Promise<ManagementEndpoint>;    
}

export function createPlatformClient(registration: Registration): PlatformClient {
    switch (registration.kind) {
        case "kubernetes":
            return new KubernetesPlatformClient(registration as KubernetesConfig);
        case "docker":
            return createPlatformClient((registration as DockerConfig).internalConfig);
        default:
            throw new Error(`Unknown platform kind: ${registration.kind}`);
    }
}

class KubernetesPlatformClient implements PlatformClient {
    private kubeConfig: KubeConfig;
    private namespace: string;

    constructor(registration: KubernetesConfig) {
        this.kubeConfig = new KubeConfig();
        
        const decodedYaml = Buffer.from(registration.kubeconfig, 'base64').toString('utf-8');
        const parsedJson = yaml.load(decodedYaml);
        this.kubeConfig.loadFromString(JSON.stringify(parsedJson));
        this.namespace = registration.namespace;
    }

    async getManagementEndpoint(): Promise<ManagementEndpoint> {
        let ep = new KubernetesManagementEndpoint(this.kubeConfig, this.namespace);
        return ep;
    }
}


class KubernetesManagementEndpoint implements ManagementEndpoint {

    private kubeConfig: KubeConfig;
    private namespace: string;
    private portForward: PortForward;
    private apiPort: number = 8080;
    private server: net.Server | undefined = undefined;

    constructor(kubeConfig: KubeConfig, namespace: string) {
        this.kubeConfig = kubeConfig;
        this.namespace = namespace;
        this.portForward = new PortForward(this.kubeConfig);
    }

    private async getServer(): Promise<net.Server> {
        if (this.server) {
            if (this.server.listening) {
                return this.server;
            } 
            console.log("Server is not listening, creating a new one");
            this.server.close();
        }
        
        let pod = await getDrasiApiPod(this.kubeConfig, this.namespace);
        if (!pod) {
            throw new Error(`Failed to get pod for drasi-api in namespace ${this.namespace}`);
        }        

        const server = net.createServer((socket) => {
            this.portForward.portForward(this.namespace, pod, [this.apiPort], socket, null, socket);
        });
        server.on('error', (err) => {
            console.error("Error in server", err);
        });
        server.on('close', () => {
            console.log("Server closed");
        });
        server.on('listening', () => {
            console.log("Server listening");
        });
        server.on('connection', () => {
            console.log("Server connection");
        });

        this.server = server.listen(0, '127.0.0.1');
        await new Promise<void>((resolve, reject) => {
            this.server?.once('listening', resolve);
            this.server?.once('error', reject);
        });
        return this.server;
    }

    async close(): Promise<void> {
        console.log("Closing management endpoint");
        if (this.server) {
            this.server.close();
            this.server = undefined;
        }
    }

    async getManagementAddr(): Promise<string> {
        const server = await this.getServer();
        const address = server.address();
        if (address === null) {
            throw new Error("Failed to retrieve server address");
        }
        if (typeof address === 'string') {
            return address;
        }
        let addr: AddressInfo = address;
        
        console.log(`Management URL: ${addr.address}:${addr.port}`);

        return `127.0.0.1:${addr.port}`;
    }
   
}

async function getDrasiApiPod(kubeConfig: KubeConfig, namespace: string): Promise<string | undefined> {
    const client = kubeConfig.makeApiClient(CoreV1Api);
    const ep = await client.readNamespacedEndpoints({
        namespace: namespace,
        name: "drasi-api"
    });
    
    for (let ss of ep.subsets ?? []) {
        for (let addr of ss.addresses ?? []) {
            if (addr.targetRef?.kind === "Pod") {
                console.log(`Found pod ${addr.targetRef.name} for drasi-api`);
                return addr.targetRef.name;                    
            }
        }
    }
    return undefined;
}