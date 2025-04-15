import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, Modal } from "react-native";
import { format } from "date-fns";

interface Achievement {
  name: string;
  status: 'in progress' | 'achieved';
  emoji: string;
  description: string;
  progress: number;
  required_progress: number;
  created_at: Date;
  updated_at?: Date;
}

interface Props {
  achievements: Achievement[];
}

const Achievements: React.FC<Props> = ({ achievements }) => {
  const [modalVisible, setModalVisible] = useState(false);

  const transformAchievements = (achievements: Achievement[]): Achievement[] => {
    return achievements.map(achievement => ({
      ...achievement,
      // Explicitly type the status value to one of the literals
      status: achievement.status === 'achieved' ? 'achieved' as const : 'in progress' as const,
      progress: achievement.progress !== undefined ? achievement.progress : 0,
      required_progress: achievement.required_progress || 0
    }));
  };
  
  // Transform the achievements once for consistency
  achievements = transformAchievements(achievements);
  
  const isUnlocked = (achievement: Achievement) => 
    achievement.status === 'achieved';

  const progressPercentage = (achievement: Achievement) => 
    (achievement.progress / achievement.required_progress) * 100;

  return (
    <View className="mb-6">
      {/* Header */}
      <View className="flex-row justify-between items-center mb-2">
        <Text className="text-lg font-bold text-gray-800">Achievements</Text>
        <TouchableOpacity onPress={() => setModalVisible(true)}>
          <Text className="text-[#E63600] font-medium">View All</Text>
        </TouchableOpacity>
      </View>

      {/* Horizontal Scroll Cards */}
      {achievements.length === 0 ? (
        <View className="p-4">
          <Text className="text-center text-gray-500">There are no achievements yet</Text>
        </View>
      ) : (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="pb-2">
          {achievements.map((achievement) => (
            <View
              key={achievement.name}
              className={`mr-4 p-4 rounded-xl w-40 h-48 items-center justify-center ${
                isUnlocked(achievement) ? "bg-white" : "bg-gray-200"
              } border border-gray-100`}
            >
              {/* Lock Badge */}
              {!isUnlocked(achievement) && (
                <View className="absolute top-2 right-2 bg-gray-400 px-2 py-0.5 rounded">
                  <Text className="text-white text-xs">Locked</Text>
                </View>
              )}

              {/* Emoji Container */}
              <View
                className={`w-16 h-16 rounded-full mb-3 items-center justify-center ${
                  isUnlocked(achievement) ? "bg-[#E63600]/10" : "bg-gray-300"
                }`}
              >
                <Text className="text-3xl">{achievement.emoji}</Text>
              </View>

              {/* Text Content */}
              <Text
                className={`font-bold text-center mb-1 ${
                  isUnlocked(achievement) ? "text-gray-800" : "text-gray-500"
                }`}
              >
                {achievement.name}
              </Text>
              <Text
                className={`text-xs text-center ${
                  isUnlocked(achievement) ? "text-gray-600" : "text-gray-500"
                }`}
              >
                {achievement.description}
              </Text>

              {/* Progress Bar */}
              <View className="absolute bottom-2 left-2 right-2 bg-gray-200 rounded-full h-1">
                <View
                  className="bg-[#E63600] rounded-full h-1"
                  style={{ width: `${progressPercentage(achievement)}%` }}
                />
              </View>
            </View>
          ))}
        </ScrollView>
      )}

      {/* Full Screen Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View className="flex-1 bg-black/20 justify-center items-center p-4">
          <View className="w-full bg-white rounded-2xl max-h-[80vh]">
            {/* Modal Header */}
            <View className="flex-row justify-between items-center p-4 border-b border-gray-100">
              <Text className="text-xl font-bold text-gray-900">All Achievements</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)} className="p-2">
                <Text className="text-gray-500 text-lg">✕</Text>
              </TouchableOpacity>
            </View>

            {/* Achievements List */}
            <ScrollView className="p-4">
              {achievements.length === 0 ? (
                <View className="p-4">
                  <Text className="text-center text-gray-500">There are no achievements yet</Text>
                </View>
              ) : (
                achievements.map((achievement) => (
                  <View key={achievement.name} className="mb-4 pb-4 border-b border-gray-100 last:border-0">
                    <View className="flex-row items-start">
                      {/* Emoji */}
                      <View
                        className={`w-12 h-12 rounded-full items-center justify-center ${
                          isUnlocked(achievement) ? 'bg-[#E63600]/10' : 'bg-gray-100'
                        }`}
                      >
                        <Text className="text-2xl">{achievement.emoji}</Text>
                      </View>

                      {/* Details */}
                      <View className="flex-1 ml-4">
                        <Text className="font-semibold text-gray-900">{achievement.name}</Text>
                        <Text className="text-xs text-gray-500 mt-1">
                          {isUnlocked(achievement) 
                            ? `Unlocked ${format(achievement.created_at, 'MMM d, yyyy')}`
                            : `In progress - Updated ${format(achievement.updated_at || new Date(), 'MMM d, yyyy')}`
                          }
                        </Text>
                        <Text className="text-sm text-gray-600 mt-2">
                          {achievement.description}
                        </Text>

                        {/* Progress */}
                        <View className="mt-3">
                          <View className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                            <View
                              className={`h-full ${isUnlocked(achievement) ? 'bg-[#E63600]' : 'bg-gray-400'}`}
                              style={{ width: `${progressPercentage(achievement)}%` }}
                            />
                          </View>
                          <Text className="text-xs text-gray-500 mt-1">
                            {isUnlocked(achievement)
                              ? 'Goal achieved!'
                              : `${achievement.progress}/${achievement.required_progress} (${Math.round(progressPercentage(achievement))}%)`
                            }
                          </Text>
                        </View>
                      </View>
                    </View>
                  </View>
                ))
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default Achievements;
