import { BaseApiService } from "../../core/BaseApiService";
import {
  Workout,
  Exercise,
  CompletedWorkout,
  ScheduledWorkout,
  PredefinedWorkout,
} from "./types/workout.types";
import { ApiResponse } from "../../core/types/api.types";
import {
  WORKOUT_ENDPOINTS,
} from "./constants/workout.endpoints";

export class WorkoutService extends BaseApiService {
  constructor(getToken?: () => Promise<string | null>) {
    super(WORKOUT_ENDPOINTS.BASE, getToken ?? (() => Promise.resolve(null)));
  }

    // ==================== Saved Workouts ====================

  /**
   * Create a new saved workout
   */
  async createSavedWorkout(
    workoutData: Omit<Workout, "_id" | "created_at" | "updated_at">
  ): Promise<ApiResponse<Workout>> {
    try {
      console.log("workoutData:", workoutData);
      const response = await this.post<Workout>(
        `${WORKOUT_ENDPOINTS.SAVED.BASE}${WORKOUT_ENDPOINTS.SAVED.CREATE}`,
        workoutData
      );
      return this.handleResponse(response);
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Get all saved workouts for a user
   */
  async getSavedWorkouts(userId: string): Promise<ApiResponse<Workout[]>> {
    try {
      const response = await this.get<Workout[]>(
        `${WORKOUT_ENDPOINTS.SAVED.BASE}${WORKOUT_ENDPOINTS.SAVED.GET_ALL(userId)}`
      );
      return this.handleResponse(response);
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Get a specific saved workout by ID
   */
  async getSavedWorkoutById(workoutId: string): Promise<ApiResponse<Workout>> {
    try {
      const response = await this.get<Workout>(
        `${WORKOUT_ENDPOINTS.SAVED.BASE}${WORKOUT_ENDPOINTS.SAVED.GET_BY_ID(workoutId)}`
      );
      return this.handleResponse(response);
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Update a saved workout
   */
  async updateSavedWorkout(
    workoutId: string,
    updates: Partial<Workout>
  ): Promise<ApiResponse<Workout>> {
    try {
      const response = await this.put<Workout>(
        `${WORKOUT_ENDPOINTS.SAVED.BASE}${WORKOUT_ENDPOINTS.SAVED.UPDATE(workoutId)}`,
        updates
      );
      return this.handleResponse(response);
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Delete a saved workout
   */
  async deleteSavedWorkout(workoutId: string): Promise<ApiResponse<void>> {
    try {
      const response = await this.delete<void>(
        `${WORKOUT_ENDPOINTS.SAVED.BASE}${WORKOUT_ENDPOINTS.SAVED.DELETE(workoutId)}`
      );
      return this.handleResponse(response);
    } catch (error) {
      return this.handleError(error);
    }
  }

  // ==================== Scheduled Workouts ====================

  /**
   * Create a new scheduled workout
   */
  async createScheduledWorkout(
    workoutData: Omit<ScheduledWorkout, "_id" | "created_at" | "updated_at">
  ): Promise<ApiResponse<ScheduledWorkout>> {
    try {
      // Explicitly remove the unwanted fields
      const { _id, created_at, updated_at, ...sanitizedWorkoutData } = workoutData as ScheduledWorkout;
      
      console.log("Sanitized workoutData:", sanitizedWorkoutData); // Debugging
  
      const response = await this.post<ScheduledWorkout>(
        `${WORKOUT_ENDPOINTS.SCHEDULED.BASE}${WORKOUT_ENDPOINTS.SCHEDULED.CREATE}`,
        sanitizedWorkoutData
      );
      return this.handleResponse(response);
    } catch (error) {
      return this.handleError(error);
    }
  }
  
  

  /**
   * Get all scheduled workouts for a user
   */
  async getScheduledWorkouts(user_id: string): Promise<ApiResponse<ScheduledWorkout[]>> {
    try {
      const response = await this.get<ScheduledWorkout[]>(
        `${WORKOUT_ENDPOINTS.SCHEDULED.BASE}${WORKOUT_ENDPOINTS.SCHEDULED.GET_ALL(user_id)}`
      );
      //console.log(response);
      return this.handleResponse(response);
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Get a specific scheduled workout by ID
   */
  async getScheduledWorkoutById(workoutId: string): Promise<ApiResponse<ScheduledWorkout>> {
    try {
      const response = await this.get<ScheduledWorkout>(
        `${WORKOUT_ENDPOINTS.SCHEDULED.BASE}${WORKOUT_ENDPOINTS.SCHEDULED.GET_BY_ID(workoutId)}`
      );
      return this.handleResponse(response);
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Update a scheduled workout
   */
  async updateScheduledWorkout(
    workoutId: string,
    updates: Partial<ScheduledWorkout>
  ): Promise<ApiResponse<ScheduledWorkout>> {
    try {
      const response = await this.put<ScheduledWorkout>(
        `${WORKOUT_ENDPOINTS.SCHEDULED.BASE}${WORKOUT_ENDPOINTS.SCHEDULED.UPDATE(workoutId)}`,
        updates
      );
      return this.handleResponse(response);
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Delete a scheduled workout
   */
  async deleteScheduledWorkout(workoutId: string): Promise<ApiResponse<void>> {
    try {
      const response = await this.delete<void>(
        `${WORKOUT_ENDPOINTS.SCHEDULED.BASE}${WORKOUT_ENDPOINTS.SCHEDULED.DELETE(workoutId)}`
      );
      return this.handleResponse(response);
    } catch (error) {
      return this.handleError(error);
    }
  }

  // ==================== Completed Workouts ====================

  /**
   * Create a new completed workout
   */
  async createCompletedWorkout(
    workoutData: Omit<CompletedWorkout, "_id" | "created_at" | "updated_at">
  ): Promise<ApiResponse<CompletedWorkout>> {
    try {
      const { _id, created_at, updated_at, ...sanitizedWorkoutData } = workoutData as CompletedWorkout;
      console.log("sanitizedWorkoutData:", sanitizedWorkoutData);
      const response = await this.post<CompletedWorkout>(
        `${WORKOUT_ENDPOINTS.COMPLETED.BASE}${WORKOUT_ENDPOINTS.COMPLETED.CREATE}`,
        sanitizedWorkoutData
      );
      return this.handleResponse(response);
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Get all completed workouts for a user
   */
  async getCompletedWorkouts(userId: string): Promise<ApiResponse<CompletedWorkout[]>> {
    try {
      const response = await this.get<CompletedWorkout[]>(
        `${WORKOUT_ENDPOINTS.COMPLETED.BASE}${WORKOUT_ENDPOINTS.COMPLETED.GET_ALL(userId)}`
      );
      return this.handleResponse(response);
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Get a specific completed workout by ID
   */
  async getCompletedWorkoutById(workoutId: string): Promise<ApiResponse<CompletedWorkout>> {
    try {
      const response = await this.get<CompletedWorkout>(
        `${WORKOUT_ENDPOINTS.COMPLETED.BASE}${WORKOUT_ENDPOINTS.COMPLETED.GET_BY_ID(workoutId)}`
      );
      return this.handleResponse(response);
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Update a completed workout
   */
  async updateCompletedWorkout(
    workoutId: string,
    updates: Partial<CompletedWorkout>
  ): Promise<ApiResponse<CompletedWorkout>> {
    try {
      const response = await this.put<CompletedWorkout>(
        `${WORKOUT_ENDPOINTS.COMPLETED.BASE}${WORKOUT_ENDPOINTS.COMPLETED.UPDATE(workoutId)}`,
        updates
      );
      return this.handleResponse(response);
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Delete a completed workout
   */
  async deleteCompletedWorkout(workoutId: string): Promise<ApiResponse<void>> {
    try {
      const response = await this.delete<void>(
        `${WORKOUT_ENDPOINTS.COMPLETED.BASE}${WORKOUT_ENDPOINTS.COMPLETED.DELETE(workoutId)}`
      );
      return this.handleResponse(response);
    } catch (error) {
      return this.handleError(error);
    }
  }


  async getPredefinedWorkouts(): Promise<ApiResponse<PredefinedWorkout>> {
    try {
      const response = await this.get<PredefinedWorkout>(
        `${WORKOUT_ENDPOINTS.PREDEFINED.BASE}`
      );
      return this.handleResponse(response);
    } catch (error) {
      return this.handleError(error);
    }
  }

  // ==================== Helper Methods ====================

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