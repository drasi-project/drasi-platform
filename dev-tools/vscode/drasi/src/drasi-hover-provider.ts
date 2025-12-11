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

export class DrasiHoverProvider implements vscode.HoverProvider {
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

  provideHover(
    document: vscode.TextDocument,
    position: vscode.Position,
    token: vscode.CancellationToken
  ): vscode.ProviderResult<vscode.Hover> {
    
    const range = document.getWordRangeAtPosition(position, /[a-zA-Z_][a-zA-Z0-9_]*/);
    if (!range) {
      return null;
    }
    
    const word = document.getText(range);
    const line = document.lineAt(position).text;
    
    // Check if this is a key (has : after it)
    const keyMatch = line.match(new RegExp(`\\b${word}\\s*:`));
    if (!keyMatch) {
      return null;
    }
    
    // Get document kind
    const { kind, currentPath } = this.getDocumentContext(document, position);
    if (!kind) {
      return null;
    }
    
    const schema = this.schemas.get(kind);
    if (!schema) {
      return null;
    }
    
    // Find the schema for this field
    const fieldSchema = this.getSchemaForPath(schema, [...currentPath, word]);
    if (!fieldSchema || !fieldSchema.description) {
      return null;
    }
    
    const markdown = new vscode.MarkdownString();
    markdown.appendMarkdown(`**${word}**\n\n`);
    markdown.appendMarkdown(fieldSchema.description);
    
    if (fieldSchema.enum) {
      markdown.appendMarkdown(`\n\n**Allowed values:** ${fieldSchema.enum.join(', ')}`);
    }
    
    if (fieldSchema.type) {
      markdown.appendMarkdown(`\n\n*Type:* \`${fieldSchema.type}\``);
    }
    
    return new vscode.Hover(markdown, range);
  }

  private getDocumentContext(document: vscode.TextDocument, position: vscode.Position): { kind: string | null, currentPath: string[] } {
    const textBeforeCursor = document.getText(new vscode.Range(new vscode.Position(0, 0), position));
    
    try {
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
      
      const currentPath = this.parseYamlPath(textBeforeCursor);
      
      return { kind, currentPath };
    } catch (e) {
      return { kind: null, currentPath: [] };
    }
  }

  private parseYamlPath(text: string): string[] {
    const lines = text.split('\n');
    const path: string[] = [];
    const indentStack: { indent: number, key: string }[] = [];
    
    for (const line of lines) {
      const match = line.match(/^(\s*)([a-zA-Z_][a-zA-Z0-9_]*)\s*:/);
      if (match) {
        const indent = match[1].length;
        const key = match[2];
        
        while (indentStack.length > 0 && indentStack[indentStack.length - 1].indent >= indent) {
          indentStack.pop();
        }
        
        indentStack.push({ indent, key });
      }
    }
    
    return indentStack.map(item => item.key);
  }

  private getSchemaForPath(schema: any, path: string[]): any {
    let current = schema;
    
    for (const key of path) {
      if (current.properties && current.properties[key]) {
        current = current.properties[key];
      } else if (current.items && current.items.properties && current.items.properties[key]) {
        current = current.items.properties[key];
      } else {
        return null;
      }
    }
    
    return current;
  }
}
