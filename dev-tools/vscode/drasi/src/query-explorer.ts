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
import * as os from 'os';
import * as fs from 'fs';
import * as path from 'path';
import { randomUUID } from 'crypto';

export class QueryExplorer implements vscode.TreeDataProvider<ExplorerNode> {
	
	private _onDidChangeTreeData: vscode.EventEmitter<ExplorerNode | undefined | void> = new vscode.EventEmitter<ExplorerNode | undefined | void>();
	readonly onDidChangeTreeData: vscode.Event<ExplorerNode | undefined | void> = this._onDidChangeTreeData.event;

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

    await vscode.window.withProgress({
      title: queryNode.label?.toString(),
      location: vscode.ProgressLocation.Notification,
      //cancellable: true
    }, async (progress, token) => {
      progress.report({ message: "Opening port..." });
      log.info("Opening port...");
      log.show();

      //token.onCancellationRequested()
      let portFwd = new PortForward("drasi-api", 8080);
      let port = await portFwd.start();
      log.info(`Using port ${port}`);
      try {
        log.info("Running query...");
        progress.report({ message: "Running query..." });
        let result = await axios.post<any[]>(`http://127.0.0.1:${port}/${query.apiVersion}/continuousQueries/debug`, query.spec);
        if (result.status !== 200) {
          log.error(`${result.data}`);
          return;
        }

        log.info(`info: query returned ${result.data.length} results`);

        let tmpFile = path.join(os.tmpdir(), randomUUID());
        //fs.rmSync(tmpFile);
        fs.writeFileSync(tmpFile, formatResults(result.data));
        vscode.commands.executeCommand("markdown.showPreview", vscode.Uri.file(tmpFile));
      }
      catch (err) {
        log.error(`error${err}`);
        if (err instanceof AxiosError) {
          let msg = err.response?.data;
          if (msg instanceof Object) {
            msg = JSON.stringify(msg);
          }
          msg = msg.replace(/[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g,"");
          //vscode.window.showErrorMessage(`${queryId} failed: ${msg}`);
          log.error(msg);

          let tmpFile = path.join(os.tmpdir(), randomUUID());
          //fs.rmSync(tmpFile);
          fs.writeFileSync(tmpFile, formatError(msg));
          vscode.commands.executeCommand("markdown.showPreview", vscode.Uri.file(tmpFile));
        }
        else {
          vscode.window.showErrorMessage(`${queryId} failed: ${err}`);
        }
      }
      finally {
        portFwd.stop();
      }

    });
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