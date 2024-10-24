import * as vscode from 'vscode';
import * as yaml from 'js-yaml';
import { ContinuousQuerySpec, ContinuousQueryStatus } from './models/continuous-query';
import { ResourceDTO } from './models/resource';
import { DrasiClient } from './drasi-client';
import * as os from 'os';
import * as fs from 'fs';
import * as path from 'path';
import { randomUUID } from 'crypto';
import { SourceSpec, SourceStatus } from './models/source';
import { ReactionSpec, ReactionStatus } from './models/reaction';
import { QueryWatcher } from './query-watcher';

export class DrasiExplorer implements vscode.TreeDataProvider<ExplorerNode> {
	
	private _onDidChangeTreeData: vscode.EventEmitter<ExplorerNode | undefined | void> = new vscode.EventEmitter<ExplorerNode | undefined | void>();
	readonly onDidChangeTreeData: vscode.Event<ExplorerNode | undefined | void> = this._onDidChangeTreeData.event;
  readonly drasiClient = new DrasiClient();
  
  private extensionUri: vscode.Uri;

  constructor (extensionUri: vscode.Uri) {
    this.extensionUri = extensionUri;
    vscode.commands.registerCommand('drasi.refresh', this.refresh.bind(this));
    vscode.commands.registerCommand('drasi.query.watch', this.watchQuery.bind(this));
        
  }

	refresh(): void {
		this._onDidChangeTreeData.fire();
	}
	
	getTreeItem(element: ExplorerNode): vscode.TreeItem | Thenable<vscode.TreeItem> {
		return element;
	}
	
	async getChildren(element?: ExplorerNode | undefined): Promise<ExplorerNode[]> {
   	//let files = await vscode.workspace.findFiles('**/*.yaml');
		if (!vscode.workspace.workspaceFolders) {
			return [];
    }
			
		if (!element) {			
			return [
        new CategoryNode(Category.sources),
        new CategoryNode(Category.queries),        
        new CategoryNode(Category.reactions)
      ];
		}

    if (element instanceof CategoryNode) {
      switch ((element as CategoryNode).category) {
        case Category.queries:
          let queries = await this.drasiClient.getContinuousQueries();
          return queries.map(x => new QueryNode(x));
        case Category.sources:
          let sources = await this.drasiClient.getSources();
          return sources.map(x => new SourceNode(x));
        case Category.reactions:
          let reactions = await this.drasiClient.getReactions();
          return reactions.map(x => new ReactionNode(x));
      }
    }

    return [];		
	}  

  async watchQuery(queryNode: QueryNode) {
    let watcher = new QueryWatcher(queryNode.queryId, this.extensionUri);
    await watcher.start();    
  }
}

class ExplorerNode extends vscode.TreeItem {

}

enum Category {
  queries,
  sources,
  reactions
}

class CategoryNode extends ExplorerNode {
	contextValue = 'drasi.categoryNode';
  category: Category;

  constructor (category: Category) {    
    let label = "";
    switch (category) {
      case Category.sources:
        label = "Sources";
        break;
      case Category.queries:
        label = "Queries";
        break;      
      case Category.reactions:
        label = "Reactions";
        break;
    }
    super(label, vscode.TreeItemCollapsibleState.Expanded);
    this.category = category;
  }
}

class QueryNode extends ExplorerNode {
	contextValue = 'drasi.queryNode';
  queryId: string;
  
  constructor (query: ResourceDTO<ContinuousQuerySpec, ContinuousQueryStatus>) {
    super(query.id);
    
    switch (query.status.status) {
      case "Running":
        this.iconPath = new vscode.ThemeIcon('code', new vscode.ThemeColor('problemsInfoIcon.foreground'));
        break;
      case "TerminalError":
        this.iconPath = new vscode.ThemeIcon('code', new vscode.ThemeColor('problemsErrorIcon.foreground'));
        break;
      default:
        this.iconPath = new vscode.ThemeIcon('code', new vscode.ThemeColor('problemsWarningIcon.foreground'));
        break;
    }
    
    let tmpFile = path.join(os.tmpdir(), randomUUID());    
    fs.writeFileSync(tmpFile, yaml.dump(query));

    this.label = query.id;
    this.queryId = query.id;
    this.command = {
      command: "vscode.open",
      title: "Open",
      arguments: [vscode.Uri.file(tmpFile)]
    };
  }
}


class SourceNode extends ExplorerNode {
	contextValue = 'drasi.sourceNode';
  
  constructor (source: ResourceDTO<SourceSpec, SourceStatus>) {
    super(source.id);
    
    if (source.status.available) {
      this.iconPath = new vscode.ThemeIcon('database', new vscode.ThemeColor('problemsInfoIcon.foreground'));
    } else {
      this.iconPath = new vscode.ThemeIcon('database', new vscode.ThemeColor('problemsWarningIcon.foreground'));
    }    
    
    let tmpFile = path.join(os.tmpdir(), randomUUID());    
    fs.writeFileSync(tmpFile, yaml.dump(source));

    this.label = source.id;
    this.command = {
      command: "vscode.open",
      title: "Open",
      arguments: [vscode.Uri.file(tmpFile)]
    };
  }
}

class ReactionNode extends ExplorerNode {
	contextValue = 'drasi.reactionNode';
  
  constructor (reaction: ResourceDTO<ReactionSpec, ReactionStatus>) {
    super(reaction.id);
    
    if (reaction.status.available) {
      this.iconPath = new vscode.ThemeIcon('symbol-event', new vscode.ThemeColor('problemsInfoIcon.foreground'));
    } else {
      this.iconPath = new vscode.ThemeIcon('symbol-event', new vscode.ThemeColor('problemsWarningIcon.foreground'));
    }    
    
    let tmpFile = path.join(os.tmpdir(), randomUUID());    
    fs.writeFileSync(tmpFile, yaml.dump(reaction));

    this.label = reaction.id;
    this.command = {
      command: "vscode.open",
      title: "Open",
      arguments: [vscode.Uri.file(tmpFile)]
    };
  }
}
