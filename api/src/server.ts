import { ApolloServer } from "@apollo/server";
import cors from "cors";
import express from "express";

import { expressMiddleware } from "@as-integrations/express5";
import { resolvers } from "./graphql/resolvers";
import { typeDefs } from "./graphql/schema";

import { sequelize } from "./config/database";
import { connectRedis, redis } from "./config/redis";
import { seedCharacters } from "./seeds/character.seed";

const startServer = async () => {
  const app = express();

  const server = new ApolloServer({
    typeDefs,
    resolvers,
  });

  await server.start();

  await sequelize.sync();

  await seedCharacters();

  await connectRedis();

  app.get("/", (_, res) => {
    res.send("GraphQL API running!");
  });

  app.use(
    "/graphql",
    cors(),
    express.json(),
    expressMiddleware(server, {
      context: async ({ req }) => ({
        redis,
        db: sequelize,
      }),
    }),
  );

  app.listen(4000, () => {
    console.log("🚀 Server ready at http://localhost:4000/graphql");
  });
};

startServer();
