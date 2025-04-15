// services/api/core/utils/headers.utils.ts
import { RawAxiosRequestHeaders } from 'axios';

export const createApiHeaders = async (
  getToken: () => Promise<string | null>,
  config: any
): Promise<RawAxiosRequestHeaders> => {
  try {
    const token = await getToken();
    const headers: RawAxiosRequestHeaders = {
      'Authorization': token ? `Bearer ${token}` : '',
      'Accept': 'application/json',
    };

    // Auto-detect content type
    if (config instanceof FormData) {
      headers['Content-Type'] = 'multipart/form-data';
    } else {
      headers['Content-Type'] = 'application/json';
    }

    return headers;
  } catch (error) {
    console.error('Error getting API headers:', error);
    return {
      'Accept': 'application/json',
      'Content-Type': config instanceof FormData 
        ? 'multipart/form-data' 
        : 'application/json',
    };
  }
};
