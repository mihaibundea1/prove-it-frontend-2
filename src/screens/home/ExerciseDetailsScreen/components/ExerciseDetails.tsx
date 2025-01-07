// components/ExerciseDetails.tsx
import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface ExerciseDetailsProps {
  force: string | null;
  level: string;
  mechanic: string | null;
  equipment: string;
  category: string;
}

export const ExerciseDetailsSection: React.FC<ExerciseDetailsProps> = ({
  force,
  level,
  mechanic,
  equipment,
  category
}) => (
  <View className="bg-gray-100 rounded-lg p-4 mb-4">
    <Text className="text-xl font-semibold mb-2 text-[#E63600]">Exercise Details</Text>
    <DetailRow icon="fitness" text={`Force: ${force || 'N/A'}`} />
    <DetailRow icon="speedometer-outline" text={`Level: ${level || 'N/A'}`} />
    <DetailRow icon="cog-outline" text={`Mechanic: ${mechanic || 'N/A'}`} />
    <DetailRow icon="barbell-outline" text={`Equipment: ${equipment || 'N/A'}`} />
    <DetailRow icon="list-outline" text={`Category: ${category || 'N/A'}`} />
  </View>
);

interface DetailRowProps {
  icon: keyof typeof Ionicons.glyphMap;
  text: string;
}

const DetailRow: React.FC<DetailRowProps> = ({ icon, text }) => (
  <View className="flex-row items-center mb-2">
    <Ionicons name={icon} size={24} color="#E63600" />
    <Text className="ml-2 text-gray-700">{text}</Text>
  </View>
);