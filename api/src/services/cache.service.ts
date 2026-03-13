import { RedisClusterType } from "redis";
import { ExecutionTime } from "../decorators/executionTime";
import { ICharacter } from "../models/character.model";

export class CacheService {
  declare redis: RedisClusterType;

  constructor(redis: RedisClusterType) {
    this.redis = redis;
  }

  @ExecutionTime
  async getCache(key: string) {
    return this.redis.get(key);
  }

  @ExecutionTime
  async setCache(
    key: string,
    value?: ICharacter[] | ICharacter,
    expiration?: number,
  ) {
    return this.redis.set(key, JSON.stringify(value ?? []), {
      EX: expiration ?? 60,
    });
  }

  @ExecutionTime
  async clearKeysByPrefix(prefix: string) {
    const pattern = `${prefix}*`;
    let cursor = 0;
    do {
      const reply = await this.redis.scan(`${cursor}`, {
        MATCH: pattern,
        COUNT: 100,
      });
      cursor = parseInt(reply.cursor);
      const keys = reply.keys;
      for (const key of keys) {
        await this.redis.del(key);
      }
    } while (cursor !== 0);
    console.log("=================cleared cache====================");
  }
}
