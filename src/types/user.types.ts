// src/types/user.types.ts
export interface UserCredentials {
    _id: string;
    // add other credential fields
  }
  
  export interface UserInfo {
    // define user information fields
  }
  
  export interface UserContextValue {
    userCredentials: UserCredentials | null;
    userInfo: UserInfo | null;
    setUserCredentials: (credentials: UserCredentials | null) => void;
    setUserInfo: (info: UserInfo | null) => void;
    fetchUserData: () => Promise<void>;
  }