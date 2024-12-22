import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  Modal,
  ScrollView,
  Dimensions,
  FlatList,
} from 'react-native';
import { X } from 'lucide-react-native';
import { WorkoutDetailProps, SetItemProps } from '../types';

const WorkoutDetail: React.FC<WorkoutDetailProps> = ({ workout, visible, onClose }) => {
  const windowHeight = Dimensions.get('window').height;

  const renderSet = ({ item, index }: SetItemProps) => (
    <View className="bg-gray-50 p-3 rounded-lg items-center flex-1 mx-1">
      <Text className="text-sm text-gray-500">Set {index + 1}</Text>
      <Text className="font-medium text-gray-900">{item.reps} reps</Text>
      <Text className="text-sm text-gray-700">{item.weight} kg</Text>
    </View>
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black/50">
        <View className="bg-white rounded-t-3xl mt-auto" style={{ maxHeight: windowHeight * 0.9 }}>
          <SafeAreaView>
            <View className="p-4 border-b border-gray-200">
              <View className="flex-row justify-between items-center">
                <View>
                  <Text className="text-xl font-bold text-gray-900">
                    {workout.name}
                  </Text>
                  <Text className="text-sm text-gray-500">
                    {new Date(workout.createdAt).toLocaleDateString()}
                  </Text>
                </View>
                <TouchableOpacity onPress={onClose} className="p-2">
                  <X size={24} color="#111827" />
                </TouchableOpacity>
              </View>
            </View>

            <ScrollView className="p-4" showsVerticalScrollIndicator={false}>
              {workout.exercises.map((exercise, idx) => (
                <View key={idx} className="mb-6">
                  <Text className="text-lg font-semibold mb-3 text-gray-900">
                    {exercise.exercise_name}
                  </Text>
                  <FlatList
                    data={exercise.sets}
                    renderItem={renderSet}
                    keyExtractor={(_, index) => index.toString()}
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                    // contentContainerClassName="space-x-2"
                  />
                </View>
              ))}
            </ScrollView>
          </SafeAreaView>
        </View>
      </View>
    </Modal>
  );
};

export default WorkoutDetail;