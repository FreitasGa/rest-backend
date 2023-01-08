import Redis from 'ioredis';
import config from 'config';

export interface CacheModule {
  connect(): Promise<void>;
  disconnect(): Promise<void>;
}

export const redis = new Redis({
  lazyConnect: true,
  host: config.get('cache.host'),
  port: config.get('cache.port'),
  password: config.get('cache.password'),
});

export class RedisCacheModule implements CacheModule {
  private readonly client: Redis;

  constructor() {
    this.client = redis;
  }

  async connect(): Promise<void> {
    await this.client.connect();
  }

  async disconnect(): Promise<void> {
    await this.client.quit();
  }
}
