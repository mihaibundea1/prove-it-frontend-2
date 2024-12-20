// src/utils/api.utils.ts
import { Config } from '@/config/env';
import { AxiosRequestHeaders } from 'axios';

export const API_CONFIG = {
  baseUrl: Config.apiUrl,
  timeout: 10000,
} as const;

export const getApiHeaders = async (
  getToken: () => Promise<string | null>
): Promise<AxiosRequestHeaders> => {
  try {
    const token = await getToken();
    return {
      'Authorization': token ? `Bearer ${token}` : '',
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    } as AxiosRequestHeaders;
  } catch (error) {
    console.error('Error getting API headers:', error);
    return {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    } as AxiosRequestHeaders;
  }
};