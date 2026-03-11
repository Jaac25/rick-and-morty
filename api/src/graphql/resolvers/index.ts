import { characterResolver } from "./character.resolver";

export const resolvers = {
  Query: {
    characters: characterResolver.characters,
  },
};
