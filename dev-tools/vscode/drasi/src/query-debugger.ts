import * as vscode from 'vscode';
import { ContinuousQuery } from './models/continuous-query';
import { queryResultsView } from './webview/query-results-view';
import { DrasiClient } from './drasi-client';
import { Disposable } from 'vscode';

export class QueryDebugger {
  private log: vscode.OutputChannel;
  private session: Disposable | undefined;
  private query: ContinuousQuery;
  private resultsPanel: vscode.WebviewPanel | undefined;
  private extensionUri: vscode.Uri;
  private drasiClient: DrasiClient;

  constructor(query: ContinuousQuery, extensionUri: vscode.Uri, drasiClient: DrasiClient) {
    this.log = vscode.window.createOutputChannel("Query: " + query.name, { log: true });
    this.log.show();
    this.extensionUri = extensionUri;
    this.query = query;
    this.drasiClient = drasiClient;
  }

  async start() {
    try {
      let self = this;
      this.session = await this.drasiClient.debugQuery(this.query.spec,
        (data: any) => {
          self.log.appendLine('Received message: ' + JSON.stringify(data));
          self.handleIncomingMessage(data);
        },
        (error: string) => {
          self.log.appendLine('Error: ' + error);
        });

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

    this.resultsPanel.webview.html = queryResultsView(this.resultsPanel.webview, this.extensionUri, "Initializing");

    this.resultsPanel.onDidDispose(() => {
      this.resultsPanel = undefined;
      this.stop();
    });
  }

  stop() {
    this.session?.dispose();
    this.log.dispose();
  }
}
