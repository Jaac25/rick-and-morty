import { Character } from "../../models/character.model";

export const resolvers = {
  Query: {
    characters: async (_: any, args: any, { redis }: { redis: any }) => {
      const cacheKey = `characters:${JSON.stringify(args)}`;

      console.log({ cacheKey });
      const cached = await redis.get(cacheKey);

      if (cached) {
        console.log("CACHE HIT");
        return JSON.parse(cached);
      }

      console.log("CACHE MISS");

      // const filters: any[] = [];
      // const values: any[] = [];
      // let index = 1;

      // Object.entries(args).forEach(([key, value]) => {
      //   if (value) {
      //     filters.push(`${key} ILIKE $${index}`);
      //     values.push(`%${value}%`);
      //     index++;
      //   }
      // });

      console.log({ args });
      const result = await Character.findAll({ where: { ...args } });

      console.log({ result });
      await redis.set(cacheKey, JSON.stringify(result), {
        EX: 60,
      });

      return result;
    },
  },
};
