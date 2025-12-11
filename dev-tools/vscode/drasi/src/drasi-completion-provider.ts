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
import * as fs from 'fs';
import * as path from 'path';

export class DrasiCompletionProvider implements vscode.CompletionItemProvider {
  private schemas: Map<string, any> = new Map();
  private extensionUri: vscode.Uri;

  constructor(extensionUri: vscode.Uri) {
    this.extensionUri = extensionUri;
    this.loadSchemas();
  }

  private loadSchemas() {
    const schemasDir = vscode.Uri.joinPath(this.extensionUri, 'schemas').fsPath;
    
    try {
      const cqSchema = JSON.parse(fs.readFileSync(path.join(schemasDir, 'continuous-query.schema.json'), 'utf8'));
      const sourceSchema = JSON.parse(fs.readFileSync(path.join(schemasDir, 'source.schema.json'), 'utf8'));
      const reactionSchema = JSON.parse(fs.readFileSync(path.join(schemasDir, 'reaction.schema.json'), 'utf8'));
      
      this.schemas.set('ContinuousQuery', cqSchema);
      this.schemas.set('Source', sourceSchema);
      this.schemas.set('Reaction', reactionSchema);
    } catch (error) {
      console.error('Failed to load Drasi schemas:', error);
    }
  }

  provideCompletionItems(
    document: vscode.TextDocument,
    position: vscode.Position,
    token: vscode.CancellationToken,
    context: vscode.CompletionContext
  ): vscode.ProviderResult<vscode.CompletionItem[] | vscode.CompletionList> {
    
    const linePrefix = document.lineAt(position).text.substr(0, position.character);
    const currentLine = document.lineAt(position).text;
    
    // Get the current document context
    const { kind, currentPath } = this.getDocumentContext(document, position);
    
    if (!kind) {
      // Suggest top-level fields
      return this.getTopLevelCompletions();
    }
    
    const schema = this.schemas.get(kind);
    if (!schema) {
      return [];
    }
    
    // Get completions based on current path in the document
    return this.getCompletionsForPath(schema, currentPath, linePrefix);
  }

  private getDocumentContext(document: vscode.TextDocument, position: vscode.Position): { kind: string | null, currentPath: string[] } {
    const textBeforeCursor = document.getText(new vscode.Range(new vscode.Position(0, 0), position));
    
    try {
      // Find the document boundary
      const docs = yaml.parseAllDocuments(document.getText());
      let relevantDoc: yaml.Document | null = null;
      
      for (const doc of docs) {
        const range = doc.range;
        if (range && range[0] <= document.offsetAt(position) && range[1] >= document.offsetAt(position)) {
          relevantDoc = doc;
          break;
        }
      }
      
      if (!relevantDoc) {
        return { kind: null, currentPath: [] };
      }
      
      const obj = relevantDoc.toJS();
      const kind = obj?.kind || null;
      
      // Parse the path from indentation and keys
      const currentPath = this.parseYamlPath(textBeforeCursor);
      
      return { kind, currentPath };
    } catch (e) {
      return { kind: null, currentPath: [] };
    }
  }

  private parseYamlPath(text: string): string[] {
    // Simple path parser based on indentation and keys
    const lines = text.split('\n');
    const path: string[] = [];
    const indentStack: { indent: number, key: string }[] = [];
    
    for (const line of lines) {
      const match = line.match(/^(\s*)([a-zA-Z_][a-zA-Z0-9_]*)\s*:/);
      if (match) {
        const indent = match[1].length;
        const key = match[2];
        
        // Pop stack until we find parent indent
        while (indentStack.length > 0 && indentStack[indentStack.length - 1].indent >= indent) {
          indentStack.pop();
        }
        
        indentStack.push({ indent, key });
      }
    }
    
    return indentStack.map(item => item.key);
  }

  private getTopLevelCompletions(): vscode.CompletionItem[] {
    const items: vscode.CompletionItem[] = [];
    
    ['apiVersion', 'kind', 'name', 'spec'].forEach(field => {
      const item = new vscode.CompletionItem(field, vscode.CompletionItemKind.Field);
      items.push(item);
    });
    
    return items;
  }

  private getCompletionsForPath(schema: any, path: string[], linePrefix: string): vscode.CompletionItem[] {
    const items: vscode.CompletionItem[] = [];
    
    let current = schema;
    
    // Navigate to the current position in schema
    for (const key of path) {
      if (current.properties && current.properties[key]) {
        current = current.properties[key];
      } else if (current.items) {
        current = current.items;
      } else {
        return [];
      }
    }
    
    // If current has properties, suggest them
    if (current.properties) {
      for (const [key, value] of Object.entries(current.properties)) {
        const propSchema = value as any;
        const item = new vscode.CompletionItem(key, vscode.CompletionItemKind.Field);
        
        if (propSchema.description) {
          item.documentation = new vscode.MarkdownString(propSchema.description);
        }
        
        // Add enum values as snippets
        if (propSchema.enum) {
          item.detail = `enum: ${propSchema.enum.join(', ')}`;
        }
        
        items.push(item);
      }
    }
    
    // If current field has enum, suggest enum values
    if (current.enum && linePrefix.includes(':')) {
      for (const enumValue of current.enum) {
        const item = new vscode.CompletionItem(enumValue, vscode.CompletionItemKind.EnumMember);
        items.push(item);
      }
    }
    
    return items;
  }
}
