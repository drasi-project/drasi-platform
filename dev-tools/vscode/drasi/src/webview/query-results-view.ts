import * as vscode from 'vscode';
import { getUri } from '../utilities/getUri';
import { getNonce } from '../utilities/getNonce';

export function queryResultsView(webview: vscode.Webview, extensionUri: vscode.Uri, initialStatus?: string) {
    const webviewUri = getUri(webview, extensionUri, ["out", "webview.js"]);
    const nonce = getNonce();
    
    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Query Results</title>
        <style>
          table { border-collapse: collapse; width: 100%; }
          th, td { border: 1px solid #ddd; padding: 8px; }          
        </style>
      </head>
      <body>
        <div id="status">
        <h3>
          Status: <vscode-tag id="statusText">${initialStatus}</vscode-tag>
        </h3>
        </div>
        <div id="errors"></div>
        <vscode-divider></vscode-divider>
        <vscode-data-grid id="resultsTable" generate-header="sticky"></vscode-data-grid>        
        <script type="module" nonce="${nonce}" src="${webviewUri}"></script>
        <script nonce="${nonce}">
          const vscode = acquireVsCodeApi();
          const resultsTable = document.getElementById('resultsTable');
          const statusText = document.getElementById('statusText');
          const errors = document.getElementById('errors');
          let resultHashes = new Map();
          let resultValues = [];

          window.addEventListener('message', event => {
            const message = event.data;
            switch (message.kind) {
              case 'control':
                statusText.innerText = message.controlSignal?.kind;
                break;
              case 'error':
                const newItem = document.createElement('p');
                newItem.textContent = message.message;
                errors.appendChild(newItem);
                break;
              case 'change':
                updateResults(message);
                break;
            }
          });

          function updateResults(changeEvent) {
            const { addedResults, updatedResults, deletedResults } = changeEvent;

            for (const result of addedResults) {              
              let index = resultValues.push(result) - 1;
              resultHashes.set(JSON.stringify(result), index);
            }

            for (const update of updatedResults) {
              const oldKey = JSON.stringify(update.before);
              const newKey = JSON.stringify(update.after);
              
              let index = resultHashes.get(oldKey);
              if (index === undefined) {
                index = resultValues.push(update.after) - 1;
              } else {
                resultValues[index] = update.after;
              }
              resultHashes.delete(oldKey);
              resultHashes.set(newKey, index);              
            }

            for (const result of deletedResults) {
              let key = JSON.stringify(result);
              let index = resultHashes.get(key);
              resultHashes.delete(key);
              if (index !== undefined) {
                resultValues.splice(index, 1);
                for (let i = index; i < resultValues.length; i++) {
                  const key = JSON.stringify(resultValues[i]);
                  resultHashes.set(key, i);
                }
              }
            }

            renderTable();
          }

          function renderTable() {
            resultsTable.rowsData = Array.from(resultValues);
          }
        </script>
      </body>
      </html>
    `;
  }