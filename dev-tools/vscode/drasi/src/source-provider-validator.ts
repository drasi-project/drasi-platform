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
import Ajv from 'ajv';


export async function validateSourceProvider(spNode: vscode.TreeItem) {
    if (!spNode || !spNode.resourceUri)
      return;

    let name = spNode.resourceUri.fragment;

    let log = vscode.window.createOutputChannel(name, { log: true });
    log.show();


    let content = await vscode.workspace.fs.readFile(vscode.Uri.file(spNode.resourceUri.path));

      // Parse YAML content
    let docs: any[] = yaml.loadAll(content.toString());
    let query = docs.find(x => !!x && x.kind === "SourceProvider" && x.name === name);
    // Convert to JSON
    let jsonContent = JSON.stringify(query.spec);
    log.info("Source Provider spec: " + jsonContent);

    await vscode.window.withProgress({
        location: vscode.ProgressLocation.Notification,
        title: "Validating Source Provider",
    }, async (progress, token) => {
        progress.report({ message: "Validating Source Provider"});
        log.info("Validating Source Provider");
        log.info("Loading JSON Schema");

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
                                              type: [
                                                  "string",
                                                  "object",
                                                  "array",
                                                  "number",
                                                  "boolean"
                                              ]
                                          }
                                      },
                                      required: [
                                          "type"
                                      ],
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
                      properties: {
                          proxy: {
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
                                                              enum: [
                                                                  "internal"
                                                              ]
                                                          },
                                                          {
                                                              type: "string",
                                                              enum: [
                                                                  "external"
                                                              ]
                                                          }
                                                      ]
                                                  },
                                                  target: {
                                                      type: "string"
                                                  }
                                              },
                                              required: [
                                                  "setting",
                                                  "target"
                                              ]
                                          }
                                      },
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
                                                              type: [
                                                                  "string",
                                                                  "object",
                                                                  "array",
                                                                  "number",
                                                                  "boolean"
                                                              ]
                                                          }
                                                      },
                                                      required: [
                                                          "type"
                                                      ],
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
                              required: [
                                  "image"
                              ]
                          },
                          reactivator: {
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
                                                              enum: [
                                                                  "internal"
                                                              ]
                                                          },
                                                          {
                                                              type: "string",
                                                              enum: [
                                                                  "external"
                                                              ]
                                                          }
                                                      ]
                                                  },
                                                  target: {
                                                      type: "string"
                                                  }
                                              },
                                              required: [
                                                  "setting",
                                                  "target"
                                              ]
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
                                                              type: [
                                                                  "string",
                                                                  "object",
                                                                  "array",
                                                                  "number",
                                                                  "boolean"
                                                              ]
                                                          }
                                                      },
                                                      required: [
                                                          "type"
                                                      ],
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
                              required: [
                                  "image"
                              ]
                          }
                      },
                      required: [
                          "proxy",
                          "reactivator"
                      ],
                      additionalProperties: true
                  }
              },
              required: [
                  "services"
              ],
              additionalProperties: false
          };
            let ajv  = new Ajv();
            let validate = ajv.compile(schema); // Compile schema
            let isValid = validate(JSON.parse(jsonContent)); // Validate JSON

            if (!isValid) {
                log.error('Invalid Source Provider. Error Description: ' + JSON.stringify(validate.errors));
            } else {
                log.info('Valid Source Provider.');
                vscode.window.showInformationMessage('Valid Source Provider');
            }
        } catch (err) {
            vscode.window.showErrorMessage('Error validating Source Provider: ' + err);
        }
      
    });
  }

