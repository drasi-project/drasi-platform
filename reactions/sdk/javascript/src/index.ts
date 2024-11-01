import { DaprServer } from "@dapr/dapr";
import { ChangeEvent } from "./types/ChangeEvent";
import { ControlEvent } from "./types/ControlEvent";
import { readdirSync, readFileSync } from "fs";

export type OnChangeEvent<TQueryConfig = any> = (event: ChangeEvent, queryConfig?: TQueryConfig) => void;
export type OnControlEvent<TQueryConfig = any> = (event: ControlEvent, queryConfig?: TQueryConfig) => void;
export { ChangeEvent } from "./types/ChangeEvent";
export { ControlEvent } from "./types/ControlEvent";

export type ReactionOptions<TQueryConfig = any> = {
    onControlEvent?: OnControlEvent;
    parseQueryConfig?: (queryId: string, config: string) => TQueryConfig;
}

export class DrasiReaction<TQueryConfig = any> {
    private onChangeEvent: OnChangeEvent;
    private onControlEvent: OnControlEvent | undefined;
    private daprServer: DaprServer;
    private pubSubName: string = process.env["PUBSUB"] ?? "drasi-pubsub";
    private configDirectory: string = process.env["QueryConfigPath"] ?? "/etc/queries";
    private queryConfig: Map<string, any> = new Map<string, TQueryConfig>();
    private parseQueryConfig: (queryId: string, config: string) => TQueryConfig | undefined;

    constructor(onChangeEvent: OnChangeEvent, options?: ReactionOptions<TQueryConfig>) {
        this.onChangeEvent = onChangeEvent;
        this.onControlEvent = options?.onControlEvent;
        this.parseQueryConfig = options?.parseQueryConfig;
        this.daprServer = new DaprServer({
            serverPort: '80'
        });
    }
    
    public async start() {
        let queryIds = readdirSync(this.configDirectory);
        for (let queryId of queryIds) {
            console.log(`Subscribing to query ${queryId}`);
            this.daprServer.pubsub.subscribe(this.pubSubName, `${queryId}-results`, this.onMessage.bind(this));
            if (this.parseQueryConfig) {
                let cfgStr = readFileSync(`${this.configDirectory}/${queryId}`, 'utf-8');
                let cfg = this.parseQueryConfig(queryId, cfgStr);
                this.queryConfig.set(queryId, cfg);
            }
        }
        await this.daprServer.start();
    }

    public async stop() {
        await this.daprServer.stop();
    }

    async onMessage(data: any) {
        console.log(`Received ${data?.kind} sequence: ${data?.sequence} for query ${data?.queryId}`);
        let queryConfig = this.queryConfig.get(data.queryId);
        switch (data.kind) {
            case "change":
                this.onChangeEvent(data, queryConfig);
                break;
            case "control":
                if (!this.onControlEvent) {
                    console.log("Received control event but no handler is registered");
                    return;
                }
                this.onControlEvent(data, queryConfig);
                break;
            default:
                console.log("Unknown message kind: " + data.kind);
        }
    }

}