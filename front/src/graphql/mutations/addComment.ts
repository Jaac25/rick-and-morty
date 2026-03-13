import { gql } from "@apollo/client";

export const ADD_COMMENT = gql`
  mutation AddComment($comment: String!, $characterId: ID!) {
    addComment(comment: $comment, characterId: $characterId) {
      comment
      characterId
    }
  }
`;
