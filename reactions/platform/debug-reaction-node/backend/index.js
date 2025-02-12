const { DrasiReaction, ChangeEvent, parseYaml, ControlEvent, getConfigValue } = require('@drasi/reaction-sdk');
const express = require('express');
const config = require('config');
const cors = require('cors');
const WebSocket = require("ws");
const url = require('url');
const fs = require('fs');
const path = require("path");
const http = require("http");
const { debug } = require('console');

const queriesDirectory = config.has('QueryConfigPath') ? config.get('QueryConfigPath') : "/etc/queries";
const queryContainerId = getConfigValue('QueryContainer') || 'default';


const app = express();
const port = 3001;
const clients = new Map();
app.use(cors());
const queryResults = new Map();

app.get("/queries", (req, res) => {
  console.log("Received request for queries");
  fs.readdir(queriesDirectory, (err, files) => {
    if (err) {
      return res.status(500).json({ error: "Failed to read queries directory" });
    }
    const queries = files.map(file => path.basename(file, ".txt"));
    console.log(`Returning queries: ${queries}`);
    res.json(queries);
  });
});

const server = http.createServer(app);
const wss = new WebSocket.Server({ noServer: true });

wss.on("connection", (ws, request) => {
  const queryId = new URL(request.url, `http://${request.headers.host}`).searchParams.get("queryId");
  if (!queryId) {
    ws.send(JSON.stringify({ error: "queryId is required" }));
    ws.close();
    return;
  }

  if (!clients.has(queryId)) {
    clients.set(queryId, []);
  }
  clients.get(queryId).push(ws);


  ws.on("close", () => {
    clients.set(queryId, clients.get(queryId).filter((client) => client !== ws));
      });

  // Retrieve the current query result as initial data
  const queryResult = getCurrentResult(queryContainerId, queryId);
  console.log(`initial data: ${JSON.stringify(queryResult)}`);
  ws.send(JSON.stringify({ queryId, data: queryResult }));
});


async function* getCurrentResult(queryContainerId, queryId) {
  let response;
  console.log(`Fetching data for queryId: ${queryId}, containerId: ${queryContainerId}`);
  try {
      response = await fetch(`http://${queryContainerId}-view-svc/${queryId}`);
      if (!response.ok) {
          console.error(`HTTP error: ${response.status} ${response.statusText}`);
          return;
      }
  } catch (error) {
      console.error(`Error fetching data: ${error.message}`);
      return;
  }

  if (!response.body) {
      return;
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let partialJson = ""; // Accumulate partial JSON objects

    try {
        while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            partialJson += decoder.decode(value, { stream: true });

            // Attempt to parse JSON.  If it fails, it means we have a partial object.
            try {
                const jsonObject = JSON.parse(partialJson);
                yield jsonObject;  // Yield the complete JSON object
                partialJson = "";   // Reset for the next object
            } catch (jsonError) {
                // JSON parsing failed, likely due to a partial object.  Do nothing, wait for the next chunk.
                // You could optionally log this error to see what kind of partial data you are receiving
                console.debug("Partial JSON received, waiting for more data");s
            }
        }

        // Handle any remaining partial JSON after the loop finishes (if any).
        if (partialJson) {
            try {
              const finalJsonObject = JSON.parse(partialJson);
              yield finalJsonObject;
            } catch (finalJsonError) {
              console.error("Error parsing final JSON:", finalJsonError, partialJson);
            }
        }
    } catch (error) {
        console.error(`Error reading stream: ${error.message}`);
    } finally {
        reader.releaseLock();
    }
}




let debugReaction = new DrasiReaction(onChangeEvent, {
  onControlEvent: onControlEvent,
});
  
async function onChangeEvent(event) {
  const queryId = event.queryId;
  console.log(`Received change sequence: ${event.sequence} for query ${queryId}`);
  console.log(`evt: ${JSON.stringify(event)}`);

  console.log(`clients: ${Array.from(clients.keys())}`);
  if (clients.has(queryId)) {
    let queryResult = queryResults.get(queryId);
    if (!queryResult) {
      queryResult = new Set();
      queryResults.set(queryId, queryResult);
    }
    for (let added of event.addedResults) {
      queryResult.add(added);
    }
    
    for (let deleted of event.deletedResults) {
      queryResult.delete(deleted);
    }

    // updatedResult = []
    for (let updated of event.updatedResults) {
      queryResult.delete(updated.before);
      queryResult.add(updated.after);
      // const groupingKeys = updated['grouping_keys'];
      // queryResult.update(updated.before, updated.after, groupingKeys);
    }

    console.log(`Query result for query ${queryId}: ${JSON.stringify(queryResult)}`);
    console.log(`clients for query ${queryId}: ${clients.get(queryId)}`);
    // update the query result
    for (let client of clients.get(queryId)) {
      client.send(JSON.stringify({
        queryId: queryId,
        data: [...queryResult] // Send the updated query result or relevant change
      }));
    }
  }
}


async function onControlEvent(event) {
  const queryId = event.queryId;
  console.log(`Received control event for query ${queryId}`);

  let queryResult = new Set();

  queryResults.add(event);

  queryResults.set(queryId, queryResult);

  // send via websocket
  for (let client of clients.get(queryId)) {
    client.send(JSON.stringify({
      queryId: queryId,
      data: event // Send the updated query result or relevant change
    }));
  }
}  
server.on('upgrade', (request, socket, head) => {
  // Check if the request path is '/ws/'
  const { pathname } = url.parse(request.url);
  if (pathname === '/ws/') {
      wss.handleUpgrade(request, socket, head, (ws) => {
          wss.emit('connection', ws, request);
      });
  } else {
      socket.destroy(); // Reject the connection if it's not to '/ws/'
  }
});
debugReaction.start();

// Fake updater that updates a random value to the websocket every five seconds
// setInterval(() => {
//   clients.forEach((sockets, queryId) => {
//     const randomValue = Math.random();
//     const message = JSON.stringify({
//       queryId: queryId,
//       data: `Random value: ${randomValue}`
//     });

//     sockets.forEach((ws) => {
//       if (ws.readyState === WebSocket.OPEN) {
//         ws.send(message);
//       }
//     });
//   });
// }, 5000);
server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

// const app = express();
// const port = 3001;
// const server = http.createServer(app);
// const wss = new WebSocket.Server({ server, path: "/ws" });

// // Maintain a map of WebSocket clients
// const clients = new Map();

// // Maintain a map of query results
// const queryResults = new Map();

// app.use(cors());
// const queriesDirectory = config.has('QueryConfigPath') ? config.get('QueryConfigPath') : "/etc/queries";


// wss.on("connection", (ws, req) => {
//   const { queryId } = url.parse(req.url, true).query;
//   // const queryId = urlParams.get("queryId");
//   console.log(`Received WebSocket connection for query: ${queryId}`);
//   if (!queryId) {
//     ws.close(4001, "Missing queryId");
//     return;
//   }

//   console.log(`WebSocket connected for query: ${queryId}`);

//   // Store WebSocket client
//   clients.set(queryId, ws);

//   // Send initial data
//   const initialData = getQueryResult(queryId);
//   ws.send(JSON.stringify({ queryId, data: initialData }));

//   ws.on("close", () => {
//     console.log(`WebSocket disconnected for query: ${queryId}`);
//     clients.delete(queryId);
//   });

//   ws.on("error", (error) => {
//     console.error(`WebSocket error for query ${queryId}:`, error);
//   });
// });

// // wss.on("connection", (ws, req) => {
// //   const { queryId } = url.parse(req.url, true).query;
// //     if (queryId) {
// //         clients.set(queryId, ws);
// //     }

// //     ws.on("close", () => {
// //         clients.delete(queryId);
// //     });

// // });



// let debugReaction = new DrasiReaction(onChangeEvent, {
//   onControlEvent: onControlEvent,
// });


// async function onChangeEvent(event) {
//   const queryId = event.queryId;
//   console.log(`Received change sequence: ${event.sequence} for query ${queryId}`);
//   console.log(`evt: ${JSON.stringify(event)}`);

//   if (clients.has(queryId)) {
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
//   const queryId = event.queryId;
//   console.log(`Received control event for query ${queryId}`);


//   ws.send(JSON.stringify({
//     queryId: queryId,
//     data: event // Send the updated query result or relevant change
//   }));

// }




// app.get('/query/:query_id', (req, res) => {
//   const queryId = req.params.query_id;
//   console.log(`Received request for query ${queryId}`);
//   // Assuming you have a function getQueryResult that takes a queryId and returns the result
//   const result = getQueryResult(queryId);
//   res.json(result);
// });





// function getQueryResult(queryId) {
//   // Placeholder function to simulate query result retrieval
//   // Replace this with actual logic to retrieve the query result
//   return { queryId: queryId, result: "Sample result for query " + queryId };
// }

// server.listen(port, () => {
//   console.log(`Server is running on http://localhost:${port}`);
// });
// debugReaction.start();