// services/api/endpoints/exercise/constants/cache.constants.ts
export const CACHE_CONSTANTS = {
    EXERCISE_KEY: 'cached_exercises',
    EXPIRY_TIME: 24 * 60 * 60 * 1000, // 24 ore
  } as const;