// services/exercise/ExerciseService.ts
import { BaseApiService } from '../api/core/BaseApiService';
import { Exercise } from '@/types/exercise.types';

export class ExerciseService extends BaseApiService {
  constructor() {
    super('/exercises'); // Base endpoint for exercises
  }

  async getExercises(): Promise<ApiResponse<Exercise[]>> {
    return this.get<Exercise[]>('');
  }

  async createExercise(exercise: Partial<Exercise>): Promise<ApiResponse<Exercise>> {
    return this.post<Exercise>('', exercise);
  }
}