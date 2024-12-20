// services/api/core/utils/headers.utils.ts
import { RawAxiosRequestHeaders } from 'axios';

export const createApiHeaders = async (
  getToken: () => Promise<string | null>
): Promise<RawAxiosRequestHeaders> => {
  try {
    const token = await getToken();
    return {
      'Authorization': token ? `Bearer ${token}` : '',
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };
  } catch (error) {
    console.error('Error getting API headers:', error);
    return {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };
  }
};