# Rick and Morty

# API

This project implements a GraphQL API that fetches, stores, and serves character data from the Rick and Morty API.

The application is built with Node.js, Express, GraphQL, PostgreSQL, Redis, and Docker.

---

## Architecture

The API follows a layered architecture:

Resolvers → Services → Database

GraphQL resolvers handle incoming queries and delegate business logic to services.

Services interact with the database using Sequelize ORM.

Redis is used as a caching layer to improve performance.

---

## Technologies

- Node.js
- GraphQL
- Apollo Server
- Express
- PostgreSQL
- Sequelize
- Redis
- Docker
- TypeScript
- node-cron

---

## Features

- GraphQL API for querying characters
- Redis caching for optimized query performance
- PostgreSQL database persistence
- Automatic seeding of characters from Rick and Morty API
- Scheduled updates using a cron job every 12 hours
- Execution time logging using a custom method decorator

---

## Design Patterns

The project implements several software design patterns:

### Repository Pattern

Services abstract database access and act as repositories between resolvers and the database.

### Singleton Pattern

The Redis client is implemented as a singleton to ensure a single connection across the application.

### Dependency Injection

GraphQL context provides dependencies (such as Redis) to resolvers.

### Decorator Pattern

A custom method decorator measures execution time for database queries.

---

## Project Structure

# FRONT

use debounce
documentación para peticiones
lista de comentarios por personaje
Mensaje para validar el borrado
Filtro por favoritos
Toast
