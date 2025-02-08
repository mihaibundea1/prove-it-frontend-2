import React from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

type Set = {
  weight: string;
  reps: string;
};

type ExerciseSetsProps = {
  sets: Set[];
  exerciseIndex: number;
  onInputChange: (exerciseIndex: number, setIndex: number, field: 'weight' | 'reps', value: string) => void;
  onAddSet: (exerciseIndex: number) => void;
  onRemoveAllSets: (exerciseIndex: number) => void;
};

export const ExerciseSets = ({ 
  sets,
  exerciseIndex,
  onInputChange,
  onAddSet,
  onRemoveAllSets
}: ExerciseSetsProps) => (
  <>
    <View className='flex-row mb-1'>
      <Text className='w-[15%] text-[${hp(1.8)}px] font-bold'>SET</Text>
      <Text className='w-[15%] text-[${hp(1.8)}px] font-bold'>KG</Text>
      <Text className='w-[15%] text-[${hp(1.8)}px] font-bold'>REPS</Text>
    </View>
    
    {sets.map((set, setIndex) => (
      <View key={setIndex} className='flex-row mb-1'>
        <Text className='w-[15%] text-[${hp(1.8)}px]'>{setIndex + 1}</Text>
        <TextInput
          className='w-[15%] text-[${hp(1.8)}px]'
          placeholder="0"
          keyboardType="numeric"
          value={set.weight}
          onChangeText={(text) => onInputChange(exerciseIndex, setIndex, 'weight', text)}
        />
        <TextInput
          className='w-[15%] text-[${hp(1.8)}px]'
          placeholder="0"
          keyboardType="numeric"
          value={set.reps}
          onChangeText={(text) => onInputChange(exerciseIndex, setIndex, 'reps', text)}
        />
      </View>
    ))}
    
    <TouchableOpacity onPress={() => onAddSet(exerciseIndex)} className='mt-1'>
      <Text className='text-orange-600 text-[${hp(1.8)}px]'>+ Add Set</Text>
    </TouchableOpacity>
    
    <TouchableOpacity 
      onPress={() => onRemoveAllSets(exerciseIndex)} 
      className='mt-1 mb-1'
    >
      <Text className='text-gray-500 text-[${hp(1.8)}px]'>- Remove All Sets</Text>
    </TouchableOpacity>
  </>
);