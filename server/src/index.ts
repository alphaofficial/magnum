import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import { execute, subscribe } from 'graphql';
import { SubscriptionServer } from 'subscriptions-transport-ws';
import {createServer} from 'http'
import cors from 'cors';
import { typeDefs } from './graphql/schema';
import { resolvers } from './graphql/resolvers';
import {DB_CONNECT} from './config'
import pubsub from './pubsub'


async function startApolloServer() {
  DB_CONNECT()
  
  const PORT = require("../config.json").PORT
   const app = express();
  app.use(cors({
    origin: ['http://localhost:3000', 'http://localhost:4200']
  }))

  const server = new ApolloServer({ typeDefs, resolvers, context: {pubsub} });
  await server.start();
  server.applyMiddleware({app})

  const httpServer = createServer(app);
  server.installSubscriptionHandlers(httpServer);

  // Make sure to call listen on httpServer, NOT on app.
  await new Promise(() => httpServer.listen(PORT));
  console.log(`🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`);
  console.log(`🚀 Subscriptions ready at ws://localhost:${PORT}${server.subscriptionsPath}`);
  return { server, app, httpServer };

}

startApolloServer()