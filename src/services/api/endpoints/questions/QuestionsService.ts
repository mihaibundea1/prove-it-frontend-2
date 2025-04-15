// services/api/endpoints/questions/QuestionsService.ts
import { BaseApiService } from '../../core/BaseApiService';
import { ApiResponse } from '../../core/types/api.types';
import { QUESTIONS_ENDPOINTS } from './constants/questions.endpoints';

export class QuestionsService extends BaseApiService {
  constructor(getToken?: () => Promise<string | null>) {
    super(QUESTIONS_ENDPOINTS.BASE, getToken ?? (() => Promise.resolve(null)));
  }

  async fetchLatestQuestions(): Promise<ApiResponse<any>> {
    return this.get<any>(''); // Empty string because the base path is already set in the constructor
  }
  

  async submitAnswers(data: { clerkId: string, answers: any, }): Promise<ApiResponse<any>> {
    return this.post<any>(QUESTIONS_ENDPOINTS.SUBMIT, data);
  }
  
}
