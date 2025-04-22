import * as vscode from 'vscode';
import { DrasiClient } from './drasi-client';
import { queryResultsView } from './webview/query-results-view';
import { ContinuousQueryStatus } from './models/continuous-query';
import { Disposable } from 'vscode';

export class QueryWatcher {
    private log: vscode.OutputChannel;
    readonly client: DrasiClient;
    private queryId: string;
    
    private resultsPanel: vscode.WebviewPanel | undefined;
    private watcher: Disposable | undefined;
    private extensionUri: vscode.Uri;
  
    constructor(queryId: string, extensionUri: vscode.Uri, client: DrasiClient) {
      this.client = client;
      this.log = vscode.window.createOutputChannel("Query: " + queryId, { log: true });
      this.log.show();
      this.extensionUri = extensionUri;
      this.queryId = queryId;
    }
  
    async start() {    
      try {
        let query = await this.client.getContinuousQuery(this.queryId);
        this.createResultsPanel(query.status);
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
  
    private createResultsPanel(intialStatus: ContinuousQueryStatus) {
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
  
      this.resultsPanel.webview.html = queryResultsView(this.resultsPanel.webview, this.extensionUri, intialStatus.status);
  
      this.resultsPanel.onDidDispose(() => {
        this.resultsPanel = undefined;
        this.stop();
      });
    }
  
    stop() {
      this.watcher?.dispose();
    }
  }
  