import { Sequelize } from "sequelize";

export const sequelize = new Sequelize(
  process.env.POSTGRES_NAME || "rickmorty",
  process.env.POSTGRES_USER || "postgres",
  process.env.POSTGRES_PASSWORD || "postgres",
  {
    host: process.env.POSTGRES_HOST || "localhost",
    dialect: "postgres",
    logging: false,
  },
);
