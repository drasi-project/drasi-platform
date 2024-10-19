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
import { createSource } from './create-source';
import { QueryExplorer } from './query-explorer';
import { SourceProviderExplorer } from './source-provider-explorer';
import { ReactionProviderExplorer } from './reaction-provider-explorer';

export function activate(context: vscode.ExtensionContext) {
	const queryExplorer = new QueryExplorer(context.extensionUri);
	vscode.window.registerTreeDataProvider('queries', queryExplorer);

	const sourceProviderExplorer = new SourceProviderExplorer();
	vscode.window.registerTreeDataProvider('sourceProviders', sourceProviderExplorer);

	const reactionProviderExplorer = new ReactionProviderExplorer();
	vscode.window.registerTreeDataProvider('reactionProviders', reactionProviderExplorer);

	context.subscriptions.push(vscode.commands.registerCommand('drasi.createSource', createSource));
}

export function deactivate() {}
