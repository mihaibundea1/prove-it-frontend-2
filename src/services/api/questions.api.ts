// src/services/api/questions.api.ts
import { Config } from '../../config/env';
import { getAuthHeader } from '../../utils/auth.utils';

export interface QuestionResponse {
  questionsData: any[];
  versionData: any;
  error: string | null;
}

export const questionsAPI = {
  async fetchQuestions(): Promise<QuestionResponse> {
    try {
      const headers = await getAuthHeader();
      const response = await fetch(`${Config.apiUrl}/questions`, {
        headers,
      });

      if (!response.ok) {
        throw new Error('Failed to fetch questions');
      }

      const data = await response.json();
      return { 
        questionsData: data.questions, 
        versionData: data.version, 
        error: null 
      };
    } catch (error) {
      console.error('Fetch questions error:', error);
      return { 
        questionsData: [], 
        versionData: [], 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  },

  async submitAnswers(
    userId: string, 
    answers: Record<string, string[]>, 
    version: number
  ) {
    try {
      const headers = await getAuthHeader();
      const response = await fetch(`${Config.apiUrl}/questions/submit`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          userId,
          answers: {
            version,
            responses: answers
          }
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to submit answers');
      }

      return await response.json();
    } catch (error) {
      console.error('Submit answers error:', error);
      throw error;
    }
  },

  isAnswerValid(question: any, answer: string[]) {
    if (!answer || answer.length === 0) return false;
    return question.answer_type === 'text' ? answer[0] !== '' : true;
  }
};