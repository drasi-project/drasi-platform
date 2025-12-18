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

export class YamlSchemaProvider {
  private extensionUri: vscode.Uri;

  constructor(extensionUri: vscode.Uri) {
    this.extensionUri = extensionUri;
  }

  activate(context: vscode.ExtensionContext) {
    this.configureYamlExtension();
  }

  private configureYamlExtension() {
    const config = vscode.workspace.getConfiguration('yaml');
    
    // Use the union schema that handles all Drasi resource types
    // This schema uses conditional logic (allOf/if/then) to apply the correct
    // schema based on the 'kind' field, which works for multi-document files
    const unionSchemaUri = vscode.Uri.joinPath(this.extensionUri, 'schemas/drasi-resources.schema.json').toString();
    
    const existingSchemas = config.get<any>('schemas') || {};
    
    const schemas: any = { ...existingSchemas };
    schemas[unionSchemaUri] = [
      '**/*query*.yaml', 
      '**/*query*.yml',
      '**/*source*.yaml', 
      '**/*source*.yml',
      '**/*reaction*.yaml', 
      '**/*reaction*.yml',
      '**/resources.yaml',
      '**/resources.yml',
      '**/*drasi*.yaml',
      '**/*drasi*.yml'
    ];
    
    config.update('schemas', schemas, vscode.ConfigurationTarget.Workspace);
  }
}
