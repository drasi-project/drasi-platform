# Reaction SDK for Drasi

This library provides the building blocks and infrastructure to implement a [Drasi](https://drasi.io/) Reaction in Node.js

## Getting started

### Install the package

```
npm install --save @drasi/reaction-sdk
```

### Basic example

The following example simply breaks down and logs the various parts of the incoming change event from a [Continuous Query](https://drasi.io/concepts/continuous-queries/).

```typescript
import { DrasiReaction, ChangeEvent } from '@drasi/reaction-sdk';

let myReaction = new DrasiReaction(async (event: ChangeEvent) => {
        
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
});

myReaction.start();
```

### A more advanced example

The following example illustrates 
 - Retrieving a configuration value from the Reaction manifest
 - Defining a custom per query configuration object
 - Parsing the per query configuration object from Yaml
 - Process change events form thw query
 - Process control events (start, stop, etc.) from the query


```typescript
import { DrasiReaction, ChangeEvent,parseYaml, ControlEvent, getConfigValue } from '@drasi/reaction-sdk';

// Retrieve the connection string from the Reaction configuration
const myConnectionString = getConfigValue("MyConnectionString");

// Define a custom per query configuration object
class MyQueryConfig {
    greeting: string = "Default greeting";
}

// Define the function that will be called when a change event is received
async function onChangeEvent(event: ChangeEvent, queryConfig?: MyQueryConfig): Promise<void> {
    // We can access the per query config here
    console.log(queryConfig.greeting);  

    // do something with the result set diff
}

// Define the function that will be called when a control event is received
async function onControlEvent(event: ControlEvent, queryConfig?: MyQueryConfig): Promise<void> {    
    console.log(`Received control signal: ${JSON.stringify(event.controlSignal)} for query ${event.queryId}`);    
}

console.log(`Starting Drasi reaction with connection string: ${myConnectionString}`);

// Configure the Reaction with the onChangeEvent and onControlEvent functions
let myReaction = new DrasiReaction<MyQueryConfig>(onChangeEvent, {
    parseQueryConfig: parseYaml,  // Parse the per query configuration from Yaml
    onControlEvent: onControlEvent
});

// Start the Reaction
myReaction.start();
```