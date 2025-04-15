import { useState, useCallback, useEffect } from "react";
import { View, ScrollView, Text, TouchableOpacity, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import QuestionCard from "./components/QuestionCard";
import ProgressIndicator from "./components/ProgressIndicator";
import { User } from "@/services/api/endpoints/user/types/user.types";
import type { Question } from "@/types/question.types";
import { useQuestionsService } from "@/services/api/endpoints/questions/hooks/useQuestionsService";
import { useNavigation } from "@react-navigation/native";
import { HomeStackScreenProps } from "@/navigation/types/navigationTypes";
import LoadingOverlay from "@/components/shared/LoadingOverlay";
import { useUserContext } from '@/contexts/UserContext';
import { useUserService } from "@/services/api/endpoints/user/hooks/useUserService";
import MeasurementForm from "./components/MeasurementForm";
import GenderPrompt from "./components/GenderPrompt";

export const QuestionsScreen: React.FC = () => {
  const navigation = useNavigation<HomeStackScreenProps<"QuestionsScreen">["navigation"]>();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string[]>>({});
  const { fetchLatestQuestions, submitAnswers, error } = useQuestionsService();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [version, setVersion] = useState<number | null>(null);
  const { updateUserProfile } = useUserService();
  const [measurementData, setMeasurementData] = useState<{
    height: number;
    weight: number;
    measurement_system: 'imperial' | 'metric';
  } | null>(null);
  const { user, refreshUser } = useUserContext();

  // New state for gender
  const [gender, setGender] = useState<'male' | 'female' | null>(null);

  const handleAnswer = useCallback(
    (questionId: string, answer: string | string[]) => {
      const newAnswers = Array.isArray(answer) ? answer : [answer];
      setAnswers(prev => ({ ...prev, [questionId]: newAnswers }));
    },
    []
  );

  const handleNext = useCallback(() => {
    // If we're on the gender prompt screen (index 1), validate selection.
    if (currentIndex === 1 && !gender) {
      Alert.alert("Please select a gender");
      return;
    }
    const newIndex = currentIndex + 1;
    if (newIndex < questions.length + 2) { // +2 for MeasurementForm and GenderPrompt screens
      setCurrentIndex(newIndex);
    } else {
      handleFinish();
    }
  }, [currentIndex, questions.length, gender]);

  const handlePrevious = useCallback(() => {
    const newIndex = currentIndex - 1;
    if (newIndex >= 0) {
      setCurrentIndex(newIndex);
    }
  }, [currentIndex]);

  useEffect(() => {
    if (user) {
      setMeasurementData({
        height: user.height,
        weight: user.weight,
        measurement_system: user.measurement_system || 'metric'
      });
      // Prepopulate gender if available
      if (user.gender) {
        setGender(user.gender as 'male' | 'female');
      }
    }
  }, [user]);

  useEffect(() => {
    const getQuestions = async () => {
      try {
        const response = await fetchLatestQuestions();
        if (response?.data?.questions) {
          setQuestions(response.data.questions);
          setVersion(response.data.version);
        }
      } catch (err) {
        console.error("Error fetching questions:", err);
      }
    };
    getQuestions();
  }, []);

  const handleFinish = async () => {
    if (!user || !measurementData || !gender) return;

    try {
      // Prepare user update data, now including gender
      const userUpdateData: Partial<User> = {
        ...measurementData, // height, weight, and measurement_system
        gender: gender,
        medicalConditions: answers['q6'] || [],
        questions_completed: true,
        profile_completed: true,
        updated_at: new Date()
      };

      console.log("user_id:", user._id);
      const updatedUser = await updateUserProfile(user._id, userUpdateData);

      if (!updatedUser) {
        throw new Error("Failed to update user profile");
      }

      // Prepare answers for submission (exclude medical conditions)
      const formattedAnswers = Object.entries(answers)
        .filter(([question_id]) => question_id !== 'q6')
        .map(([question_id, answer]) => ({
          question_id,
          question_text: questions.find(q => q._id === question_id)?.question || question_id,
          answer,
          timestamp: new Date().toISOString()
        }));

      if (formattedAnswers.length > 0) {
        await submitAnswers(user.clerkId, { responses: formattedAnswers }, version ?? 0);
      }

      await refreshUser();
      navigation.replace("HomeScreen");
    } catch (err) {
      console.error("Failed to submit data:", err);
      Alert.alert("Error", "Failed to save information. Please try again.");
    }
  };

  // Determine which content to render based on currentIndex
  let content;
  if (currentIndex === 0) {
    content = (
      <MeasurementForm
        onUpdate={setMeasurementData}
        initialData={measurementData || undefined}
      />
    );
  } else if (currentIndex === 1) {
    content = (
      <GenderPrompt
        selectedGender={gender}
        onSelect={(selected) => setGender(selected)}
      />
    );
  } else {
    // For questions, adjust index by subtracting 2 to match questions array
    const questionIndex = currentIndex - 2;
    const currentQuestion = questions[questionIndex];
    content = currentQuestion ? (
      <QuestionCard
        key={currentQuestion._id}
        question={currentQuestion}
        onAnswer={handleAnswer}
        selectedAnswer={answers[currentQuestion._id] || []}
      />
    ) : (
      <Text className="text-gray-500 text-center">Loading questions...</Text>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <LoadingOverlay />

      <ScrollView className="flex-1 px-6 pt-8">
        <ProgressIndicator
          currentStep={currentIndex + 1}
          totalSteps={questions.length + 2} // Updated total pages
        />

        {error ? (
          <Text className="text-red-500 text-center">Error loading questions</Text>
        ) : (
          content
        )}
      </ScrollView>

      <View className="p-6 flex-row justify-between">
        <TouchableOpacity
          className={`py-4 px-8 rounded-full ${currentIndex === 0 ? 'bg-gray-200' : 'bg-gray-800'}`}
          onPress={handlePrevious}
          disabled={currentIndex === 0}
        >
          <Text className={`text-lg font-medium ${currentIndex === 0 ? 'text-gray-400' : 'text-white'}`}>
            Previous
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="bg-[#E63600] py-4 px-8 rounded-full"
          onPress={currentIndex === questions.length + 1 ? handleFinish : handleNext}
        >
          <Text className="text-white text-lg font-medium">
            {currentIndex === questions.length + 1 ? "Finish" : "Next"}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};
