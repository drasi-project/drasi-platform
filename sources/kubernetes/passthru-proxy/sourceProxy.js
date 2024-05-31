require("dotenv").config();

const fs = require('fs');
const dapr =  require("@dapr/dapr");

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const port = parseInt(process.env["PORT"] ?? "4002");
const sourceId = process.env["SOURCE_ID"];
const daprClient = new dapr.DaprClient();

async function main() {
  const app = express();
  app.use(cors());
  app.use(bodyParser.urlencoded( { extended: false }));
  app.use(bodyParser.json());

  app.post('/acquire', async (req, res, next) => {
    try {
      const input = req.body;
      console.debug(`sourceProxy.main/subscription - Acquiring initial data for queryId:${input.queryId}`);

      let initData = await daprClient.invoker.invoke(`${sourceId}-reactivator`, "acquire", dapr.HttpMethod.POST, input);

      console.info(`sourceProxy.main/acquire - queryId: ${input.queryId} - loaded nodes:${initData.nodes.length}, relations:${initData.rels.length}.`)
      res.status(200).json(initData);
    } catch (err) {
      next(err);
    }
  });

  app.listen(port, () => console.log(`sourceProxy.main - Reactive Graph Source Node Proxy listening on port:${port}`));
}

main().catch((error) => {
  console.error("sourceProxy.main - Error:", error.stack);
  fs.writeFileSync("/dev/termination-log", error.message);
  process.exit(1);
});