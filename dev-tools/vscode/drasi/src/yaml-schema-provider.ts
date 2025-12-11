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
    
    context.subscriptions.push(
      vscode.workspace.onDidOpenTextDocument(this.handleDocument.bind(this)),
      vscode.workspace.onDidChangeTextDocument(e => this.handleDocument(e.document))
    );
  }

  private async handleDocument(document: vscode.TextDocument) {
    if (document.languageId !== 'yaml') {
      return;
    }
    
    const kind = this.detectResourceKind(document.getText());
    
    if (kind) {
      await this.associateSchema(document, kind);
    }
  }

  private detectResourceKind(content: string): string | null {
    try {
      const docs = yaml.parseAllDocuments(content);
      for (const doc of docs) {
        if (doc.has('kind') && doc.has('apiVersion')) {
          return doc.get('kind') as string;
        }
      }
    } catch (e) {
      // Ignore parse errors
    }
    return null;
  }

  private async associateSchema(document: vscode.TextDocument, kind: string) {
    const config = vscode.workspace.getConfiguration('yaml', document.uri);
    const schemas = config.get<any>('schemas') || {};
    
    const schemaUri = this.getSchemaUri(kind);
    if (schemaUri) {
      schemas[schemaUri.toString()] = [document.uri.toString()];
      await config.update('schemas', schemas, vscode.ConfigurationTarget.WorkspaceFolder);
    }
  }

  private getSchemaUri(kind: string): vscode.Uri | null {
    const schemaMap: Record<string, string> = {
      'ContinuousQuery': 'schemas/continuous-query.schema.json',
      'Source': 'schemas/source.schema.json',
      'Reaction': 'schemas/reaction.schema.json'
    };
    
    const schemaPath = schemaMap[kind];
    return schemaPath ? vscode.Uri.joinPath(this.extensionUri, schemaPath) : null;
  }

  private configureYamlExtension() {
    const config = vscode.workspace.getConfiguration('yaml');
    const schemas = config.get<any>('schemas') || {};
    
    const querySchemaUri = vscode.Uri.joinPath(this.extensionUri, 'schemas/continuous-query.schema.json').toString();
    const sourceSchemaUri = vscode.Uri.joinPath(this.extensionUri, 'schemas/source.schema.json').toString();
    const reactionSchemaUri = vscode.Uri.joinPath(this.extensionUri, 'schemas/reaction.schema.json').toString();
    
    if (!schemas[querySchemaUri]) {
      schemas[querySchemaUri] = ['**/*query*.yaml', '**/*query*.yml'];
    }
    if (!schemas[sourceSchemaUri]) {
      schemas[sourceSchemaUri] = ['**/*source*.yaml', '**/*source*.yml'];
    }
    if (!schemas[reactionSchemaUri]) {
      schemas[reactionSchemaUri] = ['**/*reaction*.yaml', '**/*reaction*.yml'];
    }
    
    config.update('schemas', schemas, vscode.ConfigurationTarget.Global);
  }
}
