import * as vscode from 'vscode';
import { ReactionProvider } from './reaction-provider';
import * as yaml from 'js-yaml';
import Ajv from 'ajv';

export class ReactionProviderExplorer implements vscode.TreeDataProvider<ExplorerNode> {
  private _onDidChangeTreeData: vscode.EventEmitter<ExplorerNode | undefined | void> = new vscode.EventEmitter<ExplorerNode | undefined | void>();
	readonly onDidChangeTreeData: vscode.Event<ExplorerNode | undefined | void> = this._onDidChangeTreeData.event;

  constructor() {
    vscode.commands.registerCommand('reactionProviders.refresh', this.refresh.bind(this));
    vscode.commands.registerCommand('reactionProviders.validate', this.validateReactionProvider.bind(this));
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
    if (!vscode.workspace.workspaceFolders)
      return [];
    if (!element) {
      let result: any[] = [];

      let files = await vscode.workspace.findFiles('**/*.yaml');
      for (let f of files.sort()) {
        try {
          let content = await vscode.workspace.fs.readFile(f);
          let docs: any[] = yaml.loadAll(content.toString());
          let hasSourceProviders = docs.some(x => !!x && x.kind === "ReactionProvider");

          if (hasSourceProviders)
            result.push(new FileNode(f));
        } catch (err) {
          console.error(err);
        }
      }
      return result;
    }

    let result: ExplorerNode[] = [];
		if (!element.resourceUri)
			return result;

    try {
      let content = await vscode.workspace.fs.readFile(element.resourceUri);
      let docs: any[] = yaml.loadAll(content.toString());

      for (let sp of docs.filter(x => !!x && x.kind === "ReactionProvider")) {
        let uri = vscode.Uri.parse(element.resourceUri.toString() + "#" + sp.name);
        let node = new reactionProviderNode(sp, uri);
        result.push(node);
      }
    } catch (err) {
      console.error(err);
    }
    return result;
  }

  async validateReactionProvider(spNode: reactionProviderNode) {
    if (!spNode || !spNode.resourceUri)
      return;

    let name = spNode.resourceUri.fragment;

    let log = vscode.window.createOutputChannel(name, { log: true });
    log.show();


    let content = await vscode.workspace.fs.readFile(vscode.Uri.file(spNode.resourceUri.path));


    let docs: any[] = yaml.loadAll(content.toString());
    let query = docs.find(x => !!x && x.kind === "ReactionProvider" && x.name === name);
    let jsonContent = JSON.stringify(query.spec);
    log.info("ReactionProvider spec: " + jsonContent);


    await vscode.window.withProgress({
      location: vscode.ProgressLocation.Notification,
      title: "Validating ReactionProvider",
    }, async (progress) => {
      progress.report({ message: "Validating ReactionProvider" });
      log.info("Validating ReactionProvider");

      try {
        const schema = {
          type: "object",
          properties: {
              config_schema: {
                  type: "object",
                  properties: {
                      properties: {
                          type: "object",
                          patternProperties: {
                              ".*": {
                                  type: "object",
                                  properties: {
                                      type: {
                                          type: "string"
                                      },
                                      default: {
                                          type: ["string", "object", "array", "number", "boolean"]
                                      }
                                  },
                                  required: ["type"],
                                  additionalProperties: false
                              }
                          }
                      },
                      type: {
                          type: "string"
                      },
                      required: {
                          type: "array",
                          items: {
                              type: "string"
                          }
                      }
                  },
                  required: ["properties", "type"]
              },
              services: {
                  type: "object",
                  patternProperties: {
                      ".*": {
                          type: "object",
                          properties: {
                              image: {
                                  type: "string"
                              },
                              dapr: {
                                  type: "object",
                                  properties: {
                                      "app-port": {
                                          type: "string"
                                      },
                                      "app-protocol": {
                                          type: "string"
                                      }
                                  }
                              },
                              endpoints: {
                                  type: "object",
                                  patternProperties: {
                                      ".*": {
                                          type: "object",
                                          properties: {
                                              setting: {
                                                  oneOf: [
                                                      {
                                                          type: "string",
                                                          enum: ["internal"]
                                                      },
                                                      {
                                                          type: "string",
                                                          enum: ["external"]
                                                      }
                                                  ]
                                              },
                                              target: {
                                                  type: "string",
                                                  pattern: "^\\$.*$"
                                              }
                                          },
                                          required: ["setting", "target"]
                                      }
                                  }
                              },
                              config_schema: {
                                  type: "object",
                                  properties: {
                                      properties: {
                                          type: "object",
                                          patternProperties: {
                                              ".*": {
                                                  type: "object",
                                                  properties: {
                                                      type: {
                                                          type: "string"
                                                      },
                                                      default: {
                                                          type: ["string", "object", "array", "number", "boolean"]
                                                      }
                                                  },
                                                  required: ["type"],
                                                  additionalProperties: false
                                              }
                                          }
                                      },
                                      type: {
                                          type: "string"
                                      },
                                      required: {
                                          type: "array",
                                          items: {
                                              type: "string"
                                          }
                                      }
                                  },
                                  required: ["properties", "type"]
                              }
                          },
                          required: ["image"]
                      }
                  },
                  additionalProperties: true,
                  minProperties: 1
              }
          },
          required: ["services"],
          additionalProperties: false
        };
        let ajv = new Ajv();
        let validate = ajv.compile(schema);
        let isValid = validate(JSON.parse(jsonContent));

        if (!isValid) {
          log.error('Invalid ReactionProvider. Error Description: ' + JSON.stringify(validate.errors));
        } else {
          log.info("Valid ReactionProvider");
          vscode.window.showInformationMessage("Valid ReactionProvider");
        }
      } catch (err) {
        vscode.window.showErrorMessage("Error validating ReactionProvider: " + err);
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


class reactionProviderNode extends ExplorerNode {
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