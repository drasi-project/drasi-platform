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

require("dotenv").config();

const fs = require('fs');
const gremlin = require('gremlin');

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { parse } = require("path");

const port = parseInt(process.env["PORT"] ?? "4002");
const sourceId = process.env["SOURCE_ID"];

const { accountEndpoint, accountKey } = parseCosmosparseCosmosConnectionString(process.env["accountEndpoint"]);

async function main() {
  const app = express();
  app.use(cors());
  app.use(bodyParser.urlencoded( { extended: false }));
  app.use(bodyParser.json());

  // Acquire
  app.post('/acquire', async (req, res) => {
    const input = req.body;
    console.debug(`sourceProxy.main/subscription - Acquiring initial date for queryId:${input.queryId}`);
        
    // Query DB and send initial results to query node
    console.debug(`sourceProxy.main/subscription - queryId: ${input.queryId} - fetching nodeLabels:${JSON.stringify(input.nodeLabels)}, relLabels:${JSON.stringify(input.relLabels)}`);

    const authenticator = new gremlin.driver.auth.PlainTextSaslAuthenticator(
      `/dbs/${process.env["database"]}/colls/${process.env["container"]}`, accountKey
    );
    
    
    const client = new gremlin.driver.Client(
      accountEndpoint, 
      { 
          authenticator,
          traversalsource : "g",
          rejectUnauthorized : true,
          mimeType : "application/vnd.gremlin-v2.0+json"
      }
    );

    const body = { nodes: [], rels: [] }

    // Get Nodes
    const nodeLabels = `"${input.nodeLabels.join('","')}"`;
    const nodeQuery = `g.V().hasLabel(${nodeLabels})`;
    var readable = client.stream(nodeQuery, {}, { batchSize: 100 });

    try {
      for await (const result of readable) {
        for (const node of result.toArray()) {
          // console.debug('node:', JSON.stringify(node));
          const n = {
            id: node.id,
            labels: [node.label],
            properties: {}
          };
          if (node.properties) {
            Object.entries(node.properties).forEach( ([k, v]) => { n.properties[k] = v[0].value });
          }
          body.nodes.push(n);
        }
      }
    } catch (err) {
      console.error(err.stack);
    }

    // Get Relations
    const relLabels = `"${input.relLabels.join('","')}"`;
    const relQuery = `g.E().hasLabel(${relLabels})`;
    readable = client.stream(relQuery, {}, { batchSize: 100 });

    try {
      for await (const result of readable) {
        for (const rel of result.toArray()) {
          // console.debug('rel:', JSON.stringify(rel));
          const r = {
            id: rel.id,
            labels: [rel.label],
            startId: rel.outV,
            startLabel: rel.outVLabel,
            endId: rel.inV,
            endLabel: rel.inVLabel,
            properties: {}
          };
          if (rel.properties) {
            Object.entries(rel.properties).forEach( ([k, v]) => { r.properties[k] = v[0].value });
          }
          body.rels.push(r);
        }
      }
    } catch (err) {
      console.error(err.stack);
    }

    console.info(`sourceProxy.main/acquire - queryId: ${input.queryId} - loaded nodes:${body.nodes.length}, relations:${body.rels.length}.`)
    res.status(200).json(body);
  });

  app.listen(port, () => console.log(`sourceProxy.main - Reactive Graph Source Node Proxy listening on port:${port}`));
}

main().catch((error) => {
  console.error("sourceProxy.main - Error:", error.stack);
  fs.writeFileSync("/dev/termination-log", error.message);
  process.exit(1);
});

function parseCosmosparseCosmosConnectionString(connString) {
  const parts = connString.split(';');

  let accountEndpoint = '';
  let accountKey = '';

  for (const part of parts) {
    const [key, val] = splitAtFirstOccurrence(part, '=');

    switch (key) {
      case 'AccountEndpoint':
        accountEndpoint = val.replace("https://", "wss://");
        accountEndpoint = accountEndpoint.replace("documents.azure.com", "gremlin.cosmos.azure.com");
        break;
      case 'AccountKey':
        accountKey = val;
        break;
    }
  }

  return { accountEndpoint, accountKey};
}

function splitAtFirstOccurrence(str, delimiter) {
  const index = str.indexOf(delimiter);
  if (index !== -1) {
    const firstPart = str.slice(0, index);
    const secondPart = str.slice(index + delimiter.length);
    return [firstPart, secondPart];
  } else {
    return [str];
  }
}