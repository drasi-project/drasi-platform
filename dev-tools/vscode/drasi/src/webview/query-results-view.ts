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
          let results = new Map();

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
              results.set(JSON.stringify(result), result);
            }

            for (const update of updatedResults) {
              const oldKey = JSON.stringify(update.before);
              const newKey = JSON.stringify(update.after);
              results.delete(oldKey);
              results.set(newKey, update.after);
            }

            for (const result of deletedResults) {
              results.delete(JSON.stringify(result));
            }

            renderTable();
          }

          function renderTable() {
            let data = Array.from(results.values());            
            resultsTable.rowsData = data;
          }
        </script>
      </body>
      </html>
    `;
  }