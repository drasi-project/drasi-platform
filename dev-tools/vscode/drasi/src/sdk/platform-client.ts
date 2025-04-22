import { KubeConfig ,PortForward, KubernetesObjectApi, CoreV1Api } from "@kubernetes/client-node";
import net, { AddressInfo } from 'node:net';
import { DockerConfig, KubernetesConfig, Registration } from "./config";
import yaml from 'js-yaml';


export interface ManagementEndpoint {
    close(): Promise<void>;
    getManagementAddr(): Promise<string>;
}


export interface PlatformClient {
    getManagementEndpoint(): Promise<ManagementEndpoint>;
    createTunnel(port: number, resourceType: string, resourceName: string): Promise<TunnelConnection>;
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

    async createTunnel(port: number, resourceType: string, resourceName: string): Promise<TunnelConnection> {
        let target = await getResourcePod(this.kubeConfig, this.namespace, resourceType, resourceName);
        if (!target) {
            throw new Error(`Failed to get endpoint for ${resourceType} ${resourceName} in namespace ${this.namespace}`);
        }
        let portForward = new PortForward(this.kubeConfig);

        let server = net.createServer((socket) => {
            portForward.portForward(this.namespace, target.pod, [target.port], socket, null, socket);
        });

        server = server.listen(port, '127.0.0.1');

        await new Promise<void>((resolve, reject) => {
            server.once('listening', resolve);
            server.once('error', reject);
        });

        return new TunnelConnection(server, resourceName, resourceType);
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

export class TunnelConnection {
    private _server: net.Server | undefined = undefined;
    private _resourceName: string;
    private _resourceType: string;

    constructor(server: net.Server, resourceName: string, resourceType: string) {
        this._server = server;
        this._resourceName = resourceName;
        this._resourceType = resourceType;
    }

    async close(): Promise<void> {
        console.log(`Closing tunnel for ${this.resourceType} ${this.resourceName}`);
        if (this._server) {
            this._server.close();
            this._server = undefined;
        }
    }

    public get port(): number | undefined {
        if (!this._server) {
            return undefined;
        }
        const address = this._server.address();
        if (address === null) {
            return undefined;
        }
        if (typeof address === 'string') {
            return undefined;
        }
        let addr: AddressInfo = address;
        return addr.port;
    }

    public get resourceName(): string {
        return this._resourceName;
    }

    public get resourceType(): string {
        return this._resourceType;
    }
}

async function getDrasiApiPod(kubeConfig: KubeConfig, namespace: string): Promise<string | undefined> {
    const client = kubeConfig.makeApiClient(CoreV1Api);
    const ep = await client.readNamespacedEndpoints({
        namespace: namespace,
        name: "drasi-api",        
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

async function getResourcePod(kubeConfig: KubeConfig, namespace: string, resourceType: string, resourceName: string) {
    if (!["source", "reaction"].includes(resourceType)) {
        throw new Error(`Invalid resource type: ${resourceType}`);
    }
    
    const client = kubeConfig.makeApiClient(CoreV1Api);
    const endpoints = await client.listNamespacedEndpoints({
        namespace: namespace,
        labelSelector: `drasi/type=${resourceType},drasi/resource=${resourceName}`,
    });

    for (let ep of endpoints.items) {    
        for (let ss of ep.subsets ?? []) {
            for (let addr of ss.addresses ?? []) {
                if (addr.targetRef?.kind === "Pod") {
                    console.log(`Found pod ${addr.targetRef.name} for ${resourceType} ${resourceName}`);
                    if (ss.ports?.length === 1) {
                        console.log(`Found port ${ss.ports[0].port} for ${resourceType} ${resourceName}`);

                        return {
                            pod: addr.targetRef.name ?? "",
                            port: ss.ports[0].port,
                        };
                    }
                }
            }
        }
    }
    return undefined;
}