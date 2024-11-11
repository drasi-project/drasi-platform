import { DrasiReaction, ChangeEvent, parseYaml, ControlEvent, getConfigValue } from '@drasi/reaction-sdk';

// Retrieve the connection string from the Reaction configuration
const myConnectionString = getConfigValue("MyConnectionString");

// Define a custom per query configuration object
class MyQueryConfig {
    greeting: string = "Default greeting";
}

// Define the function that will be called when a change event is received
async function onChangeEvent(event: ChangeEvent, queryConfig?: MyQueryConfig): Promise<void> {
    console.log(queryConfig.greeting);
    console.log(`Received change sequence: ${event.sequence} for query ${event.queryId}`);

    for (let added of event.addedResults) {
        console.log(`Added result: ${JSON.stringify(added)}`);
    }
    
    for (let deleted of event.deletedResults) {
        console.log(`Removed result: ${JSON.stringify(deleted)}`);
    }
    
    for (let updated of event.updatedResults) {
        console.log(`Updated result - before: ${JSON.stringify(updated.before)}, after: ${JSON.stringify(updated.after)}`);
    }
}

// Define the function that will be called when a control event is received
async function onControlEvent(event: ControlEvent, queryConfig?: MyQueryConfig): Promise<void> {    
    console.log(`Received control signal: ${JSON.stringify(event.controlSignal)} for query ${event.queryId}`);    
}

console.log(`Starting Drasi reaction with connection string: ${myConnectionString}`);

// Configure the Reaction with the onChangeEvent and onControlEvent functions
let myReaction = new DrasiReaction<MyQueryConfig>(onChangeEvent, {
    parseQueryConfig: parseYaml, // Parse the per query configuration from Yaml
    onControlEvent: onControlEvent
});

// Start the Reaction
myReaction.start();
