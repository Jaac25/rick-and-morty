import "dotenv/config";
import { ApolloServer } from "@apollo/server";
import cors from "cors";
import express from "express";

import { expressMiddleware } from "@as-integrations/express5";
import { resolvers } from "./graphql/resolvers";
import { typeDefs } from "./graphql/schema";

import { connectRedis, redis } from "./config/redis";
import { seedCharacters } from "./seeders/character.seed";
import { sequelize } from "./config/database";
import { startCharacterCron } from "./cron/character.cron";

const startServer = async () => {
  const app = express();

  const server = new ApolloServer({
    typeDefs,
    resolvers,
  });

  await server.start();

  await sequelize.authenticate();

  await connectRedis();

  await seedCharacters();

  startCharacterCron();

  app.get("/", (_, res) => {
    res.send("GraphQL API running!");
  });

  app.use((req, res, next) => {
    console.log({
      method: req.method,
      url: req.url,
      date: new Date(),
    });

    next();
  });

  app.use(
    "/graphql",
    cors(),
    express.json(),
    expressMiddleware(server, {
      context: async ({ req }) => ({
        redis,
      }),
    }),
  );

  app.listen(process.env.PORT, () => {
    console.log(
      `🚀 Server ready at http://localhost:${process.env.PORT}/graphql`,
    );
  });
};

startServer();
