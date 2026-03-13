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

import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Rick & Morty GraphQL API",
      version: "1.0.0",
      description:
        "API built with Express, GraphQL, Sequelize and Redis cache.",
    },
    servers: [
      {
        url: "http://localhost:4000",
      },
    ],
  },
  apis: ["./src/server.ts"],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

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

  app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  /**
   * @swagger
   * /graphql:
   *   post:
   *     summary: GraphQL endpoint
   *     description: Execute GraphQL queries and mutations.
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               query:
   *                 type: string
   *           examples:
   *             getCharacters:
   *               summary: Get characters
   *               value:
   *                 query: |
   *                   query {
   *                     characters(name: "Rick") {
   *                       id
   *                       name
   *                       species
   *                       image
   *                     }
   *                   }
   *             getComments:
   *               summary: Get comments of a character
   *               value:
   *                 query: |
   *                   query {
   *                     comments(characterId: "1") {
   *                       id
   *                       comment
   *                       createdAt
   *                     }
   *                   }
   *             toggleFavorite:
   *               summary: Toggle favorite character
   *               value:
   *                 query: |
   *                   mutation {
   *                     toggleFavorite(id: "1", isFavorite: true)
   *                   }
   *             addComment:
   *               summary: Add comment to character
   *               value:
   *                 query: |
   *                   mutation {
   *                     addComment(characterId: "1", comment: "Great character!") {
   *                       id
   *                       comment
   *                       createdAt
   *                     }
   *                   }
   *             deleteCharacter:
   *               summary: Soft delete character
   *               value:
   *                 query: |
   *                   mutation {
   *                     deleteCharacter(id: "1")
   *                   }
   *     responses:
   *       200:
   *         description: GraphQL response
   */
  app.use(
    "/graphql",
    cors({ origin: "*" }),
    express.json(),
    expressMiddleware(server, {
      context: async () => ({
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
