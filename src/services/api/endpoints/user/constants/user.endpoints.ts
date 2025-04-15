// services/api/endpoints/user/constants/user.endpoints.ts
export const USER_ENDPOINTS = {
    BASE: '/users',
    REGISTER: '/register',
    PROFILE_BY_ID: (_id: string) => `/?_id=${_id}`,
    PROFILE_BY_CLERK_ID: (clerkId: string) => `/profile/${clerkId}`, // THIS FOR /USERS/PROFILE/CLERKID
    //PROFILE_BY_CLERK_ID: (clerkId: string) => `/?clerk_id=${clerkId}`, // THIS FOR /USERS/CLERKID
    UPDATE_USER: '/update',

    UPDATE: (userId: string) => `/${userId}`,
    FOLLOW: (userId: string) => `/follow/${userId}`,
    UNFOLLOW: (userId: string) => `/unfollow/${userId}`,
    CREATE_GOAL: (_id: string) => `/${_id}/goals`,

    GET_ALL_GOALS: (userId: string) => `/${userId}/goals`,
    GET_SINGLE_GOAL: (userId: string, goalId: string) => `/${userId}/goals/${goalId}`,
    UPDATE_GOAL: (userId: string, goalId: string) => `/${userId}/goals/${goalId}`,
    DELETE_GOAL: (userId: string, goalId: string) => `/${userId}/goals/${goalId}`,
    INCREMENT_GOAL_PROGRESS: (userId: string, goalId: string) => `/${userId}/goals/${goalId}/progress`,

    CHECK_ACHIEVEMENTS: (userId: string) => `/check-achievements/${userId}`,

    SEARCH_USERS: (query: string, limit: number = 10) => `/search/${query}?limit=${Math.min(limit, 50)}`,


  } as const;
  