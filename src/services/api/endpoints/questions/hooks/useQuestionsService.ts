import { useState } from 'react';
import { QuestionsService } from '../QuestionsService';
import { ApiResponse } from '../../../core/types/api.types';
import { Question } from '@/types/question.types';

export const useQuestionsService = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const questionsService = new QuestionsService();

  const fetchLatestQuestions = async (): Promise<ApiResponse<any>> => {
    setLoading(true);
    setError(null);
    try {
      const response = await questionsService.fetchLatestQuestions();
  
      if (response.data && response.data.questions) {
        const questions = response.data.questions.map((questionData: any) => ({
          _id: questionData.id,
          question: questionData.question,
          options: questionData.options,
          answer_type: questionData.answer_type,
          version: questionData.version ? String(questionData.version) : "0", // Ensure version is a string
        }));

        return {
          ...response,
          data: {
            ...response.data,
            questions,
          },
        };
      }
  
      throw new Error('No questions data available');
    } catch (err) {
      console.error("Error fetching questions:", err);
      setError('Failed to fetch questions');
      throw err;
    } finally {
      setLoading(false); // Ensure loading is always set to false
    }
  };
  

  const submitAnswers = async (
    clerkId: string,
    answers: { responses: Response[] },  // The format now includes question_text, answer, timestamp, etc.
    questionVersion: number,  // The version you are passing
  ): Promise<ApiResponse<any>> => {
    setLoading(true);
    setError(null);
    try {
      // Simply structure the data with version and responses as they are formatted now
      const structuredAnswers = {
        version: questionVersion,  // Include the question set version
        responses: answers.responses,  // Use the responses passed directly
      };
  
      // Send the structured data to the backend service
      const response = await questionsService.submitAnswers({
        clerkId,
        answers: structuredAnswers,
      });
  
      setLoading(false);
      return response;
    } catch (err) {
      setLoading(false);
      setError('Failed to submit answers');
      throw err;
    }
  };

  return {
    fetchLatestQuestions,
    submitAnswers,
    loading,
    error,
  };
};
