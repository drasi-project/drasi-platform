import * as vscode from 'vscode';
import { createSource } from './create-source';
import { QueryExplorer } from './query-explorer';
import { SourceProviderExplorer } from './source-provider-explorer';
import { ReactionProviderExplorer } from './reaction-provider-explorer';

export function activate(context: vscode.ExtensionContext) {

	console.log('Congratulations, your extension "drasi" is now active!');

	const queryExplorer = new QueryExplorer();
	vscode.window.registerTreeDataProvider('queries', queryExplorer);

	const sourceProviderExplorer = new SourceProviderExplorer();
	vscode.window.registerTreeDataProvider('sourceProviders', sourceProviderExplorer);

	const reactionProviderExplorer = new ReactionProviderExplorer();
	vscode.window.registerTreeDataProvider('reactionProviders', reactionProviderExplorer);

	context.subscriptions.push(vscode.commands.registerCommand('drasi.createSource', createSource));
}

export function deactivate() {}
