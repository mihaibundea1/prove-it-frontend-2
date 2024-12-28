// services/api/endpoints/exercise/types/cache.types.ts
export interface CachedData<T> {
    data: T;
    timestamp: number;
  }