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
import * as yaml from 'js-yaml';
import { randomUUID } from 'crypto';

export async function createSource() {

  let srcType = await vscode.window.showQuickPick([
    "PostgreSQL",
    "CosmosGremlin",
    "Kubernetes"
  ], { canPickMany: false });

  let result: any = {
    "apiVersion": "query.reactive-graph.io/v1",
    "kind": "Source",
    "metadata": {
      "name": ""
    },
    "spec": {
      "sourceType": srcType,
      "properties": []
    }
  };

  let segments: any[] = [];

  result.metadata.name = await vscode.window.showInputBox({ prompt: "Name", value: "source1" });

  switch (srcType) {
    case "PostgreSQL":
      result.spec.properties.push({
        "name": "database.hostname",
        "value": await vscode.window.showInputBox({ prompt: "Host", value: "localhost" })
      });
      result.spec.properties.push({
        "name": "database.port",
        "value": await vscode.window.showInputBox({ prompt: "Port", value: "5432" })
      });
      result.spec.properties.push({
        "name": "database.user",
        "value": await vscode.window.showInputBox({ prompt: "User", value: "postgres" })
      });

      let pwd = await vscode.window.showInputBox({ prompt: "Password", password: true });
      let secret = {
        apiVersion: "v1",
        kind: "Secret",
        metadata: {
          name: `${result.metadata.name}-creds`
        },
        type: "Opaque",
        stringData: {
          password: pwd
        }
      };

      segments.push(secret);

      result.spec.properties.push({
        "name": "database.password",
        "valueFrom": {
          "secretKeyRef": {
            "name": secret.metadata.name,
            "key": "password"
          }
        }
      });

      result.spec.properties.push({
        "name": "database.dbname",
        "value": await vscode.window.showInputBox({ prompt: "Database", value: "postgres" })
      });
      result.spec.properties.push({
        "name": "database.ssl",
        "value": await vscode.window.showQuickPick(["false", "true"], { canPickMany: false })
      });
      
      result.spec.properties.push({
        "name": "tables",
        "value": await vscode.window.showInputBox({ prompt: "tables", value: "public.Table1, public.Table2" })
      });

      break;
  }

  segments.push(result);

  let content = "";
  for (let segment of segments) {
    content += yaml.dump(segment) + "\n---\n";
  }

  let doc = await vscode.workspace.openTextDocument({
    language: "yaml",
    content: content
  });

  await vscode.window.showTextDocument(doc);

}