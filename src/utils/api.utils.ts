// src/utils/api.utils.ts
import { Config } from '@/config/env';
import { AxiosRequestHeaders } from 'axios';

export const API_CONFIG = {
  baseUrl: Config.apiUrl,
} as const;

export const getApiHeaders = async (getToken: () => Promise<string | null>): Promise<AxiosRequestHeaders> => {
  const token = await getToken();
  return {
    'Authorization': token ? `Bearer ${token}` : '',
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  } as AxiosRequestHeaders;
};