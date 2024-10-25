/* eslint-disable @typescript-eslint/naming-convention */
import axios from "axios";
import { PortForward } from "./port-forward";
import { Resource, ResourceDTO } from "./models/resource";
import { ContinuousQuerySpec, ContinuousQueryStatus } from "./models/continuous-query";
import { SourceSpec, SourceStatus } from "./models/source";
import { ReactionSpec, ReactionStatus } from "./models/reaction";
import { CloseEvent, ErrorEvent, MessageEvent, WebSocket } from 'ws';
import { Stoppable } from "./models/stoppable";


export class DrasiClient {

    readonly servicePort = 8080;
    readonly serviceName = "drasi-api";

    constructor() {
        
    }

    async getContinuousQuery(name : string) {
        let portFwd = new PortForward(this.serviceName, this.servicePort);
        let port = await portFwd.start();
        try {
            let res = await axios.get<ResourceDTO<ContinuousQuerySpec, ContinuousQueryStatus>>(`http://127.0.0.1:${port}/v1/continuousQueries/${name}`, {
                validateStatus: () => true
            });

            if (res.status !== 200) {
                throw new Error(`Failed to get continuous queries: ${res.statusText}`);
            }

            return res.data;
        }
        finally {
            portFwd.stop();
        }        
    }

    async getContinuousQueries() {
        let portFwd = new PortForward(this.serviceName, this.servicePort);
        let port = await portFwd.start();
        try {
            let res = await axios.get<ResourceDTO<ContinuousQuerySpec, ContinuousQueryStatus>[]>(`http://127.0.0.1:${port}/v1/continuousQueries`, {
                validateStatus: () => true
            });

            if (res.status !== 200) {
                throw new Error(`Failed to get continuous queries: ${res.statusText}`);
            }

            return res.data;
        }
        finally {
            portFwd.stop();
        }        
    }

    async getSources() {
        let portFwd = new PortForward("drasi-api", 8080);
        let port = await portFwd.start();
        try {
            let res = await axios.get<ResourceDTO<SourceSpec, SourceStatus>[]>(`http://127.0.0.1:${port}/v1/sources`, {
                validateStatus: () => true
            });

            if (res.status !== 200) {
                throw new Error(`Failed to get sources: ${res.statusText}`);
            }

            return res.data;
        }
        finally {
            portFwd.stop();
        }        
    }

    async getReactions() {
        let portFwd = new PortForward(this.serviceName, this.servicePort);
        let port = await portFwd.start();
        try {
            let res = await axios.get<ResourceDTO<ReactionSpec, ReactionStatus>[]>(`http://127.0.0.1:${port}/v1/reactions`, {
                validateStatus: () => true
            });

            if (res.status !== 200) {
                throw new Error(`Failed to get reactions: ${res.statusText}`);
            }

            return res.data;
        }
        finally {
            portFwd.stop();
        }        
    }

    async deleteResource(kind: string, name: string) {
        let portFwd = new PortForward(this.serviceName, this.servicePort);
        let port = await portFwd.start();
        try {
            let res = await axios.delete(`http://127.0.0.1:${port}/v1/${kindRoutes[kind]}/${name}`, {
                validateStatus: () => true
            });
            if (res.status > 299 || res.status < 200) {
                throw new Error(`Failed to delete ${kind}: ${res.statusText}\n${res.data?.toString()}`);
            }
        }
        finally {
            portFwd.stop();
        }
    }

    async applyResource(resource: Resource<any>) {
        let portFwd = new PortForward(this.serviceName, this.servicePort);
        let port = await portFwd.start();
        try {
            let res = await axios.put(`http://127.0.0.1:${port}/${resource.apiVersion}/${kindRoutes[resource.kind]}/${resource.name}`, resource.spec, {
                validateStatus: () => true
            });
            if (res.status > 299 || res.status < 200) {
                console.log(res);
                throw new Error(`Failed to apply ${resource.kind}: ${res.statusText}\n${res.data?.toString()}`);
            }
        }
        finally {
            portFwd.stop();
        }
    }

    async watchQuery(queryId: string, onData: (data: any) => void): Promise<Stoppable> {
        let portFwd = new PortForward(this.serviceName, this.servicePort);
        let port = await portFwd.start();
        try {
            const response = await axios({
                method: 'get',
                url: `http://127.0.0.1:${port}/v1/continuousQueries/${queryId}/watch`,
                responseType: 'stream'
            });
        
            response.data.on('data', (chunk: any) => {
                let chunkStr = chunk.toString();
                if (chunkStr === "[" || chunkStr === "[\n") {
                    return;
                }
                
                if (chunkStr === "]" || chunkStr === "]\n") {
                    portFwd.stop();
                    return;
                }

                if (chunkStr === "," || chunkStr === ",\n") {
                    return;
                }                

                onData(JSON.parse(chunkStr));
            });
        
            response.data.on('end', () => {
                console.log('Finished streaming');
                portFwd.stop();
            });
        
            response.data.on('error', (err: any) => {
                console.error('Error streaming:', err);
                portFwd.stop();
            });
            
        }
        catch (err) {
            console.error(err);
            portFwd.stop();
        }
        return portFwd;
    }

    async debugQuery(spec: any, onData: (data: any) => void, onError: (error: string) => void): Promise<Stoppable> {
        let portFwd = new PortForward(this.serviceName, this.servicePort);
        let port = await portFwd.start();

        let socket = new WebSocket(`ws://127.0.0.1:${port}/v1/debug`);
        
        socket.onopen = function open() {
          console.log('connected to debug session');
          let req = JSON.stringify(spec);
          socket.send(req);
        };

        socket.onclose = function close(event: CloseEvent) {
          console.log("close debug session: " + event.reason);
          console.log('disconnected');
          portFwd.stop();
        };

        socket.onmessage = function message(event: MessageEvent) {      
            try {
              const jsonData = JSON.parse(event.data as string);
              onData(jsonData);
            } catch (error) {
                onError('Error parsing JSON: ' + error);
            }
          };

        socket.onerror = function(event: ErrorEvent) {      
            onError(event.message);
        };

        return {
            stop: () => {
                socket.close();
                portFwd.stop();
            }
        };
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