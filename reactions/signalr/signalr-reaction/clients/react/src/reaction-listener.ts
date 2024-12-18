import { getConnection } from './connection-pool'
import { ChangeNotification, ControlSignalNotification } from './unpacked-generated';

/**
 * A listener for change notifications and control signals from the Drasi SignalR Reaction.
 * 
 * @example
 * ```typescript
 * const listener = new ReactionListener("http://localhost:5000/hub", "query1", (event) => {
 *  console.log(event);
 * });
 * ```
 */
export default class ReactionListener {
    private url: string;
    private queryId: string;
    private onMessage: (event: ChangeNotification | ControlSignalNotification) => void;
    private sigRConn: any;
    private reloadData: any[];

    /**
     * Creates a new ReactionListener.
     * @param url Url of the SignalR endpoint
     * @param queryId Query ID to subscribe to
     * @param onMessage Callback for change notifications and control signals
     * 
     */ 
    constructor(url: string, queryId: string, onMessage: (event: ChangeNotification | ControlSignalNotification) => void) {
        this.url = url;
        this.queryId = queryId;
        this.onMessage = onMessage;
        this.sigRConn = getConnection(url);
        this.reloadData = [];
        let self = this;
        this.sigRConn.started
            .then(() => self.sigRConn.connection.on(self.queryId, self.onMessage));
    }

    /**
     * Fetches the current state of the result set.
     * @param callback Callback for the reloaded data.
     */
    reload(callback: (data: any[]) => void) {
        let self = this;

        this.sigRConn.started
            .then((_: any) => {
                self.sigRConn.connection.stream("reload", this.queryId)
                    .subscribe({
                        next: (item: { [x: string]: any; payload: { after: any; }; }) => {
                            switch (item['op']) {
                                case 'h':
                                    self.reloadData = [];
                                    break;
                                case 'r':
                                    self.reloadData.push(item.payload.after);
                                    break;
                            }
                        },
                        complete: () => {
                            if (callback) {
                                callback(self.reloadData);
                            }
                        },
                        error: (err: any) => console.error(self.queryId + ": " + err)
                    });
            });
    }
}
