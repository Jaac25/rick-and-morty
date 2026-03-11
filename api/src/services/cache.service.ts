import { ExecutionTime } from "../decorators/executionTime";
import { ICharacter } from "../models/character.model";

export class CacheService {
  declare redis: any;

  constructor(redis: any) {
    this.redis = redis;
  }

  @ExecutionTime
  async getCache(key: string) {
    return this.redis.get(key);
  }

  @ExecutionTime
  async setCache(key: string, value?: ICharacter[], expiration?: number) {
    return this.redis.set(key, JSON.stringify(value ?? []), {
      EX: expiration ?? 60,
    });
  }
}
