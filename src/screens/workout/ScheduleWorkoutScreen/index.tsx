import React from 'react';
import { View, StyleSheet, Dimensions, Platform, SafeAreaView, StatusBar } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { PlusCircle, Repeat2, Bot, Sparkles } from 'lucide-react-native';
import Header from './components/Header';
import OptionButton from '@/components/shared/OptionButton';
import GradientCard from './components/GradientCard';
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { HomeStackParamList } from "@/navigation/types/navigationTypes";
import { useNavigation } from '@react-navigation/native';
import { HomeStackScreenProps } from '@/navigation/types/navigationTypes';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const isIOS = Platform.OS === 'ios';

type ScheduleWorkoutScreen = NativeStackScreenProps<HomeStackParamList, 'ScheduleWorkoutScreen'>;

export const ScheduleWorkoutScreen: React.FC<ScheduleWorkoutScreen> = () => {

  const navigation = useNavigation<HomeStackScreenProps<'ScheduleWorkoutScreen'>['navigation']>();
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      <LinearGradient
        colors={['#ffffff', '#f8f8f8']}
        style={styles.container}
      >
        <Header
          title="Schedule Workout"
          subtitle="Choose how you want to schedule"
        />

        <View style={styles.optionsContainer}>
          {/* <OptionButton
            icon={<PlusCircle size={28} color="#ee4444" />}
            title="Create New"
            subtitle="Build a custom workout plan"
            onPress={() => console.log('Create New pressed')}
            variant="default"
          /> */}

          <OptionButton
            icon={<Repeat2 size={28} color="#666" />}
            title="Use Existing"
            subtitle="Select from previous workouts"
            onPress={() => navigation.navigate('ScheduleExistingWorkoutsScreen')}
            variant="default"
          />

          <GradientCard>
            <OptionButton
              icon={
                <View style={styles.aiIconContainer}>
                  <Bot size={28} color="white" />
                  <Sparkles size={12} color="white" style={styles.sparklesIcon} />
                </View>
              }
              title="AI Generate"
              subtitle="Get a personalized workout plan"
              onPress={() => navigation.navigate('CreateAIWorkoutScreen', { schedule: true })}
              variant="ai"
            />
          </GradientCard>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#ffffff',
    paddingTop: isIOS ? 0 : StatusBar.currentHeight,
  },
  container: {
    flex: 1,
    paddingHorizontal: SCREEN_WIDTH * 0.06, // Responsive padding based on screen width
    paddingTop: isIOS ? 40 : 20,
  },
  optionsContainer: {
    marginTop: SCREEN_HEIGHT * 0.05, // Responsive margin based on screen height
    gap: 20,
  },
  aiIconContainer: {
    position: 'relative',
    width: 28,
    height: 28,
  },
  sparklesIcon: {
    position: 'absolute',
    top: -4,
    right: -4,
  }
});