// src/services/api/config.ts
import { Config } from '@/config/env';

export const API_CONFIG = {
  baseUrl: Config.apiUrl,
  headers: {
    'Content-Type': 'application/json',
  },
} as const;