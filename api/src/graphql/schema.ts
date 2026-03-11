import { gql } from "graphql-tag";

export const typeDefs = gql`
  type Character {
    id: ID!
    name: String!
    status: String
    species: String
    gender: String
    image: String
  }

  type Query {
    characters(
      name: String
      status: String
      species: String
      gender: String
      origin: String
    ): [Character]
  }
`;
