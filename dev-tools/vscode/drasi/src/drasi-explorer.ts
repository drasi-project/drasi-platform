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
import { getCurrentKubeContext } from './utilities/getKubeContext';

export class DrasiExplorer implements vscode.TreeDataProvider<ExplorerNode> {

  private _onDidChangeTreeData: vscode.EventEmitter<ExplorerNode | undefined | void> = new vscode.EventEmitter<ExplorerNode | undefined | void>();
  readonly onDidChangeTreeData: vscode.Event<ExplorerNode | undefined | void> = this._onDidChangeTreeData.event;
  readonly drasiClient: DrasiClient;

  private extensionUri: vscode.Uri;

  constructor(extensionUri: vscode.Uri, drasiClient: DrasiClient) {
    this.extensionUri = extensionUri;
    this.drasiClient = drasiClient;
    vscode.commands.registerCommand('drasi.refresh', this.refresh.bind(this));
    vscode.commands.registerCommand('drasi.query.watch', this.watchQuery.bind(this));
    vscode.commands.registerCommand('drasi.resource.delete', this.deleteResource.bind(this));
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
      let clusterName = getCurrentKubeContext();
      return [new TitleNode(`Drasi - (${clusterName})`)];
    }

    if (element instanceof TitleNode) {
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

  async deleteResource(resourceNode: ResourceNode) {
    if (!resourceNode) {
      return;
    }
    const confirm = await vscode.window.showWarningMessage(
      `Are you sure you want to delete ${resourceNode.name}?`,
      'Yes',
      'No'
    );

    if (confirm !== 'Yes') {
      return;
    }

    await vscode.window.withProgress({
      title: `Deleting ${resourceNode.name}`,
      location: vscode.ProgressLocation.Notification,
    }, async (progress, token) => {
      progress.report({ message: "Deleting..." });

      try {
        await this.drasiClient.deleteResource(resourceNode.kind, resourceNode.name);
        vscode.window.showInformationMessage(`Resource ${resourceNode.name} deleted`);
      }
      catch (err) {
        vscode.window.showErrorMessage(`Error deleting resource: ${err}`);
      }
    });
    vscode.commands.executeCommand('drasi.refresh');
  }
}

class ExplorerNode extends vscode.TreeItem {

}

class TitleNode extends ExplorerNode {
  constructor(label: string) {
    super(label, vscode.TreeItemCollapsibleState.Expanded);
    this.iconPath = vscode.Uri.file(
      path.join(__filename, '..', '..', 'resources', 'drasi-sm.svg')
    );
  }
}

enum Category {
  queries,
  sources,
  reactions
}

class CategoryNode extends ExplorerNode {
  contextValue = 'drasi.categoryNode';
  category: Category;

  constructor(category: Category) {
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

class ResourceNode extends ExplorerNode {
  kind: string;
  name: string;

  constructor(kind: string, name: string) {
    super(name);
    this.kind = kind;
    this.name = name;
  }
}

class QueryNode extends ResourceNode {
  contextValue = 'drasi.queryNode';
  queryId: string;

  constructor(query: ResourceDTO<ContinuousQuerySpec, ContinuousQueryStatus>) {
    super("ContinuousQuery", query.id);

    switch (query.status.status) {
      case "Running":
        this.iconPath = new vscode.ThemeIcon('code', new vscode.ThemeColor('testing.iconPassed'));
        break;
      case "TerminalError":
        this.iconPath = new vscode.ThemeIcon('code', new vscode.ThemeColor('testing.iconFailed'));
        break;
      default:
        this.iconPath = new vscode.ThemeIcon('code', new vscode.ThemeColor('testing.iconQueued'));
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


class SourceNode extends ResourceNode {
  contextValue = 'drasi.sourceNode';

  constructor(source: ResourceDTO<SourceSpec, SourceStatus>) {
    super("Source", source.id);

    if (source.status.available) {
      this.iconPath = new vscode.ThemeIcon('database', new vscode.ThemeColor('testing.iconPassed'));
    } else {
      this.iconPath = new vscode.ThemeIcon('database', new vscode.ThemeColor('testing.iconFailed'));
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

class ReactionNode extends ResourceNode {
  contextValue = 'drasi.reactionNode';

  constructor(reaction: ResourceDTO<ReactionSpec, ReactionStatus>) {
    super("Reaction", reaction.id);

    if (reaction.status.available) {
      this.iconPath = new vscode.ThemeIcon('symbol-event', new vscode.ThemeColor('testing.iconPassed'));
    } else {
      this.iconPath = new vscode.ThemeIcon('symbol-event', new vscode.ThemeColor('testing.iconFailed'));
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
