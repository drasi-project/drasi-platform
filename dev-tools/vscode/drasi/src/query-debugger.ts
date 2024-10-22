import * as vscode from 'vscode';
import { ContinuousQuery } from './models/continuous-query';
import { PortForward } from './port-forward';
import { CloseEvent, ErrorEvent, MessageEvent, WebSocket } from 'ws';
import { getUri } from './utilities/getUri';
import { getNonce } from './utilities/getNonce';

export class QueryDebugger {
    private log: vscode.OutputChannel;
    private socket: WebSocket | undefined;
    private query: ContinuousQuery;
    private portFwd: PortForward;
    private resultsPanel: vscode.WebviewPanel | undefined;
    private extensionUri: vscode.Uri;
  
    constructor(query: ContinuousQuery, extensionUri: vscode.Uri) {
      this.log = vscode.window.createOutputChannel("Query: " + query.name, { log: true });
      this.log.show();
      this.extensionUri = extensionUri;
      this.query = query;
      this.portFwd = new PortForward("drasi-api", 8080);
    }
  
    async start() {    
      try {
        let port = await this.portFwd.start();
        this.log.appendLine(`Using port ${port}`);
  
        this.log.appendLine(`connecting...`);
  
        let socket = new WebSocket(`ws://127.0.0.1:${port}/${this.query.apiVersion}/debug`);
        this.socket = socket;    
        let self = this;
        
        this.socket.onerror = function(event: ErrorEvent) {      
          self.log.appendLine(event.message);
        };
  
        this.socket.onopen = function open() {
          self.log.appendLine('connected');
          let req = JSON.stringify(self.query.spec);
          socket.send(req);
        };
  
        this.socket.onclose = function close(event: CloseEvent) {
          self.log.appendLine("close: " + event.reason);
          self.log.appendLine('disconnected');
          self.stop();
        };
  
        this.socket.onmessage = function message(event: MessageEvent) {      
          self.log.appendLine('received: ' + event.type + ' - ' + event.data);
          try {
            const jsonData = JSON.parse(event.data as string);
            self.handleIncomingMessage(jsonData);
          } catch (error) {
            self.log.appendLine('Error parsing JSON: ' + error);
          }
        };
        this.createResultsPanel();
      }
      catch (error) {
        this.log.appendLine('Error: ' + error);
        vscode.window.showErrorMessage('Error: ' + error);
      }
    }
  
    private handleIncomingMessage(message: any) {
      this.resultsPanel?.webview.postMessage(message);    
    }
  
    private createResultsPanel() {
      this.resultsPanel = vscode.window.createWebviewPanel(
        'queryResults',
        'Query Results: ' + this.query.name,
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
              console.log('Received message', message);
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
      this.socket?.close();
      this.portFwd.stop();
    }
  }
  