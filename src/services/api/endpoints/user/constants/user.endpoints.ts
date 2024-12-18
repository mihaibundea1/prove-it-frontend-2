// services/api/endpoints/user/constants/user.endpoints.ts
export const USER_ENDPOINTS = {
    BASE: '/users',
    REGISTER: '/users/register',
    PROFILE: (userId: string) => `/users/${userId}`,
    UPDATE: (userId: string) => `/users/${userId}`,
  } as const;
  