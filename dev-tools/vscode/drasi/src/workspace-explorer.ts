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
import { ContinuousQuery } from './models/continuous-query';
import { QueryDebugger } from './query-debugger';
import { SourceProvider } from './models/source-provider';
import { ReactionProvider } from './models/reaction-provider';
import { validateSourceProvider } from './source-provider-explorer';
import { validateReactionProvider } from './reaction-provider-explorer';

export class WorkspaceExplorer implements vscode.TreeDataProvider<ExplorerNode> {
	
	private _onDidChangeTreeData: vscode.EventEmitter<ExplorerNode | undefined | void> = new vscode.EventEmitter<ExplorerNode | undefined | void>();
	readonly onDidChangeTreeData: vscode.Event<ExplorerNode | undefined | void> = this._onDidChangeTreeData.event;
  private extensionUri: vscode.Uri;

  constructor (extensionUri: vscode.Uri) {
    this.extensionUri = extensionUri;
    vscode.commands.registerCommand('workspace.refresh', this.refresh.bind(this));
    vscode.commands.registerCommand('workspace.query.run', this.runQuery.bind(this));
    vscode.commands.registerCommand('workspace.sourceProvider.validate', validateSourceProvider);
    vscode.commands.registerCommand('workspace.reactionProvider.validate', validateReactionProvider);
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
          let hasSourceProviders = docs.some(x => !!x && x.kind === "SourceProvider");
          let hasReactionProviders = docs.some(x => !!x && x.kind === "ReactionProvider");

          if (hasQueries || hasSourceProviders || hasReactionProviders) {
            result.push(new FileNode(f));
          }
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

      for (let item of docs.filter(x => !!x && x.kind === "SourceProvider" && x.name)) {
        let itemUri = vscode.Uri.parse(element.resourceUri.toString() + "#" + item.name);
        let node = new SourceProviderNode(item, itemUri);
        result.push(node);
      }

      for (let item of docs.filter(x => !!x && x.kind === "ReactionProvider" && x.name)) {
        let itemUri = vscode.Uri.parse(element.resourceUri.toString() + "#" + item.name);
        let node = new ReactionProviderNode(item, itemUri);
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
    
    let content = await vscode.workspace.fs.readFile(vscode.Uri.file(queryNode.resourceUri.path));
    let docs: any[] = yaml.loadAll(content.toString());
    let query = docs.find(x => !!x && x.kind === "ContinuousQuery" && x.name === queryNode.resourceUri?.fragment);

    if (!query)
      return;

    let dbg = new QueryDebugger(query, this.extensionUri);    
    dbg.start();   
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
    this.iconPath = new vscode.ThemeIcon('file-code');
    this.label = query.name;
    this.command = {
      command: "vscode.open",
      title: "Open",
      arguments: [uri]
    };
  }
}

class SourceProviderNode extends ExplorerNode {
	contextValue = 'sourceProviderNode';

  constructor (sp: SourceProvider, uri: vscode.Uri) {
    super(uri);
    this.label = sp.name;
    this.command = {
      command: "vscode.open",
      title: "Open",
      arguments: [uri]
    };
  }
}

class ReactionProviderNode extends ExplorerNode {
	contextValue = 'reactionProviderNode';

  constructor (query: ReactionProvider, uri: vscode.Uri) {
    super(uri);
    this.label = query.name;
    this.command = {
      command: "vscode.open",
      title: "Open",
      arguments: [uri]
    };
  }
}

