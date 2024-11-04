"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const reaction_sdk_1 = require("@drasi/reaction-sdk");
const pubsubName = (0, reaction_sdk_1.getConfigValue)('pubsubName', 'drasi-pubsub');
const databaseHostname = (0, reaction_sdk_1.getConfigValue)('databaseHostname');
const databasePort = (0, reaction_sdk_1.getConfigValue)('databasePort');
const databaseUser = (0, reaction_sdk_1.getConfigValue)('databaseUser');
const databasePassword = (0, reaction_sdk_1.getConfigValue)('databasePassword');
const databaseDbname = (0, reaction_sdk_1.getConfigValue)('databaseDbname');
const databaseCient = (0, reaction_sdk_1.getConfigValue)('databaseCient', 'pg');
const databaseSsl = convertConfigValue((0, reaction_sdk_1.getConfigValue)('databaseSsl', 'false'));
let knex = require('knex')({
    client: databaseCient,
    connection: {
        host: databaseHostname,
        port: databasePort,
        user: databaseUser,
        password: databasePassword,
        database: databaseDbname,
        ssl: databaseSsl
    }
});
const queryParamsRegex = /@\w+/g;
const addedResultCommand = process.env["AddedResultCommand"] ?? '';
console.log(`AddedResultCommand: ${addedResultCommand}`);
const addedResultCommandParamList = [];
// Retrieve the parameters from the addedResultCommand
if (addedResultCommand !== '') {
    const matches = addedResultCommand.match(queryParamsRegex);
    console.log(`Matches: ${matches}`);
    if (matches) {
        for (const match of matches) {
            const param = match.substring(1);
            addedResultCommandParamList.push(param);
        }
    }
}
const updatedResultCommand = process.env["UpdatedResultCommand"] ?? '';
console.log(`UpdatedResultCommand: ${updatedResultCommand}`);
const updatedResultCommandParamList = [];
// Retrieve the parameters from the updatedResultCommand
if (updatedResultCommand !== '') {
    const matches = updatedResultCommand.match(queryParamsRegex);
    if (matches) {
        for (const match of matches) {
            const param = match.substring(1);
            updatedResultCommandParamList.push(param);
        }
    }
}
const deletedResultCommand = process.env["DeletedResultCommand"] ?? '';
console.log(`DeletedResultCommand: ${deletedResultCommand}`);
const deletedResultCommandParamList = [];
if (deletedResultCommand !== '') {
    const matches = deletedResultCommand.match(queryParamsRegex);
    if (matches) {
        for (const match of matches) {
            const param = match.substring(1);
            deletedResultCommandParamList.push(param);
        }
    }
}
let storedProcReaction = new reaction_sdk_1.DrasiReaction(onChangeEvent, {
    parseQueryConfig: reaction_sdk_1.parseYaml,
    onControlEvent: onControlEvent
});
// Start the reaction
storedProcReaction.start();
// Helper functions
// Define the function that will be called when a change event is received
async function onChangeEvent(event) {
    for (let added of event.addedResults) {
        console.log(`Processing added results`);
        const queryArguments = [];
        if (checkSqlCommandParameters(added, addedResultCommandParamList, queryArguments)) { // checks if the results contain the parameters
            console.log(`Issuing added command: ${addedResultCommand}`);
            executeStoredProcedure(addedResultCommand, queryArguments);
        }
        else {
            throw new Error(`Missing parameters in the added results`);
        }
    }
    for (let updated of event.updatedResults) {
        console.log(`Processing updated results`);
        const queryArguments = [];
        let afterResults = updated['after']; // Use the after results as the parameters to the stored procedures
        if (checkSqlCommandParameters(afterResults, updatedResultCommandParamList, queryArguments)) { // checks if the results contain the parameters
            console.log(`Issuing updated command: ${updatedResultCommand}`);
            executeStoredProcedure(updatedResultCommand, queryArguments);
        }
        else {
            throw new Error(`Missing parameters in the updated results`);
        }
    }
    for (let deleted of event.deletedResults) {
        console.log(`Processing deleted results`);
        const queryArguments = [];
        if (checkSqlCommandParameters(deleted, deletedResultCommandParamList, queryArguments)) { // checks if the results contain the parameters
            console.log(`Issuing deleted command: ${deletedResultCommand}`);
            executeStoredProcedure(deletedResultCommand, queryArguments);
        }
        else {
            throw new Error(`Missing parameters in the deleted results`);
        }
    }
}
function checkSqlCommandParameters(data, paramList, queryArguments) {
    for (const param of paramList) {
        if (data.hasOwnProperty(param)) {
            queryArguments.push(data[param]);
        }
        else {
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
    var query = command.substring(0, index + 1);
    // Replace the parameters with the actual values
    for (let i = 0; i < queryArguments.length; i++) {
        if (typeof queryArguments[i] === 'string') {
            query += `'${queryArguments[i]}'`;
        }
        else {
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
async function onControlEvent(event) {
    // The Stored proc reaction should not call any stored procedure on control events
    console.log(`Received control signal: ${JSON.stringify(event.controlSignal)} for query ${event.queryId}`);
}
function convertConfigValue(val) {
    if (val === "true")
        return true;
    if (val === "false")
        return false;
    return val;
}
//# sourceMappingURL=index.js.map