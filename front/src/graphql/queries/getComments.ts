import { gql } from "@apollo/client";

export const GET_COMMENTS = gql`
  query GetComments($characterId: ID!) {
    comments(characterId: $characterId) {
      id
      comment
      characterId
    }
  }
`;
