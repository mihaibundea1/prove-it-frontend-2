import React, { useState } from 'react';
import { View, ScrollView } from 'react-native';
import { WorkoutHeader } from './WorkoutHeader';
import { WorkoutTitle } from './WorkoutTitle';
import { ExerciseItem } from './ExerciseItem';
import { TimerPicker } from './TimerPicker';
import DraggableFlatList from 'react-native-draggable-flatlist';
import type { ExerciseItem as ExerciseItemType } from './ExerciseItem';

export const CreateWorkoutScreen = () => {
  const [routineName, setRoutineName] = useState('');
  const [exercises, setExercises] = useState<ExerciseItemType[]>([]);
  const [showTimerPicker, setShowTimerPicker] = useState(false);
  const [selectedTimerIndex, setSelectedTimerIndex] = useState(-1);

  const handleDrag = (data: ExerciseItemType[]) => {
    setExercises(data);
  };

  const handleAddSet = (exerciseIndex: number) => {
    const newExercises = [...exercises];
    newExercises[exerciseIndex].sets.push({ weight: '', reps: '' });
    setExercises(newExercises);
  };

  const handleRemoveAllSets = (exerciseIndex: number) => {
    const newExercises = [...exercises];
    newExercises[exerciseIndex].sets = [];
    setExercises(newExercises);
  };

  const handleInputChange = (
    exerciseIndex: number,
    setIndex: number,
    field: 'weight' | 'reps',
    value: string
  ) => {
    const newExercises = [...exercises];
    newExercises[exerciseIndex].sets[setIndex][field] = value;
    setExercises(newExercises);
  };

  const handleDeleteExercise = (exerciseId: string) => {
    setExercises(exercises.filter(ex => ex.exercise_id !== exerciseId));
  };

  const handleSave = () => {
    // Implement save logic
  };

  return (
    <View className="flex-1 bg-white">
      <WorkoutHeader onSave={handleSave} isSaving={false} />
      
      <ScrollView className="px-4 pt-4">
        <WorkoutTitle 
          routineName={routineName}
          setRoutineName={setRoutineName}
        />
        
        <DraggableFlatList
          data={exercises}
          onDragEnd={({ data }: { data: ExerciseItemType[] }) => handleDrag(data)}
          keyExtractor={(item: ExerciseItemType) => item.exercise_id}
          renderItem={({
            item,
            drag,
            isActive
          }: {
            item: ExerciseItemType;
            drag: () => void;
            isActive: boolean;
          }) => (
            <ExerciseItem
              item={item}
              drag={drag}
              isActive={isActive}
              onDelete={handleDeleteExercise}
              onTimerPress={(index: number) => {
                setSelectedTimerIndex(index);
                setShowTimerPicker(true);
              }}
              onInputChange={handleInputChange}
              onAddSet={handleAddSet}
              onRemoveAllSets={handleRemoveAllSets}
            />
          )}
        />
      </ScrollView>

      <TimerPicker
        visible={showTimerPicker}
        onClose={() => setShowTimerPicker(false)}
        selectedValue={exercises[selectedTimerIndex]?.restTimer || 'OFF'}
        onValueChange={(value) => {
          const newExercises = [...exercises];
          newExercises[selectedTimerIndex].restTimer = value;
          setExercises(newExercises);
        }}
      />
    </View>
  );
};