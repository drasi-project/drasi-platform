/**
 * Copyright 2024 The Drasi Authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import * as vscode from 'vscode';
import * as yaml from 'js-yaml';
import { ContinuousQuery } from './continuous-query';
import { PortForward } from './port-forward';
import axios, { AxiosError } from 'axios';
import { CloseEvent, ErrorEvent, MessageEvent, WebSocket } from 'ws';
import * as os from 'os';
import * as fs from 'fs';
import * as path from 'path';
import { randomUUID } from 'crypto';

export class QueryExplorer implements vscode.TreeDataProvider<ExplorerNode> {
	
	private _onDidChangeTreeData: vscode.EventEmitter<ExplorerNode | undefined | void> = new vscode.EventEmitter<ExplorerNode | undefined | void>();
	readonly onDidChangeTreeData: vscode.Event<ExplorerNode | undefined | void> = this._onDidChangeTreeData.event;
  private debuggers: Map<string, QueryDebugger> = new Map<string, QueryDebugger>();

  constructor () {
    vscode.commands.registerCommand('queries.refresh', this.refresh.bind(this));
    vscode.commands.registerCommand('queries.run', this.runQuery.bind(this));
    vscode.workspace.onDidSaveTextDocument((evt) => {
      if (evt.languageId === "yaml") {
        this.refresh();
      }
    });
  }

	refresh(): void {
		this._onDidChangeTreeData.fire();
	}
	
	getTreeItem(element: ExplorerNode): vscode.TreeItem | Thenable<vscode.TreeItem> {
		return element;
	}
	
	async getChildren(element?: ExplorerNode | undefined): Promise<ExplorerNode[]> {
   	//let files = await vscode.workspace.findFiles('**/*.yaml');
		if (!vscode.workspace.workspaceFolders)
			return [];
			
		if (!element) {
			let result: any[] = [];

			let files = await vscode.workspace.findFiles('**/*.yaml');
			
			for (let f of files.sort()) {
				try
        {
          let content = await vscode.workspace.fs.readFile(f);
          let docs: any[] = yaml.loadAll(content.toString());
          let hasQueries = docs.some(x => !!x && x.kind === "ContinuousQuery");

          if (hasQueries)
            result.push(new FileNode(f));
        }
        catch (err) {
          console.error(err);
        }
			}

			return result;
		}
		let result: ExplorerNode[] = [];
		if (!element.resourceUri)
			return result;

		if (element.resourceUri.query)
		  return result;

		try {
      let content = await vscode.workspace.fs.readFile(element.resourceUri);
      let docs: any[] = yaml.loadAll(content.toString());
      
      for (let qry of docs.filter(x => !!x && x.kind === "ContinuousQuery" && x.name)) {
        let queryUri = vscode.Uri.parse(element.resourceUri.toString() + "#" + qry.name);
        let node = new QueryNode(qry, queryUri);
        result.push(node);
      }
    }
    catch (err) {
      console.error(err);
    }
		
		return result;
	}

  async runQuery(queryNode: QueryNode) {
    if (!queryNode)
      return;

    if (!queryNode.resourceUri)
      return;

    let queryId = queryNode.resourceUri.fragment;

    let log = vscode.window.createOutputChannel(queryId, { log: true });
    log.show();    
    
    let content = await vscode.workspace.fs.readFile(vscode.Uri.file(queryNode.resourceUri.path));
    let docs: any[] = yaml.loadAll(content.toString());

    let query = docs.find(x => !!x && x.kind === "ContinuousQuery" && x.name === queryNode.resourceUri?.fragment);

    if (!query)
      return;

    let debuggerId = randomUUID();    
    let debgger = new QueryDebugger(log, query);
    this.debuggers.set(debuggerId, debgger);
    debgger.start();   
    
  }
}

class ExplorerNode extends vscode.TreeItem {

}

class FileNode extends ExplorerNode {
	contextValue = 'fileNode';

  constructor (uri: vscode.Uri) {
    super(uri, vscode.TreeItemCollapsibleState.Expanded);
  }
}

class QueryNode extends ExplorerNode {
	contextValue = 'queryNode';

  constructor (query: ContinuousQuery, uri: vscode.Uri) {
    super(uri);
    this.label = query.name;
    this.command = {
      command: "vscode.open",
      title: "Open",
      arguments: [uri]
    };
  }
}

function formatError(err: any) {
  return "```\n" + err + "\n```";
};


function formatResults(data: any[]): string {
  let headers = new Set<string>();

  for (let item of data) {
    for (let k of Object.keys(item)) {
      headers.add(k);
    }
  }

  let result = "";
  for (let h of headers) {
    result += `|${h}`;
  }
  result += `|${os.EOL}`;

  for (let h of headers) {
    result += `|-`;
  }
  result += `|${os.EOL}`;

  for (let item of data) {
    for (let h of headers) {
      result += `|${item[h]}`;
    }
    result += `|${os.EOL}`;
  }
  
  return result;
}

class QueryDebugger {
  private log: vscode.OutputChannel;
  private socket: WebSocket | undefined;
  private query: ContinuousQuery;
  private portFwd: PortForward;
  private resultsPanel: vscode.WebviewPanel | undefined;
  private statusBarItem: vscode.StatusBarItem;

  constructor(log: vscode.OutputChannel, query: ContinuousQuery) {
    this.log = log;
    this.query = query;
    this.portFwd = new PortForward("drasi-api", 8080);
    this.statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left);
    this.statusBarItem.show();
  }

  async start() {    
    let port = await this.portFwd.start();
    this.log.appendLine(`Using fwd port ${port}`);

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

  private handleIncomingMessage(message: any) {
    if (message.kind === 'change') {
      this.updateResults(message);
    } else if (message.kind === 'control') {
      this.updateControl(message);
    }
  }

  private updateResults(changeEvent: any) {
    if (this.resultsPanel) {
      this.resultsPanel.webview.postMessage({ type: 'update', data: changeEvent });
    }
  }

  private updateControl(controlEvent: any) {
    const { kind } = controlEvent.controlSignal;
    this.statusBarItem.text = `Query Status: ${kind}`;
  }

  private createResultsPanel() {
    this.resultsPanel = vscode.window.createWebviewPanel(
      'queryResults',
      'Query Results',
      vscode.ViewColumn.One,
      {
        enableScripts: true,
        retainContextWhenHidden: true,        
      }
    );

    this.resultsPanel.webview.html = this.getWebviewContent();

    this.resultsPanel.onDidDispose(() => {
      this.resultsPanel = undefined;
    });

    console.log('Results panel created');

  }

  private getWebviewContent() {
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
          th { background-color: #f2f2f2; }
        </style>
      </head>
      <body>
        <table id="resultsTable">
          <thead>
            <tr id="headerRow"></tr>
          </thead>
          <tbody id="resultsBody"></tbody>
        </table>
        <script>
          const vscode = acquireVsCodeApi();
          const resultsTable = document.getElementById('resultsTable');
          const headerRow = document.getElementById('headerRow');
          const resultsBody = document.getElementById('resultsBody');
          let results = new Map();

          window.addEventListener('message', event => {
            const message = event.data;
            if (message.type === 'update') {
              updateResults(message.data);
            }
          });

          function updateResults(changeEvent) {
            const { addedResults, updatedResults, deletedResults } = changeEvent;

            // Add new results
            for (const result of addedResults) {
              results.set(JSON.stringify(result), result);
            }

            // Update existing results
            for (const update of updatedResults) {
              const oldKey = JSON.stringify(update.before);
              const newKey = JSON.stringify(update.after);
              results.delete(oldKey);
              results.set(newKey, update.after);
            }

            // Delete results
            for (const result of deletedResults) {
              results.delete(JSON.stringify(result));
            }

            renderTable();
          }

          function renderTable() {
            // Clear existing table
            headerRow.innerHTML = '';
            resultsBody.innerHTML = '';

            // Get all unique keys
            const allKeys = new Set();
            for (const result of results.values()) {
              Object.keys(result).forEach(key => allKeys.add(key));
            }

            // Create header row
            for (const key of allKeys) {
              const th = document.createElement('th');
              th.textContent = key;
              headerRow.appendChild(th);
            }

            // Create table rows
            for (const result of results.values()) {
              const tr = document.createElement('tr');
              for (const key of allKeys) {
                const td = document.createElement('td');
                td.textContent = result[key] || '';
                tr.appendChild(td);
              }
              resultsBody.appendChild(tr);
            }
          }
        </script>
      </body>
      </html>
    `;
  }

  stop() {
    this.socket?.close();
    this.portFwd.stop();
    this.resultsPanel?.dispose();
    this.statusBarItem.dispose();
  }
}
