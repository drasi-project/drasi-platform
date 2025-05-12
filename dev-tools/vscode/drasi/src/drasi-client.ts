/* eslint-disable @typescript-eslint/naming-convention */
import axios, { AxiosResponse } from "axios";
import { Resource, ResourceDTO } from "./models/resource";
import { ContinuousQuerySpec, ContinuousQueryStatus } from "./models/continuous-query";
import { SourceSpec, SourceStatus } from "./models/source";
import { ReactionSpec, ReactionStatus } from "./models/reaction";
import { CloseEvent, ErrorEvent, MessageEvent, WebSocket } from 'ws';
import { createPlatformClient, ManagementEndpoint, PlatformClient, TunnelConnection } from "./sdk/platform-client";
import { ConfigurationRegistry } from "./sdk/config";
import { Disposable } from "vscode";


export class DrasiClient {

    private configRegistry: ConfigurationRegistry;
    private configHash: number = 0;

    private platformClient: PlatformClient | undefined = undefined;
    private managementEndpoint: ManagementEndpoint | undefined = undefined;
    private readonly timeout = 10000;

    constructor(configRegistry: ConfigurationRegistry) {
        this.configRegistry = configRegistry;
    }

    private async initPlatformClient() {
        let registration = await this.configRegistry.loadCurrentRegistration();
        if (!registration) {
            throw new Error("No registration found");
        }
        console.log(`Using registration: ${registration.kind}:${registration.id}`);
        let hash = hashObject(registration);
        if (this.configHash !== hash) {
            console.log("Config hash changed, creating new platform client");
            this.configHash = hash;
            this.platformClient = undefined;
            this.managementEndpoint = undefined;
        }

        if (!this.platformClient) {
            console.log("Creating platform client");
            this.platformClient = createPlatformClient(registration);
        }
    }

    private async getSharedManagementEndpoint() {        
        await this.initPlatformClient();

        if (!this.platformClient) {
            throw new Error("Platform client not initialized");
        }
        
        if (!this.managementEndpoint) {
            console.log("Creating management endpoint");
            this.managementEndpoint = await this.platformClient.getManagementEndpoint();
        }

        return this.managementEndpoint;
    }

    private async getIsolatedManagementEndpoint() {
        await this.initPlatformClient();
        if (!this.platformClient) {
            throw new Error("Platform client not initialized");
        }

        return await this.platformClient.getManagementEndpoint();
    }

    private async get<T = any>(path: string): Promise<AxiosResponse<T>> {
        let endpoint = await this.getSharedManagementEndpoint();
        let addr = await endpoint.getManagementAddr();
        
        try {
            let res = await axios.get<T>(`http://${addr}/v1/${path}`, {
                validateStatus: () => true,
                timeout: this.timeout,           
            });

            return res;
        } catch (err) {
            console.error(`Error getting ${path}: ${err}`);
            await endpoint.close();
            throw err;
        }
    }

    private async delete(path: string): Promise<AxiosResponse> {
        let endpoint = await this.getSharedManagementEndpoint();
        let addr = await endpoint.getManagementAddr();
        
        try {
            let res = await axios.delete(`http://${addr}/v1/${path}`, {
                validateStatus: () => true,
                timeout: this.timeout,           
            });

            return res;
        } catch (err) {
            console.error(`Error deleting ${path}: ${err}`);
            await endpoint.close();
            throw err;
        }
    }

    private async put(path: string, data: any): Promise<AxiosResponse> {
        let endpoint = await this.getSharedManagementEndpoint();
        let addr = await endpoint.getManagementAddr();
        try {
            let res = await axios.put(`http://${addr}/v1/${path}`, data, {
                validateStatus: () => true,
                timeout: this.timeout,           
            });
            return res;
        } catch (err) {
            console.error(`Error putting ${path}: ${err}`);
            await endpoint.close();
            throw err;
        }
    }

    private async wait(path: string): Promise<boolean> {
        let endpoint = await this.getSharedManagementEndpoint();
        let addr = await endpoint.getManagementAddr();
        
        try {
            let res = await axios.get(`http://${addr}/v1/${path}/ready-wait`, {
                validateStatus: () => true,
                timeout: 30000,
            });

            return res.status >= 200 && res.status < 300;
        } catch (err) {
            console.error(`Error waiting for ready ${path}: ${err}`);
            return false;
        }
    }

    async close() {
        if (this.managementEndpoint) {            
            await this.managementEndpoint.close();
            this.managementEndpoint = undefined;
        }
    }

    async getCurrentRegistrationId() {
        return await this.configRegistry.getCurrentRegistrationId();
    }

    async getContinuousQuery(name : string) {
        let res = await this.get<ResourceDTO<ContinuousQuerySpec, ContinuousQueryStatus>>(`continuousQueries/${name}`);

        if (res.status !== 200) {
            throw new Error(`Failed to get continuous queries: ${res.statusText}`);
        }

        return res.data;     
    }

    async getContinuousQueries() {        
        let res = await this.get<ResourceDTO<ContinuousQuerySpec, ContinuousQueryStatus>[]>(`continuousQueries`);

        if (res.status !== 200) {
            throw new Error(`Failed to get continuous queries: ${res.statusText}`);
        }

        return res.data;    
    }

    async getSources() {
        let res = await this.get<ResourceDTO<SourceSpec, SourceStatus>[]>(`sources`);

        if (res.status !== 200) {
            throw new Error(`Failed to get sources: ${res.statusText}`);
        }

        return res.data;     
    }

    async getReactions() {
        let res = await this.get<ResourceDTO<ReactionSpec, ReactionStatus>[]>(`reactions`);

        if (res.status !== 200) {
            throw new Error(`Failed to get reactions: ${res.statusText}`);
        }

        return res.data;    
    }

    async deleteResource(kind: string, name: string) {
        let res = await this.delete(`${kindRoutes[kind]}/${name}`);
        if (res.status > 299 || res.status < 200) {
            throw new Error(`Failed to delete ${kind}: ${res.statusText}\n${res.data?.toString()}`);
        }
    }

    async applyResource(resource: Resource<any>, onReady?: () => void) {
        let res = await this.put(`${kindRoutes[resource.kind]}/${resource.name}`, resource.spec);
        if (res.status > 299 || res.status < 200) {
            console.log(res);
            throw new Error(`Failed to apply ${resource.kind}: ${res.statusText}\n${res.data?.toString()}`);
        }

        if (onReady) {
            this.wait(`${kindRoutes[resource.kind]}/${resource.name}`).then((res) => {
                console.log(`Resource ${resource.kind} ${resource.name} ready wait response: ${res}`);
                onReady();
            });
        }
    }

    async watchQuery(queryId: string, onData: (data: any) => void): Promise<Disposable> {
        let endpoint = await this.getIsolatedManagementEndpoint();
        let addr = await endpoint.getManagementAddr();
        let abortController = new AbortController();
        try {
            const response = await axios({
                method: 'get',
                url: `http://${addr}/v1/continuousQueries/${queryId}/watch`,
                responseType: 'stream',
                timeout: 0,
                signal: abortController.signal,
            });
        
            response.data.on('data', (chunk: any) => {
                let chunkStr = chunk.toString();
                if (chunkStr === "[" || chunkStr === "[\n") {
                    return;
                }
                
                if (chunkStr === "]" || chunkStr === "]\n") {
                    endpoint.close();
                    return;
                }

                if (chunkStr === "," || chunkStr === ",\n") {
                    return;
                }                

                onData(JSON.parse(chunkStr));
            });
        
            response.data.on('end', () => {
                console.log('Finished streaming');
                endpoint.close();
            });
        
            response.data.on('error', (err: any) => {
                console.error('Error streaming:', err);
                endpoint.close();
            });
            
        }
        catch (err) {
            console.error(err);
            endpoint.close();
        }
        return {
            dispose: () => {
                console.log("Stopping watch query");                
                abortController.abort();
                endpoint.close();
            }
        };
    }

    async debugQuery(spec: any, onData: (data: any) => void, onError: (error: string) => void): Promise<Disposable> {
        let endpoint = await this.getIsolatedManagementEndpoint();
        let addr = await endpoint.getManagementAddr();

        let socket = new WebSocket(`ws://${addr}/v1/debug`);
        
        socket.onopen = function open() {
          console.log('connected to debug session');
          let req = JSON.stringify(spec);
          socket.send(req);
        };

        socket.onclose = function close(event: CloseEvent) {
          console.log("close debug session: " + event.reason);
          console.log('disconnected');
          endpoint.close();
        };

        socket.onmessage = function message(event: MessageEvent) {      
            try {
              const jsonData = JSON.parse(event.data as string);
              onData(jsonData);
            } catch (error) {
                onError('Error parsing JSON: ' + error);
                endpoint.close();
            }
          };

        socket.onerror = function(event: ErrorEvent) {      
            onError(event.message);
            endpoint.close();
        };

        return {
            dispose: () => {
                socket.close();
                endpoint.close();
            }
        };
    }

    async createTunnel(port: number, resourceName: string, resourceType: string): Promise<TunnelConnection> {
        await this.initPlatformClient();
        if (!this.platformClient) {
            throw new Error("Platform client not initialized");
        }

        return await this.platformClient.createTunnel(port, resourceName, resourceType);
    }
}

const kindRoutes: Record<string, string> = {
    "Source": "sources",    
    "ContinuousQuery": "continuousQueries",
    "continuousQuery": "continuousQueries",
    "Query": "continuousQueries",
    "QueryContainer": "queryContainers",
    "queryContainer": "queryContainers",
    "Reaction": "reactions",
    "SourceProvider": "sourceProviders",
    "sourceProvider": "sourceProviders",
    "ReactionProvider": "reactionProviders",
    "reactionProvider": "reactionProviders"
};


function hashString(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return hash;
}

function hashObject(obj: any): number {
    return hashString(JSON.stringify(obj));
}