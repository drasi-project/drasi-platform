import { DrasiReaction, ChangeEvent,parseYaml, ControlEvent, getConfigValue } from '@drasi/reaction-sdk';

const myConnectionString = getConfigValue("MyConnectionString", "");

async function main() {
    console.log(`Starting Drasi reaction with connection string: ${myConnectionString}`);

    let myReaction = new DrasiReaction(onChangeEvent, {
        parseQueryConfig: parseYaml,
        onControlEvent: onControlEvent
    });

    await myReaction.start();
}

class MyQueryConfig {
    greeting: string = "Default greeting";
}

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

async function onControlEvent(event: ControlEvent, queryConfig?: MyQueryConfig): Promise<void> {    
    console.log(`Received control signal: ${JSON.stringify(event.controlSignal)} for query ${event.queryId}`);    
}

main().catch(console.error);