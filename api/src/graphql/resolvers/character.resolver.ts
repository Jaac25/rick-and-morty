import { CacheService } from "../../services/cache.service";
import { CharacterService, IFilters } from "../../services/character.service";

export const characterResolver = {
  characters: async (_: any, args: IFilters, { redis }: { redis: any }) => {
    try {
      const serviceRedis = new CacheService(redis);
      const serviceCharacters = new CharacterService();
      const cacheKey = `characters:${JSON.stringify(args)}`;
      const cached = await serviceRedis.getCache(cacheKey);
      if (cached) {
        console.log("CACHE FOUND");
        return JSON.parse(cached);
      }
      console.log("CACHE MISS");
      const characters = await serviceCharacters.findCharacters(args);
      await serviceRedis.setCache(cacheKey, characters);
      return characters;
    } catch (error) {
      console.error(error);
      throw new Error("Error fetching characters");
    }
  },

  toggleFavorite: async (
    _: any,
    { id, isFavorite }: { id: string; isFavorite: boolean },
    { redis }: { redis: any },
  ) => {
    try {
      const serviceCharacters = new CharacterService();
      const serviceRedis = new CacheService(redis);
      const wasEdited = await serviceCharacters.updateCharacter(
        { isFavorite },
        id,
      );
      if (wasEdited) await serviceRedis.clearKeysByPrefix("characters");
      return wasEdited;
    } catch (error) {
      console.error(error);
      throw new Error("Error updating favorite status");
    }
  },

  deleteCharacter: async (
    _: any,
    { id }: { id: string },
    { redis }: { redis: any },
  ) => {
    try {
      const serviceCharacters = new CharacterService();
      const serviceRedis = new CacheService(redis);
      const wasDeleted = await serviceCharacters.deleteCharacter(id);
      if (wasDeleted) await serviceRedis.clearKeysByPrefix("characters");
      return wasDeleted;
    } catch (error) {
      console.error(error);
      throw new Error("Error deleting character");
    }
  },
};
