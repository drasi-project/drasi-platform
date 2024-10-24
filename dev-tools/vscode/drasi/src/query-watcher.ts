import * as vscode from 'vscode';
import { getUri } from './utilities/getUri';
import { getNonce } from './utilities/getNonce';
import { DrasiClient } from './drasi-client';
import { Stoppable } from './models/stoppable';

export class QueryWatcher {
    private log: vscode.OutputChannel;
    private client: DrasiClient = new DrasiClient();
    private queryId: string;
    
    private resultsPanel: vscode.WebviewPanel | undefined;
    private watcher: Stoppable | undefined;
    private extensionUri: vscode.Uri;
  
    constructor(queryId: string, extensionUri: vscode.Uri) {
      this.log = vscode.window.createOutputChannel("Query: " + queryId, { log: true });
      this.log.show();
      this.extensionUri = extensionUri;
      this.queryId = queryId;
    }
  
    async start() {    
      try {
        this.createResultsPanel();
        this.watcher = await this.client.watchQuery(this.queryId, this.handleIncomingMessage.bind(this));        
      }
      catch (error) {
        this.log.appendLine('Error: ' + error);
        vscode.window.showErrorMessage('Error: ' + error);
      }
    }
  
    private handleIncomingMessage(message: any) {
      console.log('Received message', message);
      this.resultsPanel?.webview.postMessage(message);    
    }
  
    private createResultsPanel() {
      this.resultsPanel = vscode.window.createWebviewPanel(
        'queryResults',
        'Query Results: ' + this.queryId,
        vscode.ViewColumn.One,
        {
          enableScripts: true,
          retainContextWhenHidden: true,
          localResourceRoots: [vscode.Uri.joinPath(this.extensionUri, 'out')]    
        }
      );
  
      this.resultsPanel.webview.html = this.getWebviewContent(this.resultsPanel.webview, this.extensionUri);
  
      this.resultsPanel.onDidDispose(() => {
        this.resultsPanel = undefined;
        this.stop();
      });
    }
  
    private getWebviewContent(webview: vscode.Webview, extensionUri: vscode.Uri) {
      const webviewUri = getUri(webview, extensionUri, ["out", "webview.js"]);
      const nonce = getNonce();
      
      return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Query Results</title>
          <style>
            table { border-collapse: collapse; width: 100%; }
            th, td { border: 1px solid #ddd; padding: 8px; }          
          </style>
        </head>
        <body>
          <div id="status">
          <h3>
            Status: <vscode-tag id="statusText"></vscode-tag>
          </h3>
          </div>
          <div id="errors"></div>
          <vscode-divider></vscode-divider>
          <vscode-data-grid id="resultsTable" generate-header="sticky"></vscode-data-grid>        
          <script type="module" nonce="${nonce}" src="${webviewUri}"></script>
          <script nonce="${nonce}">
            const vscode = acquireVsCodeApi();
            const resultsTable = document.getElementById('resultsTable');
            const statusText = document.getElementById('statusText');
            const errors = document.getElementById('errors');
            let results = new Map();
  
            window.addEventListener('message', event => {
              const message = event.data;
              switch (message.kind) {
                case 'control':
                  statusText.innerText = message.controlSignal?.kind;
                  break;
                case 'error':
                  const newItem = document.createElement('p');
                  newItem.textContent = message.message;
                  errors.appendChild(newItem);
                  break;
                case 'change':
                  updateResults(message);
                  break;
              }
            });
  
            function updateResults(changeEvent) {
              const { addedResults, updatedResults, deletedResults } = changeEvent;
  
              for (const result of addedResults) {
                results.set(JSON.stringify(result), result);
              }
  
              for (const update of updatedResults) {
                const oldKey = JSON.stringify(update.before);
                const newKey = JSON.stringify(update.after);
                results.delete(oldKey);
                results.set(newKey, update.after);
              }
  
              for (const result of deletedResults) {
                results.delete(JSON.stringify(result));
              }
  
              renderTable();
            }
  
            function renderTable() {
              let data = Array.from(results.values());            
              resultsTable.rowsData = data;
            }
          </script>
        </body>
        </html>
      `;
    }
  
    stop() {
      this.watcher?.stop();
    }
  }
  