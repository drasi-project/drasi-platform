import { getConnection } from './connection-pool'
/*
export default class ReactionListener {
    constructor(url, queryId, onMessage) {
        this.url = url;
        this.queryId = queryId;
        this.onMessage = onMessage;
        this.sigRConn = getConnection(url);     
        this.reloadData = []; 
        
        let self = this;

        this.sigRConn.started
        .then(result => {
            self.sigRConn.connection.on(self.queryId, self.onMessage);            
            }
        );
    }

    reload(callback) {
        console.log("requesting reload for " + this.queryId);
        let self = this;

        this.sigRConn.started
        .then(_ => {
            self.sigRConn.connection.stream("reload", this.queryId)
            .subscribe({
                next: item => {
                console.log(self.queryId + " reload next: " + JSON.stringify(item));
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
                console.log(self.queryId + " reload complete");
                if (callback) {
                    callback(self.reloadData);
                }
                
                },
                error: err => console.error(self.queryId + err)
            });
        });
      }
}
*/