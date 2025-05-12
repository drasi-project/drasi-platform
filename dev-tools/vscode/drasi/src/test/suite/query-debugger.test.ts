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

import * as assert from 'assert';
import * as vscode from 'vscode';
import { QueryDebugger } from '../../query-debugger';
import { ContinuousQuery } from '../../models/continuous-query';
import { DrasiClient } from '../../drasi-client';
import { Disposable } from 'vscode';

suite('QueryDebugger Test Suite', async () => {
	let mockExtensionUri: vscode.Uri;
	let mockQuery: ContinuousQuery;
	let mockDrasiClient: DrasiClient;
	let mockStoppable: Disposable;
	let debuggerInst: QueryDebugger;

	setup(async () => {
		// Mock the extension URI
		mockExtensionUri = vscode.Uri.file('/mock/extension/path');

		// Mock the query
		mockQuery = {
			name: 'Test Query',
			spec: {},
		} as ContinuousQuery;

		// Mock the stoppable session
		mockStoppable = {
			dispose: () => {}
		};

		// Mock the Drasi client
		mockDrasiClient = {
			debugQuery: async (spec: string, onMessage: (data: any) => void, onError: (error: string) => void) => {
				return mockStoppable;
			}
		} as DrasiClient;

		debuggerInst = new QueryDebugger(mockQuery, mockExtensionUri, mockDrasiClient);
	});

	test('Should initialize with correct parameters', () => {
		assert.strictEqual(debuggerInst['query'], mockQuery);
		assert.strictEqual(debuggerInst['extensionUri'], mockExtensionUri);
		assert.strictEqual(debuggerInst['drasiClient'], mockDrasiClient);
		assert.ok(debuggerInst['log']);
	});

	test('Should start debug session successfully', async () => {
		let debugQueryCalled = false;
		mockDrasiClient.debugQuery = async (spec: string, onMessage: (data: any) => void, onError: (error: string) => void) => {
			debugQueryCalled = true;
			assert.strictEqual(spec, mockQuery.spec);
			return mockStoppable;
		};

		await debuggerInst.start();
		assert.ok(debugQueryCalled);
		assert.ok(debuggerInst['session']);
		assert.ok(debuggerInst['resultsPanel']);
	});

	test('Should handle errors during start', async () => {
		const errorMessage = 'Test error';
		mockDrasiClient.debugQuery = async () => {
			throw new Error(errorMessage);
		};

		let errorShown = false;
		const originalShowError = vscode.window.showErrorMessage;
		vscode.window.showErrorMessage = (message: string) => {
			errorShown = true;
			assert.ok(message.includes(errorMessage));
			return Promise.resolve(undefined);
		};

		await debuggerInst.start();
		assert.ok(errorShown);

		// Restore original function
		vscode.window.showErrorMessage = originalShowError;
	});

	test('Should handle incoming messages', async () => {
		await debuggerInst.start();
		
		let messagePosted = false;
		const testMessage = { data: 'test' };
		
		debuggerInst['resultsPanel']!.webview.postMessage = (message: any) => {
			messagePosted = true;
			assert.deepStrictEqual(message, testMessage);
			return Promise.resolve(true);
		};

		debuggerInst['handleIncomingMessage'](testMessage);
		assert.ok(messagePosted);
	});

	test('Should clean up resources on stop', async () => {
		await debuggerInst.start();
		
		let stopCalled = false;
		mockStoppable.dispose = () => {
			stopCalled = true;
		};

		let logDisposed = false;
		debuggerInst['log'].dispose = () => {
			logDisposed = true;
		};

		debuggerInst.stop();
		
		assert.ok(stopCalled);
		assert.ok(logDisposed);
	});

	test('Should clean up when results panel is closed', async () => {
		await debuggerInst.start();
		
		let stopCalled = false;
		mockStoppable.dispose = () => {
			stopCalled = true;
		};

		debuggerInst['resultsPanel']?.dispose();
		
		assert.strictEqual(debuggerInst['resultsPanel'], undefined);
		assert.ok(stopCalled);
	});
});
