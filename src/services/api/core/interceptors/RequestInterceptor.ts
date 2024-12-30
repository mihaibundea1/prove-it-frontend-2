// services/api/core/interceptors/RequestInterceptor.ts
import { AxiosInstance, AxiosHeaders } from 'axios';
import { createApiHeaders } from '../utils/headers.utils';

export class RequestInterceptor {
  public static apply(axiosInstance: AxiosInstance, getToken: () => Promise<string | null>): void {
    axiosInstance.interceptors.request.use(
      async (config) => {
        try {
          const headers = await createApiHeaders(getToken);
          const axiosHeaders = new AxiosHeaders(config.headers || {});

          Object.entries(headers).forEach(([key, value]) => {
            axiosHeaders.set(key, value);
          });

          config.headers = axiosHeaders;
          console.log(headers);
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