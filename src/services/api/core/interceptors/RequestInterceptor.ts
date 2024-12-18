// services/api/core/interceptors/RequestInterceptor.ts
import { AxiosInstance, AxiosHeaders } from 'axios';
import { createApiHeaders } from '../utils/headers.utils';
import { useAuth } from '@clerk/clerk-expo';

export class RequestInterceptor {
  public static apply(axiosInstance: AxiosInstance): void {
    const { getToken } = useAuth();

    axiosInstance.interceptors.request.use(
      async (config) => {
        try {
          const headers = await createApiHeaders(getToken);
          // Create new AxiosHeaders instance
          const axiosHeaders = new AxiosHeaders(config.headers || {});
          
          // Add our custom headers
          Object.entries(headers).forEach(([key, value]) => {
            axiosHeaders.set(key, value);
          });

          // Assign the new headers to config
          config.headers = axiosHeaders;
          return config;
        } catch (error) {
          console.error('Error in request interceptor:', error);
          return config;
        }
      },
      (error) => Promise.reject(error)
    );
  }
}