import { BaseApiService } from "../../core/BaseApiService";
import {
  WorkoutSpecifications,
  WorkoutResponse,
} from "./types/gemini.types";
import { ApiResponse } from "../../core/types/api.types";
import { GEMINI_ENDPOINTS } from "./constants/gemini.endpoints";

export class GeminiService extends BaseApiService {
  constructor(getToken?: () => Promise<string | null>) {
    super(GEMINI_ENDPOINTS.BASE, getToken ?? (() => Promise.resolve(null)));
  }

  async generateAIWorkout(
    specs: WorkoutSpecifications
  ): Promise<ApiResponse<WorkoutResponse>> {
    try {
      const response = await this.post<WorkoutResponse>(
        GEMINI_ENDPOINTS.GENERATE_WORKOUT,
        specs
      );
      return this.handleResponse(response);
    } catch (error) {
      return this.handleError(error);
    }
  }

  private handleResponse<T>(response: any): ApiResponse<T> {
    if (response.error) {
      return {
        data: null,
        error: response.error,
        status: response.status || 400,
      };
    }
    return {
      data: response.data,
      error: undefined,
      status: response.status || 200,
    };
  }

  private handleError(error: unknown): ApiResponse<never> {
    const errorMessage =
      error instanceof Error
        ? error.message
        : "Failed to process workout request";
    return {
      data: null,
      error: errorMessage,
      status: 500,
    };
  }
}
