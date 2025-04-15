// services/api/core/interceptors/ResponseInterceptor.ts
import { AxiosInstance, AxiosError } from 'axios';
import { CustomError } from '../types/api.types';
import { emitter } from '../events';

export class ResponseInterceptor {
  public static apply(axiosInstance: AxiosInstance): void {
    axiosInstance.interceptors.response.use(
      (response) => {
        emitter.emit('loading:end'); // Emit end loading event after success
        return response;
      },
      (error: AxiosError) => {
        emitter.emit('loading:end'); // Emit end loading event on error

        if (!error.response) {
          return Promise.reject(
            new CustomError('Please check your internet connection', 'NETWORK_ERROR')
          );
        }

        switch (error.response.status) {
          case 401:
            console.error('Unauthorized access');
            break;
          case 403:
            console.error('Forbidden access');
            break;
        }

        return Promise.reject(error);
      }
    );
  }
}
