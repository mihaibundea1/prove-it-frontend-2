// src/services/api/useApi.ts
import axios, { AxiosResponse, AxiosInstance } from 'axios';
import { API_CONFIG, getApiHeaders } from '@/utils/api.utils';
import { ApiResponse, ApiError, ApiHandler, ApiMethods, CustomAxiosError } from '@/types/api.types';
import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '@clerk/clerk-expo';

export const useApi = (): ApiMethods & { isInitialized: boolean } => {
  const [api, setApi] = useState<AxiosInstance | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const { getToken } = useAuth();

  const getHeaders = useCallback(async () => {
    return getApiHeaders(getToken);
  }, [getToken]);

  useEffect(() => {
    const initializeApi = async () => {
      try {
        const instance = axios.create({
          baseURL: API_CONFIG.baseUrl,
          timeout: API_CONFIG.timeout
        });

        instance.interceptors.request.use(async (config) => {
          try {
            const freshHeaders = await getHeaders();
            config.headers = freshHeaders;
            return config;
          } catch (error) {
            console.error('Error getting fresh headers:', error);
            return Promise.reject(error);
          }
        });

        instance.interceptors.response.use(
          (response: AxiosResponse) => response,
          (error: CustomAxiosError) => {
            if (!error.response) {
              throw {
                message: 'Please check your internet connection',
                code: 'NETWORK_ERROR'
              };
            }

            switch (error.response?.status) {
              case 401:
                console.error('Unauthorized access');
                break;
              case 403:
                console.error('Forbidden access');
                break;
              default:
                break;
            }

            throw error;
          }
        );

        setApi(instance);
        setIsInitialized(true);
      } catch (err) {
        console.error('Failed to initialize API:', err);
        setIsInitialized(false);
      }
    };

    initializeApi();
  }, [getHeaders]);

  const handleRequest: ApiHandler = async <T>(
    request: Promise<AxiosResponse>
  ): Promise<ApiResponse<T>> => {
    try {
      const response = await request;
      return {
        data: response.data,
        status: response.status
      };
    } catch (err) {
      const error = err as CustomAxiosError;
      const apiError: ApiError = {
        message: error.response?.data?.message || error.message || 'An error occurred',
        status: error.response?.status,
        code: error.code
      };

      return {
        data: null,
        error: apiError.message,
        status: apiError.status || 500
      };
    }
  };

  const checkApi = () => {
    if (!api || !isInitialized) {
      throw new Error('API not initialized');
    }
    return api;
  };

  return {
    isInitialized,
    get: async <T>(endpoint: string) => {
      const instance = checkApi();
      return handleRequest<T>(instance.get(endpoint));
    },
    post: async <T>(endpoint: string, data?: any) => {
      const instance = checkApi();
      return handleRequest<T>(instance.post(endpoint, data));
    },
    put: async <T>(endpoint: string, data?: any) => {
      const instance = checkApi();
      return handleRequest<T>(instance.put(endpoint, data));
    },
    delete: async <T>(endpoint: string) => {
      const instance = checkApi();
      return handleRequest<T>(instance.delete(endpoint));
    },
    patch: async <T>(endpoint: string, data?: any) => {
      const instance = checkApi();
      return handleRequest<T>(instance.patch(endpoint, data));
    }
  };
};