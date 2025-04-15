export const WORKOUT_ENDPOINTS = {
  BASE: '/workouts', // Base endpoint for all workout operations

  // Saved Workouts
  SAVED: {
    BASE: '/saved', // Base endpoint for saved workouts
    CREATE: '/', // POST /workouts/saved/
    GET_ALL: (userId: string) => `/?user_id=${userId}`, // GET /workouts/saved/?user_id=<user_id>
    GET_BY_ID: (workoutId: string) => `/?workout_id=${workoutId}`, // GET /workouts/saved/?workout_id=<workout_id>
    UPDATE: (workoutId: string) => `/${workoutId}`, // PUT /workouts/saved/<workout_id>
    DELETE: (workoutId: string) => `/${workoutId}`, // DELETE /workouts/saved/<workout_id>
  },

  // Scheduled Workouts
  SCHEDULED: {
    BASE: '/scheduled', // Base endpoint for scheduled workouts
    CREATE: '/', // POST /workouts/scheduled/
    GET_ALL: (userId: string) => `/?_id=${userId}`, // GET /workouts/scheduled/?user_id=<user_id>
    GET_BY_ID: (workoutId: string) => `/?workout_id=${workoutId}`, // GET /workouts/scheduled/?workout_id=<workout_id>
    UPDATE: (workoutId: string) => `/${workoutId}`, // PUT /workouts/scheduled/<workout_id>
    DELETE: (workoutId: string) => `/${workoutId}`, // DELETE /workouts/scheduled/<workout_id>
  },

  // Completed Workouts
  COMPLETED: {
    BASE: '/completed', // Base endpoint for completed workouts
    CREATE: '/', // POST /workouts/completed/
    GET_ALL: (userId: string) => `/?user_id=${userId}`, // GET /workouts/completed/?user_id=<user_id>
    GET_BY_ID: (workoutId: string) => `/?workout_id=${workoutId}`, // GET /workouts/completed/?workout_id=<workout_id>
    UPDATE: (workoutId: string) => `/${workoutId}`, // PUT /workouts/completed/<workout_id>
    DELETE: (workoutId: string) => `/${workoutId}`, // DELETE /workouts/completed/<workout_id>
  },
  PREDEFINED: 
  {
    BASE: '/predefined',
  }
} as const;