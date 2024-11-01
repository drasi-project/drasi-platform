import { DrasiReaction } from '@drasi/reaction-sdk';

let myReaction = new DrasiReaction(async (event) => {
        
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