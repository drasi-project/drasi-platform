import * as vscode from 'vscode';
import { DrasiClient } from './drasi-client';
import * as yaml from 'yaml';
import { Resource } from './models/resource';
import { ContinuousQuery } from './models/continuous-query';
import { QueryDebugger } from './query-debugger';

export class CodeLensProvider implements vscode.CodeLensProvider {
    private extensionUri: vscode.Uri;
    private drasiClient: DrasiClient;

    constructor(extensionUri: vscode.Uri, drasiClient: DrasiClient) {
        this.extensionUri = extensionUri;
        this.drasiClient = drasiClient;
        
        vscode.commands.getCommands(true).then((commands) => {
            if (!commands.includes('editor.query.run')) {
                vscode.commands.registerCommand('editor.query.run', this.runQuery.bind(this));
            }
            if (!commands.includes('editor.resource.apply')) {
                vscode.commands.registerCommand('editor.resource.apply', this.applyResource.bind(this));
            }
        });
    }

    provideCodeLenses(document: vscode.TextDocument, token: vscode.CancellationToken): vscode.CodeLens[] {
        const codeLenses: vscode.CodeLens[] = [];
        let docStr = document.getText();
        let docs = yaml.parseAllDocuments(docStr);

        docs.forEach((doc, index) => {
            if (!doc.has('kind') || !doc.has('apiVersion') || !doc.has('name')) {
                return;
            }
            switch (doc.get('kind')) {
                case 'ContinuousQuery':
                    const range = new vscode.Range(getPosition(docStr, doc.range[0]), getPosition(docStr, doc.range[1]));
                    codeLenses.push(new vscode.CodeLens(range, {
                        command: 'editor.query.run',
                        title: 'Debug',
                        arguments: [doc.toJS()]
                    }));
                    codeLenses.push(new vscode.CodeLens(range, {
                        command: 'editor.resource.apply',
                        title: 'Apply',
                        arguments: [doc.toJS()]
                    }));
                    break;
                case 'Source':
                case 'Reaction':
                    const range2 = new vscode.Range(getPosition(docStr, doc.range[0]), getPosition(docStr, doc.range[1]));
                    codeLenses.push(new vscode.CodeLens(range2, {
                        command: 'editor.resource.apply',
                        title: 'Apply',
                        arguments: [doc.toJS()]
                    }));
                    break;
            }

        });

        return codeLenses;
    }

    async runQuery(query: ContinuousQuery) {
        if (!query) {
            return;
        }
        let dbg = new QueryDebugger(query, this.extensionUri, this.drasiClient);
        dbg.start();
    }

    async applyResource(resource: Resource<any>) {
        if (!resource) {
            return;
        }

        const confirm = await vscode.window.showWarningMessage(
            `Are you sure you want to apply ${resource.name}?`,
            'Yes',
            'No'
        );

        if (confirm !== 'Yes') {
            return;
        }

        await vscode.window.withProgress({
            title: `Applying ${resource.name}`,
            location: vscode.ProgressLocation.Notification,
        }, async (progress, token) => {
            progress.report({ message: "Applying..." });

            try {
                await this.drasiClient.applyResource(resource, () => vscode.commands.executeCommand('drasi.refresh'));
                vscode.window.showInformationMessage(`Resource ${resource.name} applied successfully`);
            }
            catch (err) {
                vscode.window.showErrorMessage(`Error applying resource: ${err}`);
            }
        });
        vscode.commands.executeCommand('drasi.refresh');
    }
}

function getPosition(yamlString: string, index: number): vscode.Position {
    if (index === 0) {
        return new vscode.Position(0, 0);
    }
    const lines = yamlString.slice(0, index).split('\n');
    const lineNumber = lines.length;
    const columnNumber = lines[lines.length - 1].length + 1;
    return new vscode.Position(lineNumber, columnNumber);
}