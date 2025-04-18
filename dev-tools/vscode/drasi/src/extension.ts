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
import { WorkspaceExplorer } from './workspace-explorer';
import { DrasiExplorer } from './drasi-explorer';
import { DrasiClient } from './drasi-client';
import { CodeLensProvider } from './codelens-provider';
import { ConfigurationRegistry } from './sdk/config';

let drasiClient: DrasiClient | undefined = undefined;

export function activate(context: vscode.ExtensionContext) {
	let configRegistry = new ConfigurationRegistry();
	configRegistry.onCurrentRegistrationChanged(() => vscode.commands.executeCommand('drasi.refresh'));
	drasiClient = new DrasiClient(configRegistry);
	const workspaceExplorer = new WorkspaceExplorer(context.extensionUri, drasiClient);
	vscode.window.registerTreeDataProvider('workspace', workspaceExplorer);
	
	const drasiExplorer = new DrasiExplorer(context.extensionUri, drasiClient, configRegistry);
	vscode.window.registerTreeDataProvider('drasi', drasiExplorer);
	
	context.subscriptions.push(
        vscode.languages.registerCodeLensProvider({ language: 'yaml' }, new CodeLensProvider(context.extensionUri, drasiClient))
    );
	
}

export function deactivate() {
	if (drasiClient) {
		drasiClient.close();
		drasiClient = undefined;
	}
}