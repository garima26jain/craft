import typeDefs from "./typeDefs/country.typeDef.js";
import resolvers from './resolvers/country.resolver.js'
import express from "express";
import { ApolloServer } from "apollo-server-express";

async function startServer() {
  const app = express();
  const server = new ApolloServer({ typeDefs, resolvers });

  await server.start();
  server.applyMiddleware({ app });

  app.listen({ port: 4000 }, () =>
    console.log(`🚀 Server ready at http://localhost:4000/graphql`)
  );
}

startServer();
