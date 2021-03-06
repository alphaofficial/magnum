import express, { Request, Response, NextFunction } from 'express';
import { ApolloServer } from 'apollo-server-express';
//import { execute, subscribe } from 'graphql';
//import { SubscriptionServer } from 'subscriptions-transport-ws';
import {createServer} from 'http'
import cors from 'cors';
import { typeDefs } from './graphql/schema';
import { resolvers } from './graphql/resolvers';
import {DB_CONNECT} from './config'
import pubsub from './pubsub'
import path from 'path'
import {config as dotenvConfig} from 'dotenv'
import chalk from 'chalk'

//const config = require("../config.json");
dotenvConfig()
async function startApolloServer() {  
  const PORT = process.env.PORT
   const app = express();
  app.use(cors({
    origin: "*"
  }))

  const server = new ApolloServer({ typeDefs, resolvers, context: {pubsub} });
  await server.start();
  server.applyMiddleware({app})

  if(process.env.NODE_ENV==='production') {
    app.use(express.static(path.join(__dirname, '../client', 'build')));
    app.get("/", (req, res) => {
      res.sendFile(path.resolve(__dirname, '../client', 'build', 'index.html'));
    })
  }

  const httpServer = createServer(app);
  server.installSubscriptionHandlers(httpServer);


  httpServer.listen(PORT)
 
  if (process.env.NODE_ENV==='production') {
    console.log(chalk.yellow(`🚀 Client ready at http://localhost:${PORT}`))
  }
  console.log(chalk.cyan(`🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`))
  console.log(chalk.cyan(`🚀 Subscriptions ready at ws://localhost:${PORT}${server.subscriptionsPath}`))
  return { server, app, httpServer };

}

DB_CONNECT()
startApolloServer()