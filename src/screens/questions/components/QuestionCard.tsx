import { Question } from "@/types/question.types";
import React, { useState } from "react";
import { View, Text, TouchableOpacity, TextInput, ScrollView } from "react-native";
import Icon from 'react-native-vector-icons/MaterialIcons';
import { LinearGradient } from 'expo-linear-gradient';

interface QuestionCardProps {
  question: Question;
  onAnswer: (questionId: string, answer: string | string[]) => void;
  selectedAnswer: string[];
}

const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  onAnswer,
  selectedAnswer,
}) => {
  const [textInput, setTextInput] = useState('');
  const isMultiple = question.answer_type === "multiple";
  const isTextInput = question.answer_type === "text";

  const handleTextSubmit = () => {
    if (textInput.trim()) {
      onAnswer(question._id, [...selectedAnswer, textInput.trim()]);
      setTextInput('');
    }
  };

  const handleRemoveItem = (item: string) => {
    onAnswer(
      question._id,
      selectedAnswer.filter(answer => answer !== item)
    );
  };

  if (isTextInput) {
    return (
      <LinearGradient
        colors={['#f8f9fa', '#ffffff']}
        className="p-6 rounded-2xl shadow-lg"
        style={{
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.1,
          shadowRadius: 10
        }}
      >
        <Text className="text-2xl font-bold mb-4">{question.question}</Text>
        
        <View className="flex-row items-center mb-4">
          <TextInput
            className="flex-1 h-12 border border-gray-200 rounded-lg p-4 mr-2"
            placeholder="Type and press + to add..."
            value={textInput}
            onChangeText={setTextInput}
            onSubmitEditing={handleTextSubmit}
          />
          <TouchableOpacity
            className="bg-[#E63600] p-3 rounded-full"
            onPress={handleTextSubmit}
          >
            <Icon name="add" size={24} color="white" />
          </TouchableOpacity>
        </View>

        <ScrollView className="max-h-40">
          {selectedAnswer.map((item, index) => (
            <View key={index} className="flex-row items-center bg-gray-100 p-3 rounded-lg mb-2">
              <Text className="flex-1 text-lg">{item}</Text>
              <TouchableOpacity onPress={() => handleRemoveItem(item)}>
                <Icon name="close" size={20} color="#666" />
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient
      colors={['#f8f9fa', '#ffffff']}
      className="p-6 rounded-2xl shadow-lg"
      style={{
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10
      }}
    >
      <Text className="text-2xl font-bold mb-4">{question.question}</Text>
      <Text className="text-sm text-gray-500 mb-6">
        {isMultiple ? "Select all that apply" : "Select one"}
      </Text>
      
      <View className="space-y-3">
        {question.options?.map((option) => {
          const isSelected = selectedAnswer.includes(option);
          return (
            <TouchableOpacity
              key={option}
              className={`p-4 rounded-xl border-2 ${
                isSelected 
                  ? "border-[#E63600] bg-[#E63600]/10" 
                  : "border-gray-200"
              }`}
              onPress={() => {
                if (isMultiple) {
                  const newAnswers = isSelected
                    ? selectedAnswer.filter(a => a !== option)
                    : [...selectedAnswer, option];
                  onAnswer(question._id, newAnswers);
                } else {
                  onAnswer(question._id, [option]);
                }
              }}
            >
              <View className="flex-row items-center">
                <View className={`w-6 h-6 rounded-full mr-3 flex items-center justify-center ${
                  isSelected 
                    ? "bg-[#E63600]" 
                    : "border-2 border-gray-300"
                }`}>
                  {isSelected && (
                    <Icon name="check" size={16} color="white" />
                  )}
                </View>
                <Text className={`text-lg ${
                  isSelected ? "text-[#E63600]" : "text-gray-800"
                }`}>
                  {option}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </LinearGradient>
  );
};

export default QuestionCard;