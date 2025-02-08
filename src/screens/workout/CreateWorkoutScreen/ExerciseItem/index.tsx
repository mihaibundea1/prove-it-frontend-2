import React from 'react';
import { View, Text, TextInput, TouchableOpacity, Image } from 'react-native';
import { Clock, Trash2 } from 'lucide-react-native';
import { ScaleDecorator } from 'react-native-draggable-flatlist';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { ExerciseSets } from '../ExerciseSets';

export type Set = {
  weight: string;
  reps: string;
};

export type ExerciseItem = {
  exercise_id: string;
  exercise_name: string;
  image_data: string;
  restTimer: string;
  sets: Set[];
  index: number;
};

type ExerciseItemProps = {
  item: ExerciseItem;
  drag: () => void;
  isActive: boolean;
  onDelete: (id: string) => void;
  onTimerPress: (index: number) => void;
  onInputChange: (exerciseIndex: number, setIndex: number, field: 'weight' | 'reps', value: string) => void;
  onAddSet: (exerciseIndex: number) => void;
  onRemoveAllSets: (exerciseIndex: number) => void;
};

export const ExerciseItem = ({
  item,
  drag,
  isActive,
  onDelete,
  onTimerPress,
  onInputChange,
  onAddSet,
  onRemoveAllSets
}: ExerciseItemProps) => (
  <ScaleDecorator>
    <TouchableOpacity
      onLongPress={drag}
      disabled={isActive}
      className={`mb-3 ${isActive ? 'opacity-50' : 'opacity-100'}`}
    >
      <View className="flex-row items-center justify-between mb-1">
        <View className="flex-row items-center">
          <Image
            source={{ uri: item.image_data }}
            className="w-[40px] h-[40px] mr-2 rounded-full"
            onError={() => console.error(`Failed to load image at ${item.image_data}`)}
          />
          <Text className="text-gray-800 text-lg font-bold">
            {item.exercise_name.length > 25 
              ? `${item.exercise_name.substring(0, 22)}...` 
              : item.exercise_name}
          </Text>
        </View>
        <TouchableOpacity onPress={() => onDelete(item.exercise_id)} className="p-1 rounded">
          <Trash2 size={hp(2.5)} color="#FF4444" />
        </TouchableOpacity>
      </View>
      
      <TextInput placeholder="Add routine notes here" className="text-gray-500 text-sm mb-1" />
      
      <TouchableOpacity className="flex-row items-center mb-1" onPress={() => onTimerPress(item.index)}>
        <Clock size={hp(2)} color="#E63600" />
        <Text className="ml-2 text-orange-600 text-sm">Rest Timer: {item.restTimer}</Text>
      </TouchableOpacity>
      
      <ExerciseSets 
        sets={item.sets}
        exerciseIndex={item.index}
        onInputChange={onInputChange}
        onAddSet={onAddSet}
        onRemoveAllSets={onRemoveAllSets}
      />
    </TouchableOpacity>
  </ScaleDecorator>
);