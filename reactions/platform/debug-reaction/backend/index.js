const { DrasiReaction, ChangeEvent, parseYaml, ControlEvent, getConfigValue } = require('@drasi/reaction-sdk');
const express = require('express');
const config = require('config');
const cors = require('cors');
const WebSocket = require("ws");

const app = express();
const port = 3001;
const wss = new WebSocket.Server({ noServer: true });

// Maintain a map of WebSocket clients
const clients = new Map();

// Maintain a map of query results
const queryResults = new Map();

app.use(cors());
const queriesDirectory = config.has('QueryConfigPath') ? config.get('QueryConfigPath') : "/etc/queries";

// wss.on("connection", (ws, req) => {
//   const { queryId } = url.parse(req.url, true).query;
//     if (queryId) {
//         clients.set(queryId, ws);
//     }

//     ws.on("close", () => {
//         clients.delete(queryId);
//     });

// });



// let debugReaction = new DrasiReaction(onChangeEvent, {
//   onControlEvent: onControlEvent,
// });


// async function onChangeEvent(event) {
//   const queryId = event.queryId;
//   console.log(`Received change sequence: ${event.sequence} for query ${queryId}`);
//   console.log(`evt: ${JSON.stringify(event)}`);

//   if (clients.has()) {
//     let queryResult = queryResults.get(queryId);
//     for (let added of event.addedResults) {
//       queryResult.add(added);
//     }

//     for (let deleted of event.deletedResults) {
//       queryResult.remove(deleted);
//     }

//     for (let updated of event.updatedResults) {
//       const groupingKeys = updated['grouping_keys'];
//       queryResult.update(updated.before, updated.after, groupingKeys);
//     }
//   }

//   const ws = clients.get(queryId);
//   ws.send(JSON.stringify({
//     queryId: queryId,
//     data: updatedQueryResult // Send the updated query result or relevant change
//   }));
// }


// async function onControlEvent(event) {
//   for (let added of event.addedResults) {}
// }




app.get('/query/:query_id', (req, res) => {
  const queryId = req.params.query_id;
  console.log(`Received request for query ${queryId}`);
  // Assuming you have a function getQueryResult that takes a queryId and returns the result
  const result = getQueryResult(queryId);
  res.json(result);
});


app.get('/query/:query_id/dapr_status', (req, res) => {

});


app.get("/queries", (req, res) => {
  queries = ["query1", "query2", "query3"];
  // fs.readdir(queriesDirectory, (err, files) => {
  //   if (err) {
  //     return res.status(500).json({ error: "Failed to read queries directory" });
  //   }
  //   // Return the filenames (query names)
  //   const queries = files.map(file => path.basename(file, ".txt"));
  //   res.json(queries);
  // });
  res.json(queries);
});

function getQueryResult(queryId) {
  // Placeholder function to simulate query result retrieval
  // Replace this with actual logic to retrieve the query result
  return { queryId: queryId, result: "Sample result for query " + queryId };
}

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

// debugReaction.start();