import { gql } from "@apollo/client";

export const TOGGLE_FAVORITE = gql`
  mutation ToggleFavorite($id: ID!, $isFavorite: Boolean!) {
    toggleFavorite(id: $id, isFavorite: $isFavorite)
  }
`;
