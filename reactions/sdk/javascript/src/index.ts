import { DaprServer } from "@dapr/dapr";
import { ChangeEvent } from "./types/ChangeEvent";
import { ControlEvent } from "./types/ControlEvent";
import { readdirSync, readFileSync, writeFileSync } from "fs";
import { ReactionOptions } from "./options";

export { ReactionOptions } from "./options";
export { getConfigValue, parseJson, parseYaml } from "./utils";
export { ChangeEvent } from "./types/ChangeEvent";
export { ControlEvent } from "./types/ControlEvent";
export { RunningSignal } from "./types/RunningSignal";
export { BootstrapStartedSignal } from "./types/BootstrapStartedSignal";
export { BootstrapCompletedSignal } from "./types/BootstrapCompletedSignal";
export { StoppedSignal } from "./types/StoppedSignal";

/**
 * The function signature that is called when a change event is received.
 * 
 * @param event The change event from the query
 * @param queryConfig The configuration object for the query
 */
export type OnChangeEvent<TQueryConfig = any> = (event: ChangeEvent, queryConfig?: TQueryConfig) => Promise<void>;

/**
 * The function signature that is called when a control event is received.
 * 
 * @param event The control event from the query
 * @param queryConfig The configuration object for the query
 */
export type OnControlEvent<TQueryConfig = any> = (event: ControlEvent, queryConfig?: TQueryConfig) => Promise<void>;


/** 
 * A class that encapsulates all the functionality for a Drasi Reaction.
 * 
 * @template TQueryConfig The type of the query configuration object. This is defined per query in the Reaction manifest.
 * 
 * @example
 * ```typescript
 * let myReaction = new DrasiReaction(async (event: ChangeEvent) => {
 *   // Handle the event that describes the changes to the query results
 * });
 * myReaction.start();
 * ```
 * 
*/
export class DrasiReaction<TQueryConfig = any> {
    private onChangeEvent: OnChangeEvent;
    private onControlEvent: OnControlEvent | undefined;
    private daprServer: DaprServer;
    private pubSubName: string = process.env["PubsubName"] ?? "drasi-pubsub";
    private configDirectory: string = process.env["QueryConfigPath"] ?? "/etc/queries";
    private queryConfig: Map<string, any> = new Map<string, TQueryConfig>();
    private parseQueryConfig: (queryId: string, config: string) => TQueryConfig | undefined;
    private queryIds: string[] = [];

    /**
     * 
     * @param onChangeEvent {OnChangeEvent} The function that is called when a change event is received.
     * @param options {ReactionOptions} The options for the Reaction.
     */
    constructor(onChangeEvent: OnChangeEvent, options?: ReactionOptions<TQueryConfig>) {
        this.onChangeEvent = onChangeEvent;
        this.onControlEvent = options?.onControlEvent;
        this.parseQueryConfig = options?.parseQueryConfig;
        this.daprServer = new DaprServer({
            serverPort: '80'
        });
    }
    
    /**
     * Starts the Drasi Reaction.
     */
    public async start() {
        try {
            this.queryIds = readdirSync(this.configDirectory);
            for (let queryId of this.queryIds) {
                if (!queryId || queryId.startsWith('.')) 
                    continue;
                console.log(`Subscribing to query ${queryId}`);
                await this.daprServer.pubsub.subscribe(this.pubSubName, `${queryId}-results`, this.onMessage.bind(this));
                if (this.parseQueryConfig) {
                    let cfgStr = readFileSync(`${this.configDirectory}/${queryId}`, 'utf-8');
                    let cfg = this.parseQueryConfig(queryId, cfgStr);
                    this.queryConfig.set(queryId, cfg);
                }
            }
            await this.daprServer.start();
        }
        catch (err) {
            console.error(err);
            writeFileSync("/dev/termination-log", err.message);
            process.exit(1);
        }
    }

    public async stop() {
        await this.daprServer.stop();
    }

    public getQueryIds(): string[] {
        return this.queryIds;
    }

    async onMessage(data: any) {
        console.log(`Received ${data?.kind} sequence: ${data?.sequence} for query ${data?.queryId}`);
        let queryConfig = this.queryConfig.get(data.queryId);
        switch (data.kind) {
            case "change":
                await this.onChangeEvent(data, queryConfig);
                break;
            case "control":
                if (!this.onControlEvent) {
                    console.log("Received control event but no handler is registered");
                    return;
                }
                await this.onControlEvent(data, queryConfig);
                break;
            default:
                console.log("Unknown message kind: " + data.kind);
        }
    }
}
