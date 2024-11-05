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
const schemaInspector = require('knex-schema-inspector');
const knex = require('knex')(extractConfig(process.env));
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const port = parseInt(process.env["app_port"] ?? "4002");
const sourceId = process.env["SOURCE_ID"];

const inspector = schemaInspector.SchemaInspector(knex);

const pgTypes = require('pg').types;

const parseBigInt = (value) => Number(value);
const parseNumeric = (value) => Number(value);
const parseMoney = (value) => Number(value.replace(/^\$/, ''));
pgTypes.setTypeParser(20, parseBigInt);
pgTypes.setTypeParser(1700, parseNumeric);
pgTypes.setTypeParser(790, parseMoney);


async function main() {
  const app = express();
  app.use(cors());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());

  app.post('/acquire', async (req, res, next) => {
    try {
      const input = req.body;
      console.debug(`sourceProxy.main/subscription - Acquiring initial date for queryId:${input.queryId}`);

      // Query DB and send initial results to query node
      console.debug(`sourceProxy.main/subscription - queryId: ${input.queryId} - fetching nodeLabels:${JSON.stringify(input.nodeLabels)}, relLabels:${JSON.stringify(input.relLabels)}`);

      const body = { nodes: [], rels: [] }

      // Get Nodes
      for (let label of input.nodeLabels) {
        let idField = await inspector.primary(label);
        let tableInfo = await inspector.tableInfo(label);

        let idPrefix = tableInfo.name;
        if (tableInfo.schema)
          idPrefix = tableInfo.schema + '.' + idPrefix;

        // todo: stream results
        let data = await knex(label).select('*');
        for (let row of data) {
          let node = mapRowToNode(row, label, idPrefix, idField);
          body.nodes.push(node);
        }
      }

      // Get Relations
      // TODO

      console.info(`sourceProxy.main/acquire - queryId: ${input.queryId} - loaded nodes:${body.nodes.length}, relations:${body.rels.length}.`)
      res.status(200).json(body);
    }
    catch (err) {
      next(err);
    }
  });

  app.listen(port, () => console.log(`sourceProxy.main - Reactive Graph Source Node Proxy listening on port:${port}`));
}

function mapRowToNode(row, label, idPrefix, idField) {
  return {
    id: sanitizeNodeId(idPrefix + ":" + row[idField]),
    labels: [label],
    properties: row
  };
}

function sanitizeNodeId(id) {
  return id.replace('.', ':');
}

function extractConfig(cfg) {
  let dbConfig = {};
  dbConfig.client = cfg.client;
  dbConfig.connection = {};
  dbConfig.connection.host = cfg.host;
  dbConfig.connection.port = parseInt(cfg.port);
  dbConfig.connection.user = cfg.user;
  dbConfig.connection.password = cfg.password;
  dbConfig.connection.database = cfg.database;
  dbConfig.connection.ssl = convertConfigValue(cfg.ssl);
  dbConfig.connection.encrypt = convertConfigValue(cfg.encrypt);
  dbConfig.trustServerCertificate = convertConfigValue(cfg.trustServerCertificate);

  console.log("sourceProxy.main - dbConfig:", dbConfig);
  return dbConfig;
}

/**
 * @param {string} val
 */
function convertConfigValue(val) {
  if (val === "true")
    return true;
  if (val === "false")
    return false;
  
  return val;
}


main().catch((error) => {
  console.error("sourceProxy.main - Error:", error.stack);
  fs.writeFileSync("/dev/termination-log", error.message);
  process.exit(1);
});
