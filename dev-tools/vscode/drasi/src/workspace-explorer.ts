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
import { validateSourceProvider } from './source-provider-validator';
import { validateReactionProvider } from './reaction-provider-validator';
import { Resource } from './models/resource';
import { DrasiClient } from './drasi-client';

export class WorkspaceExplorer implements vscode.TreeDataProvider<ExplorerNode> {
	
	private _onDidChangeTreeData: vscode.EventEmitter<ExplorerNode | undefined | void> = new vscode.EventEmitter<ExplorerNode | undefined | void>();
	readonly onDidChangeTreeData: vscode.Event<ExplorerNode | undefined | void> = this._onDidChangeTreeData.event;
  private extensionUri: vscode.Uri;
  private drasiClient: DrasiClient;

  constructor (extensionUri: vscode.Uri, drasiClient: DrasiClient) {
    this.extensionUri = extensionUri;
    this.drasiClient = drasiClient;
    vscode.commands.registerCommand('workspace.refresh', this.refresh.bind(this));
    vscode.commands.registerCommand('workspace.query.run', this.runQuery.bind(this));
    vscode.commands.registerCommand('workspace.resource.apply', this.applyResource.bind(this));
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
   	if (!vscode.workspace.workspaceFolders) {
			return [];
    }
			
		if (!element) {
			let result: any[] = [];

			let files = await vscode.workspace.findFiles('**/*.yaml');
			
			for (let f of files.sort()) {
				try
        {
          let content = await vscode.workspace.fs.readFile(f);
          let docs: any[] = yaml.loadAll(content.toString());
          let hasQueries = docs.some(x => !!x && x.kind === "ContinuousQuery");
          let hasSources = docs.some(x => !!x && x.kind === "Source");
          let hasReactions = docs.some(x => !!x && x.kind === "Reaction");
          let hasSourceProviders = docs.some(x => !!x && x.kind === "SourceProvider");
          let hasReactionProviders = docs.some(x => !!x && x.kind === "ReactionProvider");

          if (hasQueries || hasSourceProviders || hasReactionProviders || hasSources || hasReactions) {
            result.push(new FileNode(f));
          }
        }
        catch (err) {
          console.error(err);
        }
			}

			return result;
		}

		if (!element.resourceUri) {
			return [];
    }

    if (element instanceof ResourceNode) {
      return [];
    }
		
    let result: ExplorerNode[] = [];		

		try {
      let content = await vscode.workspace.fs.readFile(element.resourceUri);
      let docs: any[] = yaml.loadAll(content.toString());
      
      for (let qry of docs.filter(x => !!x && x.kind === "ContinuousQuery" && x.name)) {
        let queryUri = vscode.Uri.parse(element.resourceUri.toString() + "#" + qry.name);
        let node = new QueryNode(qry, queryUri);
        result.push(node);
      }

      for (let resource of docs.filter(x => !!x && x.kind === "Source" && x.name)) {
        let resourceUri = vscode.Uri.parse(element.resourceUri.toString() + "#" + resource.name);
        let node = new SourceNode(resource, resourceUri);
        result.push(node);
      }

      for (let resource of docs.filter(x => !!x && x.kind === "Reaction" && x.name)) {
        let resourceUri = vscode.Uri.parse(element.resourceUri.toString() + "#" + resource.name);
        let node = new ReactionNode(resource, resourceUri);
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
    if (!queryNode) {
      return;
    }

    if (!queryNode.resource) {
      return;
    }

    let dbg = new QueryDebugger(queryNode.resource, this.extensionUri, this.drasiClient);    
    dbg.start();   
  }

  async applyResource(resourceNode: ResourceNode) {
    if (!resourceNode || !resourceNode.resourceUri) {
      return;
    }

    if (!resourceNode.resource) {
      return;
    }

    const confirm = await vscode.window.showWarningMessage(
        `Are you sure you want to apply ${resourceNode.resource.name}?`,
        'Yes',
        'No'
    );

    if (confirm !== 'Yes') {
        return;
    }

    await vscode.window.withProgress({
      title: `Applying ${resourceNode.resource.name}`,
      location: vscode.ProgressLocation.Notification,
    }, async (progress, token) => {
      progress.report({ message: "Applying..." });
      
      try {      
        await this.drasiClient.applyResource(resourceNode.resource);
        vscode.window.showInformationMessage(`Resource ${resourceNode.resource.name} applied successfully`);
      }
      catch (err) {
        vscode.window.showErrorMessage(`Error applying resource: ${err}`);
      }
    });
    vscode.commands.executeCommand('drasi.refresh');
  }
}

abstract class ExplorerNode extends vscode.TreeItem {
}

abstract class ResourceNode extends ExplorerNode {
  resource: Resource<any>;

  constructor (resource: Resource<any>, uri: vscode.Uri) {
    super(uri, vscode.TreeItemCollapsibleState.Expanded);
    this.resource = resource;
  }
}

class FileNode extends ExplorerNode {
	contextValue = 'fileNode';

  constructor (uri: vscode.Uri) {
    super(uri, vscode.TreeItemCollapsibleState.Expanded);
  }
}

class QueryNode extends ResourceNode {
	contextValue = 'workspace.queryNode';
  
  constructor (query: ContinuousQuery, uri: vscode.Uri) {
    super(query, uri);
    this.iconPath = new vscode.ThemeIcon('code');
    this.label = query.name;
    this.command = {
      command: "vscode.open",
      title: "Open",
      arguments: [uri]
    };
  }
}

class SourceNode extends ResourceNode {
	contextValue = 'workspace.sourceNode';
  
  constructor (resource: Resource<any>, uri: vscode.Uri) {
    super(resource, uri);
    this.iconPath = new vscode.ThemeIcon('database');
    this.label = resource.name;
    this.command = {
      command: "vscode.open",
      title: "Open",
      arguments: [uri]
    };
  }
}

class ReactionNode extends ResourceNode {
	contextValue = 'workspace.reactionNode';
  
  constructor (resource: Resource<any>, uri: vscode.Uri) {
    super(resource, uri);
    this.iconPath = new vscode.ThemeIcon('zap');
    this.label = resource.name;
    this.command = {
      command: "vscode.open",
      title: "Open",
      arguments: [uri]
    };
  }
}

class SourceProviderNode extends ResourceNode {
	contextValue = 'workspace.sourceProviderNode';

  constructor (sp: SourceProvider, uri: vscode.Uri) {
    super(sp, uri);
    this.label = sp.name;
    this.command = {
      command: "vscode.open",
      title: "Open",
      arguments: [uri]
    };
  }
}

class ReactionProviderNode extends ResourceNode {
	contextValue = 'workspace.reactionProviderNode';

  constructor (resource: ReactionProvider, uri: vscode.Uri) {
    super(resource, uri);
    this.label = resource.name;
    this.command = {
      command: "vscode.open",
      title: "Open",
      arguments: [uri]
    };
  }
}

