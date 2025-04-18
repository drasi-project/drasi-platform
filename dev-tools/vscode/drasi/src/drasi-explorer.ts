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
import { ConfigurationRegistry, Registration } from './sdk/config';
import { TunnelConnection } from './sdk/platform-client';

export class DrasiExplorer implements vscode.TreeDataProvider<ExplorerNode>, vscode.Disposable {

  private _onDidChangeTreeData: vscode.EventEmitter<ExplorerNode | undefined | void> = new vscode.EventEmitter<ExplorerNode | undefined | void>();
  readonly onDidChangeTreeData: vscode.Event<ExplorerNode | undefined | void> = this._onDidChangeTreeData.event;
  readonly drasiClient: DrasiClient;
  readonly configRegistry: ConfigurationRegistry;
  private resourceTunnels: Map<string, TunnelConnection[]> = new Map<string, TunnelConnection[]>();

  private extensionUri: vscode.Uri;

  constructor(extensionUri: vscode.Uri, drasiClient: DrasiClient, configRegistry: ConfigurationRegistry) {
    this.extensionUri = extensionUri;
    this.drasiClient = drasiClient;
    this.configRegistry = configRegistry;
    vscode.commands.registerCommand('drasi.refresh', this.refresh.bind(this));
    vscode.commands.registerCommand('drasi.query.watch', this.watchQuery.bind(this));
    vscode.commands.registerCommand('drasi.resource.delete', this.deleteResource.bind(this));
    vscode.commands.registerCommand('drasi.config.use', this.useConfig.bind(this));
    vscode.commands.registerCommand('drasi.resource.tunnel', this.tunnel.bind(this));
    vscode.commands.registerCommand('drasi.tunnel.close', this.closeTunnel.bind(this));
  }

  dispose() {
    
  }

  refresh(): void {
    console.log("Refreshing explorer");
    this._onDidChangeTreeData.fire();
  }

  getTreeItem(element: ExplorerNode): vscode.TreeItem | Thenable<vscode.TreeItem> {
    return element;
  }

  async getChildren(element?: ExplorerNode | undefined): Promise<ExplorerNode[]> {
    console.log("Getting children", element);

    if (!element) {
      let currentRegId = await this.drasiClient.getCurrentRegistrationId();
      let registrations = await this.configRegistry.getAllRegistrations();

      return registrations.map(x => {
        if (x.id === currentRegId) {
          return new RegistrationNode(x, true);
        }
        return new RegistrationNode(x, false);
      });
    }

    if (element instanceof RegistrationNode) {
      if (!element.isCurrent) {
        return [];
      }
      return [
        new CategoryNode(Category.sources, element.registration),
        new CategoryNode(Category.queries, element.registration),
        new CategoryNode(Category.reactions, element.registration)
      ];
    }

    try {
      if (element instanceof CategoryNode) {
        switch ((element as CategoryNode).category) {
          case Category.queries:
            let queries = await this.drasiClient.getContinuousQueries();
            return queries.map(x => new QueryNode(x, element.registration));
          case Category.sources:
            let sources = await this.drasiClient.getSources();
            return sources.map(x => new SourceNode(x, element.registration));
          case Category.reactions:
            let reactions = await this.drasiClient.getReactions();
            return reactions.map(x => {
              let expand = this.resourceTunnels.get(`${element.registration.id}:reaction:${x.id}`);
              let result = new ReactionNode(x, element.registration);
              if (expand) {
                result.collapsibleState = vscode.TreeItemCollapsibleState.Expanded;
              }
              return result;
            });
        }
      }
    } catch (err) {
      console.error("Error getting resources", err);
      vscode.window.showErrorMessage(`Error getting resources: ${err}`);
    }

    if (element instanceof ReactionNode) {
      console.log("Getting tunnels for reaction", element.name, element.registration.id);
      console.log(this.resourceTunnels);
      return this.resourceTunnels.get(`${element.registration.id}:${element.kind.toLowerCase()}:${element.name}`)?.map(x => new TunnelNode(x, element)) || [];
    }

    return [];
  }

  async watchQuery(queryNode: QueryNode) {
    let watcher = new QueryWatcher(queryNode.queryId, this.extensionUri, this.drasiClient);
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

  async tunnel(resourceNode: ResourceNode) {
    if (!resourceNode) {
      return;
    }
    
    let portSelection = await vscode.window.showInputBox({
      prompt: `Enter port for ${resourceNode.name}`,
      value: "8080",
    });

    if (!portSelection) {
      return;
    }
    let port = parseInt(portSelection);
    let registrationId = await this.configRegistry.getCurrentRegistrationId();
    
    let tunnel = await this.drasiClient.createTunnel(port, resourceNode.kind.toLowerCase(), resourceNode.name);
    if (!tunnel) {
      vscode.window.showErrorMessage(`Error creating tunnel for ${resourceNode.name}`);
      return;
    }

    let tunnelKey = `${registrationId}:${resourceNode.kind.toLowerCase()}:${resourceNode.name}`;

    if (!this.resourceTunnels.has(tunnelKey)) {
      this.resourceTunnels.set(tunnelKey, []);
    }

    this.resourceTunnels.get(tunnelKey)?.push(tunnel);

    vscode.window.showInformationMessage(`Tunnel created for ${resourceNode.name} on port ${tunnel.port}`);    
    this._onDidChangeTreeData.fire(resourceNode);
    resourceNode.collapsibleState = vscode.TreeItemCollapsibleState.Expanded;
  }

  async closeTunnel(tunnelNode: TunnelNode) {
    if (!tunnelNode) {
      return;
    }
    
    let tunnelKey = `${tunnelNode.registration.id}:${tunnelNode.tunnel.resourceType.toLowerCase()}:${tunnelNode.tunnel.resourceName}`;
    let tunnels = this.resourceTunnels.get(tunnelKey);
    if (tunnels) {
      for (let tunnel of tunnels) {
        if (tunnel.port === tunnelNode.tunnel.port) {
          tunnels.splice(tunnels.indexOf(tunnel), 1);
          break;
        }
      }      
    }
    
    await tunnelNode.tunnel.close();

    this._onDidChangeTreeData.fire(tunnelNode.parent);
  }

  async useConfig(registrationNode: RegistrationNode) {
    if (!registrationNode) {
      return;
    }    

    await this.drasiClient.close();
    await this.configRegistry.setCurrentRegistration(registrationNode.registration.id);
    
    vscode.commands.executeCommand('drasi.refresh');
  }
}

class ExplorerNode extends vscode.TreeItem {

}

class RegistrationNode extends ExplorerNode {
  contextValue = 'drasi.registrationNode';
  private current: boolean = false;
  readonly registration: Registration;
  
  constructor(registration: Registration, current: boolean) {
    super(registration.id, current ? vscode.TreeItemCollapsibleState.Expanded : vscode.TreeItemCollapsibleState.None);
    this.current = current;
    this.registration = registration;
    if (current) {
      this.contextValue = 'drasi.currentRegistrationNode';
    }

    let logo = 'drasi-sm.svg';
    switch (registration.kind) {
      case "kubernetes":
        logo = 'kubernetes-icon.png';
        break;
      case "docker":
        logo = 'docker-icon.png';
        break;
    }

    this.iconPath = vscode.Uri.file(
      path.join(__filename, '..', '..', 'resources', logo)
    );
  }

  public get isCurrent() {
    return this.current;
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
  registration: Registration;

  constructor(category: Category, registration: Registration) {
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
    this.registration = registration;
  }
}

class ResourceNode extends ExplorerNode {
  kind: string;
  name: string;
  registration: Registration;

  constructor(kind: string, name: string, registration: Registration) {
    super(name);
    this.kind = kind;
    this.name = name;
    this.registration = registration;
  }
}

class QueryNode extends ResourceNode {
  contextValue = 'drasi.queryNode';
  queryId: string;

  constructor(query: ResourceDTO<ContinuousQuerySpec, ContinuousQueryStatus>, registration: Registration) {
    super("ContinuousQuery", query.id, registration);

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

  constructor(source: ResourceDTO<SourceSpec, SourceStatus>, registration: Registration) {
    super("Source", source.id, registration);

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

  constructor(reaction: ResourceDTO<ReactionSpec, ReactionStatus>, registration: Registration) {
    super("Reaction", reaction.id, registration);

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

class TunnelNode extends ExplorerNode {
  contextValue = 'drasi.tunnelNode';
  tunnel: TunnelConnection;
  registration: Registration;
  parent: ResourceNode;
  
  constructor(tunnel: TunnelConnection, parent: ResourceNode) {
    super(`${tunnel.port}` , vscode.TreeItemCollapsibleState.None);
    this.tunnel = tunnel;
    this.parent = parent;
    this.registration = parent.registration;
    this.iconPath = new vscode.ThemeIcon('plug');
  }
}