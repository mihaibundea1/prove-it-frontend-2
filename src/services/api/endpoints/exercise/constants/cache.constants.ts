// services/api/endpoints/exercise/constants/cache.constants.ts
export const CACHE_CONSTANTS = {
  EXPIRY_TIME: 24 * 60 * 60 * 1000, // 24 hours
  KEYS: {
    ALL_EXERCISES: 'exercises:all',
    EXERCISE_DETAILS: (id: string) => `exercises:details:${id}`,
    SELECTED_EXERCISES: 'exercises:selected'
  }
} as const;