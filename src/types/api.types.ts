// types/api.types.ts
import { AxiosError } from 'axios';

export interface ApiResponse<T> {
  data: T | null;
  error?: string;
  status: number;
  headers?: Record<string, string>;
}

export interface CustomAxiosError extends AxiosError {
  code?: string;
}

export class CustomError extends Error {
  code: string;
  
  constructor(message: string, code: string) {
    super(message);
    this.code = code;
  }
}