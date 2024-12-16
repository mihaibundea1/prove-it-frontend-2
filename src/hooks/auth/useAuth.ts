// hooks/auth/useAuth.ts
import { useAuth as useClerkAuth } from "@clerk/clerk-expo";
import { useEffect, useState } from "react";

export const useAuth = () => {
  const { getToken, isLoaded, isSignedIn } = useClerkAuth();
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const fetchToken = async () => {
      if (isSignedIn) {
        const newToken = await getToken(); // Acest token va fi verificat de backend
        setToken(newToken);
      } else {
        setToken(null);
      }
    };

    void fetchToken();
  }, [isSignedIn, getToken]);

  const getAuthHeaders = async () => {
    const currentToken = await getToken();
    return {
      'Authorization': `Bearer ${currentToken}`, // Acest format corespunde cu ce așteaptă backend-ul
      'Content-Type': 'application/json'
    };
  };

  return {
    token,
    isLoading: !isLoaded,
    isAuthenticated: isSignedIn || false,
    getAuthHeaders,
    getToken // exportăm și getToken pentru cazuri când avem nevoie doar de token
  };
};