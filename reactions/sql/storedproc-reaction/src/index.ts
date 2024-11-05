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

//  mssql requires a different connection object; see https://knexjs.org/faq/recipes.html#connecting-to-mssql-on-azure-sql-database
if (databaseCient === 'mssql') {
    knex = require('knex')({
        client: databaseCient,
        connection: {
          server: databaseHostname,
          user: databaseUser,
          password: databasePassword,
          database: databaseDbname,
          options: {
            port: Number(databasePort),
            encrypt: true,
          },
        }
      });
}


const queryParamsRegex = /@\w+/g;
const addedResultCommand: string = getConfigValue('AddedResultCommand', '');
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

const updatedResultCommand: string = getConfigValue("UpdatedResultCommand",'');
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

const deletedResultCommand: string = getConfigValue("DeletedResultCommand",'');
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

let storedProcReaction = new DrasiReaction(onChangeEvent);


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
            try {
                await executeStoredProcedure(addedResultCommand, queryArguments);
            } catch (error) {
                throw new Error(`Failed to execute added stored procedure: ${error.message}`);
            }
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
            try {
                await executeStoredProcedure(updatedResultCommand, queryArguments);
            } catch (error) {
                throw new Error(`Failed to execute updated stored procedure: ${error.message}`);
            }
        } else {
            throw new Error(`Missing parameters in the updated results`);
        }
    }

    for (let deleted of event.deletedResults) {
        console.log(`Processing deleted results`);
        const queryArguments: string[] = [];
        if (checkSqlCommandParameters(deleted, deletedResultCommandParamList, queryArguments)) { // checks if the results contain the parameters
            console.log(`Issuing deleted command: ${deletedResultCommand}`);
            try {
                await executeStoredProcedure(deletedResultCommand, queryArguments);
            } catch (error) {
                throw new Error(`Failed to execute deleted stored procedure: ${error.message}`);
            }
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


async function executeStoredProcedure(command: string, queryArguments: string[]): Promise<void> {
    // Check if the command starts with 'CALL ' and add it if it doesn't
    if (databaseCient !== 'mssql' && !command.trim().toUpperCase().startsWith('CALL ')) {
      command = 'CALL ' + command;
    }

    // Check if the command starts with 'EXEC ' and add it if it doesn't
    if (databaseCient === 'mssql' && !command.trim().toUpperCase().startsWith('EXEC ')) {
        command = 'EXEC ' + command;
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


    if (databaseCient === 'mssql') {
        // mssql syntax requirments
        query = query.replace('(', ' ').replace(')', '');
    }
    console.log(`Executing the stored proc: ${query}`);
  
    // Execute the query
    try {
        await knex.raw(query);
        console.log("The query was executed successfully");
      } catch (error) {
        console.log(error);
        throw new Error(`Failed to execute stored procedure: ${error.message}`);
      }
  }


function convertConfigValue(val: string): boolean | string {
    if (val === "true") return true;
    if (val === "false") return false;
    
    return val;
}
