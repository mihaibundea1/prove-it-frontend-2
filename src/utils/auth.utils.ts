// src/utils/auth.utils.ts
import { useAuth } from "@clerk/clerk-react";

export const getAuthHeader = async () => {
  const { getToken } = useAuth();
  const token = await getToken();
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };
};