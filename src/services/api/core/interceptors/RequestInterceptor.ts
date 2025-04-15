// services/api/core/interceptors/RequestInterceptor.ts
import { AxiosInstance, AxiosHeaders } from 'axios';
import { createApiHeaders } from '../utils/headers.utils';
import { emitter } from '../events';

export class RequestInterceptor {
  public static apply(axiosInstance: AxiosInstance, getToken: () => Promise<string | null>): void {
    axiosInstance.interceptors.request.use(
      async (config) => {
        emitter.emit('loading:start'); // Emit start loading event

        try {
          const headers = await createApiHeaders(getToken, config.data);
          const axiosHeaders = new AxiosHeaders(config.headers || {});

          Object.entries(headers).forEach(([key, value]) => {
            if (!axiosHeaders.has(key)) {
              axiosHeaders.set(key, value);
            }
          });

          config.headers = axiosHeaders;
          console.log('Request Headers:', config.headers); // Log the headers for debugging
          return config;
        } catch (error) {
          console.error('Error in request interceptor:', error);
          return config;
        }
      },
      (error) => {
        emitter.emit('loading:end'); // Also end loading on error
        return Promise.reject(error);
      }
    );
  }
}
