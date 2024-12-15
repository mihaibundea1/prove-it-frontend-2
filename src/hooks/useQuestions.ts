// src/hooks/useQuestions.ts
import { useState } from 'react';
import { useUser } from '@clerk/clerk-react';
import { questionsAPI } from '../services/api/questions.api';
import { useNavigation } from '@react-navigation/native';

export const useQuestions = () => {
  const { user } = useUser();
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submitAnswers = async (answers: Record<string, string[]>, version: number) => {
    if (!user) {
      throw new Error('No user logged in');
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await questionsAPI.submitAnswers(user.id, answers, version);
      navigation.navigate('MainTabs');
      return result;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to submit answers';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    submitAnswers,
    isLoading,
    error
  };
};