// services/api/endpoints/exercise/constants/exercise.endpoints.ts
export const EXERCISE_ENDPOINTS = {
    BASE: '/exercises',
    ALL: '/all',
    DETAILS: (exerciseId: string) => `/details/${exerciseId}`,
  } as const;