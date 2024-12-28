// import React, { createContext, useState, useEffect, useCallback, ReactNode } from 'react';
// import { useUser as useClerkUser } from '@clerk/clerk-expo';
// import { UserContextType, User } from '../types/user.types';
// import { userAPI } from '../services/api/user.api';
// import { userUtils } from '../utils/user.utils';

// const UserContext = createContext<UserContextType | undefined>(undefined);

// interface UserProviderProps {
//   children: ReactNode;
// }

// export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
//   const { user: clerkUser } = useClerkUser();
//   const [user, setUser] = useState<User | null>(() => null);
//   const [isLoading, setIsLoading] = useState<boolean>(false);
//   const [error, setError] = useState<string | null>(null);

//   const refreshUser = useCallback(async (): Promise<void> => {
//     if (!clerkUser?.id) return;

//     setIsLoading(true);
//     setError(null);

//     try {
//       const data = await userAPI.fetchUserProfile(clerkUser.id);
//       const formattedData = userUtils.formatUserData(data);
//       setUser(formattedData);
//       await userUtils.persistUserData(formattedData);
//     } catch (error) {
//       const message = error instanceof Error ? error.message : 'An unexpected error occurred';
//       setError(message);
//       setUser(null);
//     } finally {
//       setIsLoading(false);
//     }
//   }, [clerkUser]);

//   const updateProfile = useCallback(async (updates: Partial<User>): Promise<void> => {
//     if (!clerkUser?.id) return;

//     setIsLoading(true);
//     setError(null);

//     try {
//       const { user: updatedUser } = await userAPI.updateProfile(clerkUser.id, updates);
//       const formattedData = userUtils.formatUserData(updatedUser);
//       setUser(formattedData);
//       await userUtils.persistUserData(formattedData);
//     } catch (error) {
//       const message = error instanceof Error ? error.message : 'An unexpected error occurred';
//       setError(message);
//     } finally {
//       setIsLoading(false);
//     }
//   }, [clerkUser]);

//   // Sincronizează datele când se schimbă utilizatorul Clerk
//   useEffect(() => {
//     if (clerkUser) {
//       refreshUser();
//     } else {
//       setUser(null);
//       userUtils.persistUserData(null);
//     }
//   }, [clerkUser, refreshUser]);

//   // Încearcă să încarce datele salvate local la pornire
//   useEffect(() => {
//     const loadStoredData = async () => {
//       const storedUser = await userUtils.getStoredUserData();
//       if (storedUser) {
//         setUser(storedUser);
//       }
//     };

//     loadStoredData();
//   }, []);

//   const value: UserContextType = {
//     // State
//     user,
//     isLoading,
//     error,
//     // Actions
//     refreshUser,
//     updateProfile
//   };

//   return (
//     <UserContext.Provider value={value}>
//       {children}
//     </UserContext.Provider>
//   );
// };

// export default UserContext;