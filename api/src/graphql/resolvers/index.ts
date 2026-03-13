import { characterResolver } from "./character.resolver";
import { commentResolver } from "./comment.resolver";

export const resolvers = {
  Query: {
    comments: commentResolver.comments,
    characters: characterResolver.characters,
  },
  Mutation: {
    toggleFavorite: characterResolver.toggleFavorite,
    addComment: commentResolver.addComment,
    deleteCharacter: characterResolver.deleteCharacter,
  },
};
