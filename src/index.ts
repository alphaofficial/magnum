import express, { Request, Response, NextFunction } from 'express';
import { ApolloServer } from 'apollo-server-express';
import { execute, subscribe } from 'graphql';
import { SubscriptionServer } from 'subscriptions-transport-ws';
import {createServer} from 'http'
import cors from 'cors';
import { typeDefs } from './graphql/schema';
import { resolvers } from './graphql/resolvers';
import {DB_CONNECT} from './config'
import pubsub from './pubsub'
import path from 'path'


const config = require("../config.json");
async function startApolloServer() {
  DB_CONNECT()
  
  const PORT = config.PORT
   const app = express();
  app.use(cors({
    origin: ['http://localhost:3000', 'http://localhost:4200']
  }))

  const server = new ApolloServer({ typeDefs, resolvers, context: {pubsub} });
  await server.start();
  server.applyMiddleware({app})

  if(config.ENVIRONMENT === "production") {
    app.use(express.static(path.join(__dirname, '../client', 'build')));
    app.use(async (req: Request, res: Response, next: NextFunction) => {
      res.sendFile(path.resolve(__dirname, '../client', 'build', 'index.html'));
    })
  }

  const httpServer = createServer(app);
  server.installSubscriptionHandlers(httpServer);

  // Make sure to call listen on httpServer, NOT on app.
  await new Promise(() => httpServer.listen(PORT));
  console.log(`🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`);
  console.log(`🚀 Subscriptions ready at ws://localhost:${PORT}${server.subscriptionsPath}`);
  return { server, app, httpServer };

}

startApolloServer()