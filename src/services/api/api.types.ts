// src/services/api/types/api.types.ts
import { AxiosError, AxiosResponse } from 'axios';
import { Config } from '@/config/env';
import { getAuthHeader } from '../../utils/api.utils';

export interface ApiConfigType {
  baseUrl: string;
  getHeaders: () => Promise<{
    Authorization: string;
    'Content-Type': string;
    Accept: string;
  }>;
}

export const API_CONFIG: ApiConfigType = {
  baseUrl: Config.apiUrl,
  getHeaders: getAuthHeader
};

export interface ApiResponse<T = any> {
  data: T | null;
  error?: string;
  status: number;
}

export interface ApiError {
  message: string;
  status?: number;
  code?: string;
}

export type ApiHandler = <T>(request: Promise<AxiosResponse>) => Promise<ApiResponse<T>>;

export interface ApiMethods {
  get: <T>(endpoint: string) => Promise<ApiResponse<T>>;
  post: <T>(endpoint: string, data?: any) => Promise<ApiResponse<T>>;
  put: <T>(endpoint: string, data?: any) => Promise<ApiResponse<T>>;
  delete: <T>(endpoint: string) => Promise<ApiResponse<T>>;
  patch: <T>(endpoint: string, data?: any) => Promise<ApiResponse<T>>;
}

export type CustomAxiosError = AxiosError & {
  response?: {
    data?: {
      message?: string;
    };
    status?: number;
  };
};