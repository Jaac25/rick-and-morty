import { gql } from "graphql-tag";

export const typeDefs = gql`
  type Character {
    id: ID!
    name: String!
    status: String
    species: String
    gender: String
    image: String
    origin: String
    isFavorite: Boolean
  }

  type Comment {
    id: ID!
    characterId: ID!
    comment: String!
    createdAt: String
  }

  type Query {
    characters(
      name: String
      status: String
      species: String
      gender: String
      origin: String
      isFavorite: Boolean
      orderBy: String
      order: String
    ): [Character]
    comments(characterId: ID!): [Comment]
  }

  type Mutation {
    toggleFavorite(id: ID!, isFavorite: Boolean!): Boolean

    addComment(characterId: ID!, comment: String!): Comment

    deleteCharacter(id: ID!): Boolean
  }
`;
