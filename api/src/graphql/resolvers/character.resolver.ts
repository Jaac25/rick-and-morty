import { CacheService } from "../../services/cache.service";
import { CharacterService, IFilters } from "../../services/character.service";

export const characterResolver = {
  characters: async (_: any, args: IFilters, { redis }: { redis: any }) => {
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
  },
};
