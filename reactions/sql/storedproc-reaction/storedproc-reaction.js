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

const databaseHostname = process.env["DatabaseHostname"];
const databasePort = process.env["DatabasePort"];
const databaseCient = process.env["DatabaseClient"] ?? "pg";// Type of database: pg, mysql, mssql, oracledb...
const databaseUser = process.env["DatabaseUser"];
const databaseDbname = process.env["DatabaseDbname"];
const databasePassword = process.env["DatabasePassword"];
const sqlCommand = process.env["SqlCommand"] ?? '';
const sqlLiteFileName = process.env["SqlLiteFileName"] ?? ":memory:"; 

// Setup knex 
let knex = require('knex')({
  client: databaseCient,
  connection: {
    host : databaseHostname,
    port : databasePort,
    user :   databaseUser,
    password : databasePassword,
    database : databaseDbname,
    ssl: { rejectUnauthorized: false } 
  }
});

const queryParamsRegex = /@\w+/g;


const addedResultCommand = process.env["AddedResultCommand"] ?? '';
console.log(`AddedResultCommand: ${addedResultCommand}`);
const addedResultCommandParamList = [];
if (addedResultCommand !== '') {
  const matches = addedResultCommand.match(queryParamsRegex);
  console.log(`Matches: ${matches}`);
  for (const match of matches) {
    const param = match.substring(1);
    console.log(`Extracted AddedResultCommand Param: ${param}`);
    addedResultCommandParamList.push(param);
  }
}

const updatedResultCommand = process.env["UpdatedResultCommand"] ?? '';
console.log(`AddedResultCommand: ${addedResultCommand}`);
const updatedResultCommandParamList = [];
if (updatedResultCommand !== '') {
  const matches = updatedResultCommand.match(queryParamsRegex);
  for (const match of matches) {
    const param = match.substring(1);
    console.log(`Extracted UpdatedResultCommand Param: ${param}`);
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
    console.log(`Extracted DeletedResultCommand Param: ${param}`);
    deletedResultCommandParamList.push(param);
  }
}

async function main() {
  console.info(`Starting StoredProc Reaction`);  

  let queryIds = readdirSync(configDirectory);
  const daprServer = new DaprServer("127.0.0.1",80);
  console.log(`Set up daprServer`);``
  for (const queryId of queryIds) {
    if (!queryId || queryId.startsWith('.')) 
      continue;
    console.log(`Processing queryId: ${queryId}`);
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
    let newCommand = addedResultCommand;  // Create a new sql command
    const queryArguments = [];
    if (checkSqlCommandParameters(res, addedResultCommandParamList, queryArguments)) { // checks the if the results contain the parameters
      console.log(`Issuing added command: ${newCommand}`);
      executeStoredProcedure(newCommand, queryArguments);
    } else {
      throw new Error(`Missing parameters in the added results`);
    } 
  }
}

function processUpdatedQueryResults(updatedResultCommand, updatedResultCommandParamList, updatedResults) {
  console.log(`Processing ${updatedResults.length} Updated Results...`);
  for (let res of updatedResults) {
    let newCommand = updatedResultCommand;

    let afterResult = res['after'];
    const queryArguments = [];
    if (checkSqlCommandParameters(afterResult, updatedResultCommandParamList,queryArguments)) {
      console.log(`Issuing updated command: ${newCommand}`);
      executeStoredProcedure(newCommand, updatedResultCommandParamList);
    } else {
      throw new Error(`Missing parameters in the updated results`);
    }
  
  }
}

function processDeletedQueryResults(deletedResultCommand, deletedResultCommandParamList, deletedResults) {
  console.log(`Processing ${deletedResults.length} Deleted Results...`);
  for (let res of deletedResults) {
    let newCommand = deletedResultCommand;
    const queryArguments = [];
    if (checkSqlCommandParameters(res, deletedResultCommandParamList,queryArguments)) {
      console.log(`Issuing deleted command: ${newCommand}`);
      executeStoredProcedure(newCommand, deletedResultCommandParamList);
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
  const index = command.indexOf("(");
  var query = command.substring(0, index+1);
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
  knex.raw(query).then(() => {
    console.log("The query was executed successfully");
  }).catch((error) => {
    console.log(error);
  });
}

main().catch((error) => {
  console.error("Error:", error);
});