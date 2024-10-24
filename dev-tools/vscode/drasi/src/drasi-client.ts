import axios from "axios";
import { PortForward } from "./port-forward";
import { ResourceDTO } from "./models/resource";
import { ContinuousQuerySpec, ContinuousQueryStatus } from "./models/continuous-query";
import { SourceSpec, SourceStatus } from "./models/source";
import { ReactionSpec, ReactionStatus } from "./models/reaction";
import { on } from "events";
import { Stoppable } from "./models/stoppable";


export class DrasiClient {
    constructor() {
        
    }

    async getContinuousQueries() {
        let portFwd = new PortForward("drasi-api", 8080);
        let port = await portFwd.start();
        try {
            let res = await axios.get<ResourceDTO<ContinuousQuerySpec, ContinuousQueryStatus>[]>(`http://127.0.0.1:${port}/v1/continuousQueries`);

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
            let res = await axios.get<ResourceDTO<SourceSpec, SourceStatus>[]>(`http://127.0.0.1:${port}/v1/sources`);

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
        let portFwd = new PortForward("drasi-api", 8080);
        let port = await portFwd.start();
        try {
            let res = await axios.get<ResourceDTO<ReactionSpec, ReactionStatus>[]>(`http://127.0.0.1:${port}/v1/reactions`);

            if (res.status !== 200) {
                throw new Error(`Failed to get reactions: ${res.statusText}`);
            }

            return res.data;
        }
        finally {
            portFwd.stop();
        }        
    }

    async watchQuery(queryId: string, onData: (data: any) => void): Promise<Stoppable> {
        let portFwd = new PortForward("drasi-api", 8080);
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
}