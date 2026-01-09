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
import Ajv from 'ajv';
import * as fs from 'fs';
import * as path from 'path';

export class DrasiYamlDiagnosticProvider {
  private diagnosticCollection: vscode.DiagnosticCollection;
  private ajv: Ajv;
  private schemas: Map<string, any> = new Map();
  private extensionUri: vscode.Uri;

  // This provider handles multi-document YAML files correctly by:
  // 1. Parsing all documents in the file (yaml.parseAllDocuments)
  // 2. Detecting each document's kind (ContinuousQuery, Source, Reaction)
  // 3. Applying the appropriate schema to each document independently
  // 4. Tracking line offsets to report errors at the correct positions

  constructor(extensionUri: vscode.Uri) {
    this.extensionUri = extensionUri;
    this.diagnosticCollection = vscode.languages.createDiagnosticCollection('drasi-yaml');
    this.ajv = new Ajv({ strict: false, allErrors: true });
    this.loadSchemas();
  }

  private loadSchemas() {
    const schemasDir = vscode.Uri.joinPath(this.extensionUri, 'schemas').fsPath;
    
    try {
      const cqSchema = JSON.parse(fs.readFileSync(path.join(schemasDir, 'continuous-query.schema.json'), 'utf8'));
      const sourceSchema = JSON.parse(fs.readFileSync(path.join(schemasDir, 'source.schema.json'), 'utf8'));
      const reactionSchema = JSON.parse(fs.readFileSync(path.join(schemasDir, 'reaction.schema.json'), 'utf8'));
      
      this.schemas.set('ContinuousQuery', this.ajv.compile(cqSchema));
      this.schemas.set('Source', this.ajv.compile(sourceSchema));
      this.schemas.set('Reaction', this.ajv.compile(reactionSchema));
    } catch (error) {
      console.error('Failed to load Drasi schemas:', error);
    }
  }

  activate(context: vscode.ExtensionContext) {
    context.subscriptions.push(this.diagnosticCollection);
    
    context.subscriptions.push(
      vscode.workspace.onDidOpenTextDocument(doc => this.validateDocument(doc)),
      vscode.workspace.onDidChangeTextDocument(e => this.validateDocument(e.document)),
      vscode.workspace.onDidCloseTextDocument(doc => this.diagnosticCollection.delete(doc.uri))
    );
    
    // Validate all open YAML documents
    vscode.workspace.textDocuments.forEach(doc => this.validateDocument(doc));
  }

  private validateDocument(document: vscode.TextDocument) {
    if (document.languageId !== 'yaml') {
      return;
    }
    
    // Only validate files that match Drasi patterns
    const fileName = document.fileName.toLowerCase();
    if (!this.isDrasiFile(fileName)) {
      return;
    }
    
    const diagnostics: vscode.Diagnostic[] = [];
    const content = document.getText();
    
    try {
      const docs = yaml.parseAllDocuments(content);
      let currentLine = 0;
      
      for (const doc of docs) {
        const obj = doc.toJS();
        
        if (!obj || typeof obj !== 'object') {
          continue;
        }
        
        // Check if it's a Drasi resource
        if (obj.kind && obj.apiVersion === 'v1') {
          const validate = this.schemas.get(obj.kind);
          
          if (validate) {
            const valid = validate(obj);
            
            if (!valid && validate.errors) {
              for (const error of validate.errors) {
                const diagnostic = this.createDiagnostic(document, doc, error, currentLine);
                if (diagnostic) {
                  diagnostics.push(diagnostic);
                }
              }
            }
          }
        }
        
        // Track line position for next document
        const docText = doc.toString();
        currentLine += docText.split('\n').length;
      }
    } catch (error) {
      // Ignore parse errors - let YAML extension handle those
    }
    
    this.diagnosticCollection.set(document.uri, diagnostics);
  }

  private isDrasiFile(fileName: string): boolean {
    return fileName.includes('query') ||
           fileName.includes('source') ||
           fileName.includes('reaction') ||
           fileName.includes('drasi') ||
           fileName.includes('resources');
  }

  private createDiagnostic(
    document: vscode.TextDocument,
    doc: yaml.Document,
    error: any,
    baseLineOffset: number
  ): vscode.Diagnostic | null {
    try {
      // Find the location of the error in the document
      const errorPath = error.instancePath.split('/').filter((p: string) => p);
      let range = new vscode.Range(baseLineOffset, 0, baseLineOffset, 0);
      
      if (errorPath.length > 0) {
        // Try to find the line with the error
        const docText = doc.toString();
        const lines = docText.split('\n');
        
        for (let i = 0; i < lines.length; i++) {
          const line = lines[i];
          const key = errorPath[errorPath.length - 1];
          if (line.includes(key + ':')) {
            range = new vscode.Range(
              baseLineOffset + i, 0,
              baseLineOffset + i, line.length
            );
            break;
          }
        }
      }
      
      let message = error.message;
      if (error.params) {
        if (error.params.allowedValues) {
          message += ` (allowed: ${error.params.allowedValues.join(', ')})`;
        }
        if (error.params.missingProperty) {
          message = `Missing required property: ${error.params.missingProperty}`;
        }
      }
      
      return new vscode.Diagnostic(
        range,
        message,
        vscode.DiagnosticSeverity.Error
      );
    } catch (e) {
      return null;
    }
  }

  dispose() {
    this.diagnosticCollection.dispose();
  }
}
