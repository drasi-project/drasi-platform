require("dotenv").config();

const fs = require('fs');
const dapr = require("@dapr/dapr");

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const createError = require('http-errors');

const pubSubName = process.env["PUBSUB"] ?? "rg-pubsub";
const port = parseInt(process.env["PORT"] ?? "4001");
const sourceId = process.env["SOURCE_ID"];

const daprClient = new dapr.DaprClient();

async function main() {
  const app = express();
  app.use(cors());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());

  // Query Subscription
  app.post('/subscription', async (req, res, next) => {
    try {
      const subscriptionInput = req.body;
      console.debug(`queryApi.main/subscription - Creating new subscription for queryId:${subscriptionInput.queryId}`);

      const controlEvent = {
        op: "i",
        ts_ms: Date.now(),
        payload: {
          source: { db: "ReactiveGraph", table: "SourceSubscription" },
          before: null,
          after: {
            queryId: subscriptionInput.queryId,
            queryNodeId: subscriptionInput.queryNodeId,
            nodeLabels: subscriptionInput.nodeLabels,
            relLabels: subscriptionInput.relLabels
          }
        }
      };

      await daprClient.pubsub.publish(pubSubName, sourceId + "-change", [controlEvent]);

      // Query DB and send initial results to query node
      console.debug(`queryApi.main/subscription - queryId: ${subscriptionInput.queryId} - fetching nodeLabels:${JSON.stringify(subscriptionInput.nodeLabels)}, relLabels:${JSON.stringify(subscriptionInput.relLabels)}`);

      let initData = await daprClient.invoker.invoke(`${sourceId}-proxy`, "acquire", dapr.HttpMethod.POST, {
        queryId: subscriptionInput.queryId,
        queryNodeId: subscriptionInput.queryNodeId,
        nodeLabels: subscriptionInput.nodeLabels,
        relLabels: subscriptionInput.relLabels
      });

      console.info(`queryApi.main/subscription - queryId: ${subscriptionInput.queryId} - loaded nodes:${initData.nodes.length}, relations:${initData.rels.length}.`)
      res.status(200).json(initData);
    } catch (err) {
      next(err);
    }
  });

  app.listen(port, () => console.log(`queryApi.main - Reactive Graph Source Node Query API listening on port:${port}`));
}

main().catch((error) => {
  console.error("queryApi.main - Error:", error.stack);
  fs.writeFileSync("/dev/termination-log", error.message);
  process.exit(1);
});