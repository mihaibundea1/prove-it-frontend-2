// services/api/apiClient.ts
import axios, { AxiosInstance } from "axios";
import { useState, useEffect } from "react"; 
import { useAuth } from "../../hooks/auth/useAuth";
import { API_CONFIG } from './config';

export const useAuthenticatedApi = () => {
  const { token, isAuthenticated } = useAuth();
  const [api, setApi] = useState<AxiosInstance | null>(null);

  useEffect(() => {
    if (token) {
      const instance = axios.create({
        ...API_CONFIG,  // Folosim configurația de bază
        headers: {
          ...API_CONFIG.headers,  // Păstrăm header-ele existente
          Authorization: `Bearer ${token}`, // Adăugăm token-ul
        },
      });
      setApi(instance);
    } else {
      setApi(null);
    }
  }, [token]);

  const makeRequest = async <T>(
    method: "get" | "post" | "put" | "delete",
    endpoint: string,
    data?: any
  ): Promise<T | null> => {
    if (!api || !isAuthenticated) return null;

    try {
      const response = await api({
        method,
        url: endpoint,
        data,
      });
      return response.data;
    } catch (error) {
      console.error("API request failed:", error);
      throw error;
    }
  };

  return {
    get: <T>(endpoint: string) => makeRequest<T>("get", endpoint),
    post: <T>(endpoint: string, data: any) => 
      makeRequest<T>("post", endpoint, data),
    put: <T>(endpoint: string, data: any) => 
      makeRequest<T>("put", endpoint, data),
    delete: <T>(endpoint: string) => makeRequest<T>("delete", endpoint),
    isAuthenticated,
  };
};