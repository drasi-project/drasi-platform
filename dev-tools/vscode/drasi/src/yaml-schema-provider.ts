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
import * as yaml from 'yaml';

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
    
    // Disable validation (our custom provider handles it)
    config.update('validate', false, vscode.ConfigurationTarget.Global);
    
    // CLEAR ALL existing schema registrations first
    config.update('schemas', {}, vscode.ConfigurationTarget.Global);
    
    // Register individual schemas for each resource type
    const cqSchemaUri = vscode.Uri.joinPath(this.extensionUri, 'schemas/continuous-query.schema.json').toString();
    const sourceSchemaUri = vscode.Uri.joinPath(this.extensionUri, 'schemas/source.schema.json').toString();
    const reactionSchemaUri = vscode.Uri.joinPath(this.extensionUri, 'schemas/reaction.schema.json').toString();
    
    const schemas: any = {};
    schemas[cqSchemaUri] = [
      '**/*query*.yaml', 
      '**/*query*.yml'
    ];
    schemas[sourceSchemaUri] = [
      '**/*source*.yaml', 
      '**/*source*.yml'
    ];
    schemas[reactionSchemaUri] = [
      '**/*reaction*.yaml', 
      '**/*reaction*.yml'
    ];
    
    config.update('schemas', schemas, vscode.ConfigurationTarget.Global);
  }
}
