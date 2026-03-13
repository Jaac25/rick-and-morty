import { gql } from "@apollo/client";

export const GET_CHARACTERS = gql`
  query GetCharacters(
    $name: String
    $status: String
    $species: String
    $gender: String
    $origin: String
    $isFavorite: Boolean
    $order: String
  ) {
    characters(
      name: $name
      status: $status
      species: $species
      gender: $gender
      origin: $origin
      isFavorite: $isFavorite
      order: $order
    ) {
      id
      name
      species
      status
      gender
      image
      origin
      isFavorite
    }
  }
`;

export const GET_CHARACTER = gql`
  query GetCharacter($id: Int!) {
    character(id: $id) {
      id
      name
      species
      status
      gender
      image
      origin
      isFavorite
      comments {
        id
        comment
        createdAt
      }
    }
  }
`;
