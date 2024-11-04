/**
 * Copyright 2024 The
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

import { DrasiReaction, ChangeEvent,parseYaml, ControlEvent, getConfigValue } from '@drasi/reaction-sdk';

const databaseHostname = getConfigValue('DatabaseHostname');
const databasePort = getConfigValue('DatabasePort');
const databaseUser = getConfigValue('DatabaseUser');
const databasePassword = getConfigValue('DatabasePassword');
const databaseDbname = getConfigValue('DatabaseDbname');
const databaseCient = getConfigValue('DatabaseClient', 'pg');
const databaseSsl = convertConfigValue(getConfigValue('DatabaseSsl', 'false'));

let knex = require('knex')({
    client: databaseCient,
    connection: {
      host : databaseHostname,
      port : databasePort,
      user :   databaseUser,
      password : databasePassword,
      database : databaseDbname,
      ssl: databaseSsl
    }
  });


const queryParamsRegex = /@\w+/g;
const addedResultCommand: string = process.env["AddedResultCommand"] ?? '';
console.log(`AddedResultCommand: ${addedResultCommand}`);
const addedResultCommandParamList: string[] = [];
// Retrieve the parameters from the addedResultCommand
if (addedResultCommand !== '') {
    const matches: RegExpMatchArray | null = addedResultCommand.match(queryParamsRegex);
    console.log(`Matches: ${matches}`);
    if (matches) {
        for (const match of matches) {
            const param: string = match.substring(1);
            addedResultCommandParamList.push(param);
        }
    }
}

const updatedResultCommand: string = process.env["UpdatedResultCommand"] ?? '';
console.log(`UpdatedResultCommand: ${updatedResultCommand}`);
const updatedResultCommandParamList: string[] = [];
// Retrieve the parameters from the updatedResultCommand
if (updatedResultCommand !== '') {
    const matches: RegExpMatchArray | null = updatedResultCommand.match(queryParamsRegex);
    if (matches) {
        for (const match of matches) {
            const param: string = match.substring(1);
            updatedResultCommandParamList.push(param);
        }
    }
}

const deletedResultCommand: string = process.env["DeletedResultCommand"] ?? '';
console.log(`DeletedResultCommand: ${deletedResultCommand}`);
const deletedResultCommandParamList: string[] = [];
if (deletedResultCommand !== '') {
    const matches: RegExpMatchArray | null = deletedResultCommand.match(queryParamsRegex);
    if (matches) {
        for (const match of matches) {
            const param: string = match.substring(1);
            deletedResultCommandParamList.push(param);
        }
    }
}

let storedProcReaction = new DrasiReaction(onChangeEvent,{
    parseQueryConfig: parseYaml,
    onControlEvent: onControlEvent
});


// Start the reaction
storedProcReaction.start();


// Helper functions

// Define the function that will be called when a change event is received
async function onChangeEvent(event: ChangeEvent): Promise<void> {
    for (let added of event.addedResults) {
        console.log(`Processing added results`);
        const queryArguments: any[] = [];
        if (checkSqlCommandParameters(added, addedResultCommandParamList, queryArguments)) { // checks if the results contain the parameters
            console.log(`Issuing added command: ${addedResultCommand}`);
            executeStoredProcedure(addedResultCommand, queryArguments);
        } else {
            throw new Error(`Missing parameters in the added results`);
        }
    }

    for (let updated of event.updatedResults) {
        console.log(`Processing updated results`);
        const queryArguments: string[] = [];
        let afterResults = updated['after']; // Use the after results as the parameters to the stored procedures

        if (checkSqlCommandParameters(afterResults, updatedResultCommandParamList, queryArguments)) { // checks if the results contain the parameters
            console.log(`Issuing updated command: ${updatedResultCommand}`);
            executeStoredProcedure(updatedResultCommand, queryArguments);
        } else {
            throw new Error(`Missing parameters in the updated results`);
        }
    }

    for (let deleted of event.deletedResults) {
        console.log(`Processing deleted results`);
        const queryArguments: string[] = [];
        if (checkSqlCommandParameters(deleted, deletedResultCommandParamList, queryArguments)) { // checks if the results contain the parameters
            console.log(`Issuing deleted command: ${deletedResultCommand}`);
            executeStoredProcedure(deletedResultCommand, queryArguments);
        } else {
            throw new Error(`Missing parameters in the deleted results`);
        }
    }
}


function checkSqlCommandParameters(data: Record<string, any>, paramList: string[], queryArguments: string[]): boolean {
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


function executeStoredProcedure(command: string, queryArguments: string[]) {
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

async function onControlEvent(_event: ControlEvent): Promise<void> {    
}


function convertConfigValue(val: string): boolean | string {
    if (val === "true") return true;
    if (val === "false") return false;
    
    return val;
}
