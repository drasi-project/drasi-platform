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

import { DaprServer } from "@dapr/dapr";
import { readdirSync } from 'fs';
import { createRequire } from "module";
const require = createRequire(import.meta.url);

// Standard configuration settings to integrate with Reactive Graph.
const pubsubName = process.env["PUBSUB"] ?? "drasi-pubsub";
const configDirectory = process.env["QueryConfigPath"] ?? "/etc/queries";

// Database configuration settings
const databaseHostname = process.env["DatabaseHostname"];
const databasePort = process.env["DatabasePort"];
const databaseCient = process.env["DatabaseClient"] ?? "pg";// Type of database: pg, mysql 
const databaseUser = process.env["DatabaseUser"];
const databaseDbname = process.env["DatabaseDbname"];
const databasePassword = process.env["DatabasePassword"];
const databaseSsl = process.env["DatabaseSsl"] ?? false;

console.log('Databasessl: ', databaseSsl);

// Setup knex 
let knex = require('knex')({
  client: databaseCient,
  connection: {
    host : databaseHostname,
    port : databasePort,
    user :   databaseUser,
    password : databasePassword,
    database : databaseDbname,
    ssl: false
  }
});

// Regex to extract the parameters from the command (e.g. @param1, @param2)
const queryParamsRegex = /@\w+/g;

const addedResultCommand = process.env["AddedResultCommand"] ?? '';
console.log(`AddedResultCommand: ${addedResultCommand}`);
const addedResultCommandParamList = [];
// Retrieve the parameters from the addedResultCommand
if (addedResultCommand !== '') {
  const matches = addedResultCommand.match(queryParamsRegex);
  console.log(`Matches: ${matches}`);
  for (const match of matches) {
    const param = match.substring(1);
    addedResultCommandParamList.push(param);
  }
}

const updatedResultCommand = process.env["UpdatedResultCommand"] ?? '';
console.log(`AddedResultCommand: ${addedResultCommand}`);
const updatedResultCommandParamList = [];
// Retrieve the parameters from the updatedResultCommand
if (updatedResultCommand !== '') {
  const matches = updatedResultCommand.match(queryParamsRegex);
  for (const match of matches) {
    const param = match.substring(1);
    updatedResultCommandParamList.push(param);
  }
}

const deletedResultCommand = process.env["DeletedResultCommand"] ?? '';
console.log(`DeletedResultCommand: ${deletedResultCommand}`);
const deletedResultCommandParamList = [];
if (deletedResultCommand !== '') {
  const matches = deletedResultCommand.match(queryParamsRegex);
  for (const match of matches) {
    const param = match.substring(1);
    deletedResultCommandParamList.push(param);
  }
}

async function main() {
  console.info(`Starting StoredProc Reaction`);  

  let queryIds = readdirSync(configDirectory);

  let appHost = "127.0.0.1";
  let appPort = "80";
  const daprServer = new DaprServer({serverHost: appHost, serverPort: appPort});
  console.log(`Set up daprServer`);``
  for (const queryId of queryIds) {
    if (!queryId || queryId.startsWith('.')) 
      continue;
    console.log(`Processing queryId: ${queryId}`);
    // Set up a dapr subscription for each queryId
    await daprServer.pubsub.subscribe(pubsubName, queryId + "-results", processEvents);
  }

  console.info(`StoredProc Reaction started`);  
  await daprServer.start();
}

async function processEvents(changeEvent) {
  console.log("Processing events...");
  if (changeEvent.kind === "change") {
    if (addedResultCommand !== '' && changeEvent.addedResults.length > 0) {
      console.log("Processing added results...");
      processAddedQueryResults(addedResultCommand, addedResultCommandParamList, changeEvent.addedResults);
    }

    if (updatedResultCommand !== '' && changeEvent.updatedResults.length > 0) {
      console.log("Processing updated results...");
      processUpdatedQueryResults(updatedResultCommand, updatedResultCommandParamList, changeEvent.updatedResults);
    }

    if (deletedResultCommand !== '' && changeEvent.deletedResults.length > 0) {
      console.log("Processing deleted results...")
      processDeletedQueryResults(deletedResultCommand, deletedResultCommandParamList, changeEvent.deletedResults);
    }
  }
}



function processAddedQueryResults(addedResultCommand, addedResultCommandParamList, addedResults) {
  console.log(`Processing ${addedResults.length} Added Results...`);
  for (let res of addedResults) {
    const queryArguments = [];
    if (checkSqlCommandParameters(res, addedResultCommandParamList, queryArguments)) { // checks the if the results contain the parameters
      console.log(`Issuing added command: ${addedResultCommand}`);
      executeStoredProcedure(addedResultCommand, queryArguments);
    } else {
      throw new Error(`Missing parameters in the added results`);
    } 
  }
}

function processUpdatedQueryResults(updatedResultCommand, updatedResultCommandParamList, updatedResults) {
  console.log(`Processing ${updatedResults.length} Updated Results...`);
  for (let res of updatedResults) {
    let afterResult = res['after'];
    const queryArguments = [];
    if (checkSqlCommandParameters(afterResult, updatedResultCommandParamList,queryArguments)) {
      console.log(`Issuing updated command: ${updatedResultCommand}`);
      executeStoredProcedure(updatedResultCommand, queryArguments);
    } else {
      throw new Error(`Missing parameters in the updated results`);
    }
  
  }
}

function processDeletedQueryResults(deletedResultCommand, deletedResultCommandParamList, deletedResults) {
  console.log(`Processing ${deletedResults.length} Deleted Results...`);
  for (let res of deletedResults) {
    const queryArguments = [];
    if (checkSqlCommandParameters(res, deletedResultCommandParamList,queryArguments)) {
      console.log(`Issuing deleted command: ${deletedResultCommand}`);
      executeStoredProcedure(deletedResultCommand, queryArguments);
    } else {
      throw new Error(`Missing parameters in the deleted results`);
    }
  }
}

function checkSqlCommandParameters(data, paramList, queryArguments) {
  for (const param of paramList) {
    if (data.hasOwnProperty(param)) {
      queryArguments.push(data[param]);
    } else {
      console.log(`Missing param: ${param}`);
      return false;
    }
  }
  return true;
}


function executeStoredProcedure(command, queryArguments) {
  // Check if the command starts with 'CALL ' and add it if it doesn't
  if (!command.trim().toUpperCase().startsWith('CALL ')) {
    command = 'CALL ' + command;
  }
  
  const index = command.indexOf("(");
  var query = command.substring(0, index+1);
  // Replace the parameters with the actual values
  for (let i = 0; i < queryArguments.length; i++) {
    if (typeof queryArguments[i] === 'string') {
      query += `'${queryArguments[i]}'`;
    } else {
      query += queryArguments[i];
    }
    query += (i < queryArguments.length - 1) ? ", " : "";
  }
  query += ")";
  console.log(`Executing the stored proc: ${query}`);

  // Execute the query
  knex.raw(query).then(() => {
    console.log("The query was executed successfully");
  }).catch((error) => {
    console.log(error);
  });
}

main().catch((error) => {
  console.error("Error:", error);
});