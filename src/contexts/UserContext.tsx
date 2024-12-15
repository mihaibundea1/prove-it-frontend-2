import React, { createContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { UserContextType, UserCredentials, UserInfo } from '../types/user.types';
import { userAPI } from '../services/api/user.api';
import { userUtils } from '../utils/user.utils';

const UserContext = createContext<UserContextType | undefined>(undefined);

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [userCredentials, setUserCredentials] = useState<UserCredentials | null>(() => 
    userUtils.getStoredUserCredentials()
  );
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSetUserCredentials = useCallback((credentials: UserCredentials | null) => {
    setUserCredentials(credentials);
    userUtils.persistUserCredentials(credentials);
  }, []);

  const fetchUserData = useCallback(async (): Promise<void> => {
    if (!userCredentials?._id) return;

    setIsLoading(true);
    setError(null);

    try {
      const data = await userAPI.fetchUserInfo(userCredentials._id);
      setUserInfo(userUtils.formatUserInfo(data));
    } catch (error) {
      const message = error instanceof Error ? error.message : 'An unexpected error occurred';
      setError(message);
      setUserInfo(null);
    } finally {
      setIsLoading(false);
    }
  }, [userCredentials]);

  const logout = useCallback((): void => {
    handleSetUserCredentials(null);
    setUserInfo(null);
    setError(null);
  }, [handleSetUserCredentials]);

  useEffect(() => {
    if (userCredentials && !userInfo) {
      fetchUserData();
    }
  }, [userCredentials, userInfo, fetchUserData]);

  const value: UserContextType = {
    // State
    userCredentials,
    userInfo,
    isLoading,
    error,
    // Actions
    setUserCredentials: handleSetUserCredentials,
    setUserInfo,
    fetchUserData,
    logout
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};

export default UserContext;