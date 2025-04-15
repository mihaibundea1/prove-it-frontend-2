// screens/ExerciseDetailsScreen.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { HomeStackParamList } from '@/navigation/types/navigationTypes';

import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Exercise } from '@/types/exercise.types';
import { useExercises } from '@/contexts/ExerciseContext';
import { ExerciseCarousel } from './components/ExerciseCarousel';
import { ExerciseDetailsSection } from './components/ExerciseDetails';
import { TargetMuscles } from './components/TargetMuscles';
import { ExerciseInstructions } from './components/ExerciseInstructions';
import { ActionButton } from './components/ActionButton';
import { useWorkout } from '@/contexts/WorkoutContext';

type ExerciseDetailsScreenProps = NativeStackScreenProps<HomeStackParamList, 'ExerciseDetailsScreen'>;

const ExerciseDetailsScreen: React.FC<ExerciseDetailsScreenProps> = ({ route, navigation }) => {
    const { exerciseId } = route.params;
    const { activeWorkout } = useWorkout();
    const { fetchExerciseDetails, selectedExercises, toggleExercise } = useExercises();
    const [exercise, setExercise] = React.useState<Exercise | null>(null);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState<string | null>(null);

    const isSelected = selectedExercises.some(ex => ex.id === exerciseId);
    const images = exercise?.images || [];
    const carouselHeight = hp(40);

    const hasFetched = React.useRef(false);

    React.useEffect(() => {
        if (hasFetched.current) return; // Previne apelurile ulterioare
        hasFetched.current = true;

        const loadExerciseDetails = async () => {
            try {
                const details = await fetchExerciseDetails(exerciseId);
                console.log(details, "details in screen");
                details ? setExercise(details) : setError('Failed to load exercise details');
            } catch (err) {
                setError('Failed to load exercise details');
                console.error('Error:', err);
            } finally {
                setLoading(false);
            }
        };

        loadExerciseDetails();
    }, []);

    if (loading) {
        return (
            <View className="flex-1 justify-center items-center bg-white">
                <ActivityIndicator size="large" color="#E63600" />
            </View>
        );
    }

    if (error) {
        return (
            <View className="flex-1 justify-center items-center bg-white">
                <Text className="text-red-500">{error}</Text>
            </View>
        );
    }

    if (!exercise) {
        return (
            <View className="flex-1 justify-center items-center bg-white">
                <Text>No exercise data available</Text>
            </View>
        );
    }

    return (
        <View style={{ flex: 1, backgroundColor: 'white' }}>
            <ScrollView
                className="flex-1 bg-white"
                contentContainerStyle={{ paddingBottom: hp(15) }}
            >
                <StatusBar style="dark" backgroundColor="#ffffff" translucent={false} />

                <View style={{ alignItems: 'center', marginVertical: hp(6) }}>
                    <ExerciseCarousel images={images} carouselHeight={carouselHeight} />
                </View>

                <View className="px-4 pb-8">
                    <Text className="text-3xl font-bold mb-4 text-[#E63600]">
                        {exercise.title}
                    </Text>

                    <ExerciseDetailsSection
                        force={exercise.force}
                        level={exercise.level}
                        mechanic={exercise.mechanic}
                        equipment={exercise.equipment}
                        category={exercise.category}
                    />

                    <TargetMuscles
                        primaryMuscles={exercise.primaryMuscles}
                        secondaryMuscles={exercise.secondaryMuscles}
                    />

                    <ExerciseInstructions
                        instructions={exercise.instructions}
                    />
                </View>

                <TouchableOpacity
                    className="absolute top-10 w-12 h-12 rounded-full bg-black bg-opacity-30 justify-center items-center"
                    style={{
                        top: hp(11),
                        right: hp(3),
                        width: wp(9),
                        height: wp(9),
                    }}
                    onPress={() => navigation.goBack()}
                >
                    <Text className="font-bold text-white text-xl">✕</Text>
                </TouchableOpacity>
            </ScrollView>

            {!activeWorkout && (
            <ActionButton
                isSelected={isSelected}
                onPress={() => toggleExercise(exercise)}
            />
        )}
        </View>
    );
};

export default ExerciseDetailsScreen;