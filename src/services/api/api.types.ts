export interface ApiResponse<T> {
  data: T | null;
  error?: string;
  status: number;
}

export interface ApiError {
  message: string;
  status?: number;
  code?: string;
}

export type ApiHandler = <T>(request: Promise<any>) => Promise<ApiResponse<T>>;

export interface ApiMethods {
  get: <T>(endpoint: string) => Promise<ApiResponse<T>>;
  post: <T>(endpoint: string, data?: any) => Promise<ApiResponse<T>>;
  put: <T>(endpoint: string, data?: any) => Promise<ApiResponse<T>>;
  patch: <T>(endpoint: string, data?: any) => Promise<ApiResponse<T>>;
  delete: <T>(endpoint: string) => Promise<ApiResponse<T>>;
}

export interface CustomAxiosError extends Error {
  response?: {
    data?: {
      message?: string;
    };
    status?: number;
  };
  code?: string;
}