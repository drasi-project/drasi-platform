import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import cors from 'cors';
import bodyParser from 'body-parser';
import express from 'express';
import http from 'http';
import { createServer } from 'http';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { WebSocketServer } from 'ws';
import { useServer } from 'graphql-ws/lib/use/ws';
import { PubSub } from 'graphql-subscriptions';
import { DaprServer, DaprClient, ActorProxyBuilder, ActorId, HttpMethod } from "@dapr/dapr";
import { readdirSync, readFileSync } from 'fs';
import path from 'path';

const channel = new PubSub();  // TODO: use prod pubsub library - https://www.apollographql.com/docs/apollo-server/data/subscriptions/#production-pubsub-libraries

const pubSubName = process.env["PUBSUB"] ?? "rg-pubsub";
const configDir = process.env["QueryConfigPath"] ?? "/etc/queries";
//const typeDefs = process.env["GQL_SCHEMA"];

const daprClient = new DaprClient();
class QueryActor {}
const proxyBuilder = new ActorProxyBuilder(QueryActor, daprClient);

async function main() {
  console.info(`Starting GraphQL Reactor`);
  
  const daprServer = new DaprServer("127.0.0.1", 80);

  let resolvers = {
    Query: {},
    Subscription: {}
  };

  let subscriptionRoot = [];
  let queryRoot = [];
  let types = [];
  
  let queryIds = readdirSync(configDir);
  for (let queryId of queryIds) {

    if (!queryId || queryId.startsWith("."))
      continue;

    console.log(`Configuring query ${queryId}`);

    subscriptionRoot.push(`${queryId}Added: ${queryId}`);
    subscriptionRoot.push(`${queryId}Updated: ${queryId}`);
    subscriptionRoot.push(`${queryId}Deleted: ${queryId}`);
    queryRoot.push(`${queryId}: [${queryId}]`);
    
    var queryMetadata = readFileSync(path.join(configDir, queryId), {encoding:'utf8', flag:'r'});
    types.push(queryMetadata);

    resolvers.Query[queryId] = async (parent, args, context, info) => {
      let queryContainer = await getQueryContainer(queryId);
      let data = await daprClient.invoker.invoke(`${queryContainer}-query-api`, `result/${queryId}`, HttpMethod.GET);
      return data;
    };
    
    resolvers.Subscription[`${queryId}Added`] = {
      subscribe: () => channel.asyncIterator([queryId + '_ADDED'])
    };

    resolvers.Subscription[`${queryId}Updated`] = {
      subscribe: () => channel.asyncIterator([queryId + '_UPDATED'])
    };

    resolvers.Subscription[`${queryId}Deleted`] = {
      subscribe: () => channel.asyncIterator([queryId + '_DELETED'])
    };    
    
    await daprServer.pubsub.subscribe(pubSubName, queryId + "-results", async (changeEvent) => {
      if (changeEvent.kind === "change") {
        
        for (let added of changeEvent.addedResults) {
          channel.publish(queryId + '_ADDED', { [queryId + 'Added']: added});
        }

        for (let updated of changeEvent.updatedResults) {
          channel.publish(queryId + '_UPDATED', { [queryId + 'Updated']: updated.after});
        }

        for (let deleted of changeEvent.deletedResults) {
          channel.publish(queryId + '_DELETED', { [queryId + 'Deleted']: deleted});
        }
      }    
    });
  }
  
  await daprServer.start();

  let typeDefs = '';
  for (let type of types) {
    typeDefs += type + '\r\n';
  }
  
  typeDefs += 'type Subscription {\r\n';
  for (let sub of subscriptionRoot) {
    typeDefs += sub + '\r\n';
  }
  typeDefs += '}\r\n';

  typeDefs += 'type Query {\r\n';
  for (let qry of queryRoot) {
    typeDefs += qry + '\r\n';
  }
  typeDefs += '}\r\n';

  const app = express();
  const httpServer = http.createServer(app);

  const wsServer = new WebSocketServer({
    server: httpServer,
    path: '/',
  });

  const schema = makeExecutableSchema({ typeDefs, resolvers });

  const serverCleanup = useServer({ schema }, wsServer);

  const server = new ApolloServer({
    schema,
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }),
      {
        async serverWillStart() {
          return {
            async drainServer() {
              await serverCleanup.dispose();
            },
          };
        },
      },
    ],
  });

  await server.start();

  app.use(
    '/',
    cors(),
    bodyParser.json(),
    expressMiddleware(server, {
      context: async ({ req }) => ({ token: req.headers.token }),
    }),
  );

  await new Promise((resolve) => httpServer.listen({ port: 8080 }, resolve));

  console.log(`Server ready at on port 8080`);    
}

async function getQueryContainer(queryId) {
  let actor = proxyBuilder.build(new ActorId(queryId));
  var resp = await actor.getQueryContainer();
  return resp.result;
}

main().catch((error) => {
  console.error("Error:", error);
});