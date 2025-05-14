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
import { CodeLensProvider } from '../../codelens-provider';
import { DrasiClient } from '../../drasi-client';
import { mock } from 'ts-mockito';

suite('CodeLens Provider Test Suite', async () => {
	let provider: CodeLensProvider;
	let mockDrasiClient: DrasiClient;

	setup(async () => {
		mockDrasiClient = mock<DrasiClient>();
		provider = new CodeLensProvider(vscode.Uri.parse('file:///test'), mockDrasiClient);
	});

	test('should provide no code lenses for empty document', async () => {
		const document = createMockDocument('');
		const lenses = provider.provideCodeLenses(document, new vscode.CancellationTokenSource().token);
		assert.strictEqual(lenses.length, 0);
	});

	test('should provide code lenses for ContinuousQuery', async () => {
		const yaml = `
apiVersion: v1
kind: ContinuousQuery
name: test-query
spec:
    query: MATCH (n) RETURN n`;
		
		const document = createMockDocument(yaml);
		const lenses = provider.provideCodeLenses(document, new vscode.CancellationTokenSource().token);
		
		assert.strictEqual(lenses.length, 2);
		assert.strictEqual(lenses[0].command?.command, 'editor.query.run');
		assert.strictEqual(lenses[1].command?.command, 'editor.resource.apply');
	});

	test('should provide code lens for Source', async () => {
		const yaml = `
apiVersion: v1
kind: Source
name: test-source
spec:
    type: test`;
		
		const document = createMockDocument(yaml);
		const lenses = provider.provideCodeLenses(document, new vscode.CancellationTokenSource().token);
		
		assert.strictEqual(lenses.length, 1);
		assert.strictEqual(lenses[0].command?.command, 'editor.resource.apply');
	});

	test('should provide code lens for Reaction', async () => {
		const yaml = `
apiVersion: v1
kind: Reaction
name: test-reaction
spec:
    type: test`;
		
		const document = createMockDocument(yaml);
		const lenses = provider.provideCodeLenses(document, new vscode.CancellationTokenSource().token);
		
		assert.strictEqual(lenses.length, 1);
		assert.strictEqual(lenses[0].command?.command, 'editor.resource.apply');
	});

	test('should handle multiple documents in single file', async () => {
		const yaml = `
apiVersion: v1
kind: ContinuousQuery
name: test-query
spec:
    query: MATCH (n) RETURN n
---
apiVersion: v1
kind: Source
name: test-source
spec:
    type: test`;
		
		const document = createMockDocument(yaml);
		const lenses = provider.provideCodeLenses(document, new vscode.CancellationTokenSource().token);
		
		assert.strictEqual(lenses.length, 3); // 2 for Query + 1 for Source
	});
});

function createMockDocument(content: string): vscode.TextDocument {
	return {
		getText: () => content,
		uri: vscode.Uri.parse('file:///test.yaml'),
		fileName: '/test.yaml',
		isUntitled: false,
		languageId: 'yaml',
		version: 1,
		isDirty: false,
		isClosed: false,
		save: () => Promise.resolve(true),
		eol: vscode.EndOfLine.LF,
		lineCount: content.split('\n').length,
		lineAt: (line: number | vscode.Position) => {
			const lineNumber = typeof line === 'number' ? line : line.line;
			const lines = content.split('\n');
			return {
				lineNumber,
				text: lines[lineNumber],
				range: new vscode.Range(0, 0, 0, 0),
				rangeIncludingLineBreak: new vscode.Range(0, 0, 0, 0),
				firstNonWhitespaceCharacterIndex: 0,
				isEmptyOrWhitespace: false
			};
		},
		offsetAt: () => 0,
		positionAt: () => new vscode.Position(0, 0),
		getWordRangeAtPosition: () => undefined,
		validateRange: () => new vscode.Range(0, 0, 0, 0),
		validatePosition: () => new vscode.Position(0, 0),
	};
}
