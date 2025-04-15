import React, { useState, useRef } from "react";
import {
  Easing,
  Animated,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { StatusBar } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { HomeStackScreenProps } from "@/navigation/types/navigationTypes";
import { useGeminiService } from "@/services/api/endpoints/gemini/hooks/useGeminiService";
import { LinearGradient } from "expo-linear-gradient";
import { Bot, Sparkles, Calendar, Dumbbell, Plus } from "lucide-react-native";
import ProgressIndicator from "./components/ProgressIndicator";
import SelectionCard from "./components/SelectionCard";
import OptionCard from "./components/OptionCard";
import { useUserContext } from "@/contexts/UserContext";
// import Body from "react-native-body-highlighter";
// to be added in package.json:     // "react-native-body-highlighter": "^3.1.3",



// Constants
// Use your existing muscle groups object
const MUSCLE_GROUPS: Record<string, string> = {
  "Abdominals": "abdominals",
  "Hamstrings": "hamstrings",
  "Adductors": "adductors",
  "Quadriceps": "quadriceps",
  "Biceps": "biceps",
  "Shoulders": "shoulders",
  "Chest": "chest",
  "Middle Back": "middle back",
  "Calves": "calves",
  "Glutes": "glutes",
  "Lower Back": "lower back",
  "Lats": "lats",
  "Triceps": "triceps",
  "Traps": "traps",
  "Forearms": "forearms",
  "Neck": "neck",
  "Abductors": "abductors"
} as const;

type BodyPartSlug = 
  | 'trapezius' | 'triceps' | 'forearm' | 'obliques' | 'adductors' 
  | 'calves' | 'head' | 'neck' | 'chest' | 'biceps' | 'abs' 
  | 'upper-back' | 'lower-back' | 'hamstring' | 'gluteal' 
  | 'deltoids' | 'hands' | 'feet' | 'ankles' | 'tibialis' 
  | 'quads' | 'lats';

// Correct mapping from your muscle group keys to the body highlighter library slugs
const MUSCLE_TO_SLUG: Record<string, BodyPartSlug> = {
  'Triceps': 'triceps',
  'Forearms': 'forearm',
  'Adductors': 'adductors',
  'Calves': 'calves',
  'Neck': 'neck',
  'Chest': 'chest',
  'Biceps': 'biceps',
  'Abdominals': 'abs',
  'Middle Back': 'upper-back',
  'Lower Back': 'lower-back',
  'Hamstrings': 'hamstring',
  'Glutes': 'gluteal',
  'Shoulders': 'deltoids',
  'Quadriceps': 'quads',
  'Lats': 'lats',
  'Traps': 'trapezius'
} as const;


const DIFFICULTY_LEVELS = ["Beginner", "Intermediate", "Advanced"];
const WORKOUT_TYPES = ["Single Workout", "Full Routine"];
const ROUTINE_DAYS = [
  { days: "3", label: "3 Days", subtitle: "Light maintenance" },
  { days: "4", label: "4 Days", subtitle: "Balanced training" },
  { days: "5", label: "5 Days", subtitle: "Serious progress" },
  { days: "6", label: "6 Days", subtitle: "Advanced split" },
];
const EXERCISE_COUNTS = ["2-4", "4-6", "7-8"];
const REP_RANGES = ["Low (1-5)", "Medium (8-12)", "High (15-20)"];

const CreateAIWorkoutScreen: React.FC<HomeStackScreenProps<"CreateAIWorkoutScreen">> = ({ route }) => {
  const schedule = route.params?.schedule;
  const navigation = useNavigation<HomeStackScreenProps<"WorkoutDetailsScreen">["navigation"]>();
  const { handleGenerateWorkout, isLoading, error } = useGeminiService();
  const { user } = useUserContext();

  // State variables
  const [step, setStep] = useState(0);
  const [workoutType, setWorkoutType] = useState("");
  const [selectedMuscles, setSelectedMuscles] = useState<string[]>([]);
  const [routineDays, setRoutineDays] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [exerciseCount, setExerciseCount] = useState("");
  const [repRange, setRepRange] = useState("");
  const [useInitialSettings, setUseInitialSettings] = useState<boolean | null>(false);

  // Helper functions
  const toggleMuscleSelection = (muscle: string) => {
    setSelectedMuscles((prev) =>
      prev.includes(muscle) ? prev.filter((m) => m !== muscle) : [...prev, muscle]
    );
  };

  const getTotalSteps = () => (workoutType === "Single Workout" ? 7 : 8);

  const onGenerateWorkout = (initialSettings?: boolean) => {
    const effectiveUseInitialSettings =
      initialSettings !== undefined ? initialSettings : useInitialSettings;

    if (!user?._id) {
      console.error("User ID is required");
      return;
    }

    const requestData = {
      user_id: user._id,
      workoutType: workoutType as "Single Workout" | "Full Routine",
      selectedMuscles: selectedMuscles,
      useInitialSettings: effectiveUseInitialSettings,
      ...(effectiveUseInitialSettings === false && {
        difficulty: difficulty as "Beginner" | "Intermediate" | "Advanced",
        exerciseCount: exerciseCount,
        repRange: repRange,
        ...(workoutType === 'Full Routine' && { routineDays: routineDays })
      })
    };

    console.log(requestData);
    handleGenerateWorkout(requestData, schedule);
    setStep(getTotalSteps());
  };


  const resetSelections = () => {
    setWorkoutType("");
    setSelectedMuscles([]);
    setRoutineDays("");
    setDifficulty("");
    setExerciseCount("");
    setRepRange("");
    setUseInitialSettings(null);
    setStep(0);
  };

  const fadeAnim = useRef(new Animated.Value(1)).current; // For fade animation

  const goToNextStep = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 200,
      easing: Easing.ease,
      useNativeDriver: true,
    }).start(() => {
      let nextStep = step + 1;

      if (step === 3 && useInitialSettings) {
        nextStep = workoutType === "Single Workout" ? 7 : 8;
      }

      setStep(Math.min(nextStep, getTotalSteps()));

      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 200,
        easing: Easing.ease,
        useNativeDriver: true,
      }).start();
    });
  };

  const isNextEnabled = () => {
    const singleValidations: Record<string, () => boolean> = {
      "4": () => exerciseCount !== "",
      "5": () => repRange !== "",
      "6": () => difficulty !== "",
    };

    const fullValidations: Record<string, () => boolean> = {
      "4": () => routineDays !== "",
      "5": () => difficulty !== "",
      "6": () => exerciseCount !== "",
      "7": () => repRange !== "",
    };

    const sharedValidations: Record<string, () => boolean> = {
      "1": () => workoutType !== "",
      "2": () => workoutType === "Single Workout" ? selectedMuscles.length > 0 : true, // Skip validation for Full Routine
      "3": () => useInitialSettings !== null,
    };

    const stepKey = step.toString(); // Convert step to a string

    if (sharedValidations[stepKey]) return sharedValidations[stepKey]();
    if (workoutType === "Single Workout" && singleValidations[stepKey]) return singleValidations[stepKey]();
    if (workoutType === "Full Routine" && fullValidations[stepKey]) return fullValidations[stepKey]();
    return true;
  };

  // Step rendering functions
  const renderWelcome = () => (
    <View className="px-6 pt-10 pb-20">
      <Text className="text-4xl font-bold text-white text-center mb-3">AI Workout</Text>
      <Text className="text-xl text-white text-center opacity-90 mb-12">
        Let's create your perfect workout plan
      </Text>
      <OptionCard
        icon={
          <View className="relative">
            <Bot size={28} color="#ee4444" />
            <Sparkles size={12} color="white" className="absolute -top-1 -right-1" />
          </View>
        }
        title="Get Started"
        subtitle="Create a personalized workout plan"
        selected={false}
        onPress={() => {
          Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 200,
            easing: Easing.ease,
            useNativeDriver: true,
          }).start(() => {
            setStep(1);
            Animated.timing(fadeAnim, {
              toValue: 1,
              duration: 200,
              easing: Easing.ease,
              useNativeDriver: true,
            }).start();
          });
        }}
      />
    </View>
  );

  const renderWorkoutType = () => (
    <View className="px-6 py-4">
      <Text className="text-2xl font-bold text-gray-900 mb-6">Workout Type</Text>
      <View style={{ marginBottom: 20 }} />
      <View>
        <OptionCard
          icon={<Dumbbell size={28} />}
          title="Single Workout"
          subtitle="Focus on specific muscle groups"
          selected={workoutType === "Single Workout"}
          onPress={() => {
            setWorkoutType("Single Workout");
            goToNextStep();
          }}
          marginBottom={20}
        />
        {/* <OptionCard
          icon={<Calendar size={28} color={workoutType === "Full Routine" ? "white" : "#E63600"} />}
          title="Full Routine"
          subtitle="Plan for multiple days per week"
          selected={workoutType === "Full Routine"}
          onPress={() => {
            setWorkoutType("Full Routine");
            goToNextStep();
          }}
        /> */}
      </View>
    </View>
  );

  // Then update the renderMuscleGroups function
  const renderMuscleGroups = () => {
    // Convert selected muscles to proper body part data
    const bodyData = selectedMuscles
      .map(muscle => ({
        slug: MUSCLE_TO_SLUG[muscle as keyof typeof MUSCLE_TO_SLUG],
        intensity: 1 as const
      }))
      .filter(item => item.slug !== undefined);
  
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Muscle Groups</Text>
        <Text style={styles.subtitle}>Select target muscles</Text>
        
        <View style={styles.selectionContainer}>
          <SelectionCard
            items={Object.keys(MUSCLE_GROUPS)}
            selectedItems={selectedMuscles}
            onSelect={toggleMuscleSelection}
            multiSelect
          />
        </View>
  
       <View style={styles.bodyContainer}>
          {/* <Text style={styles.sectionTitle}>Targeted Muscles</Text>
          <View style={styles.bodyWrapper}>
            <View style={styles.bodyView}>
              <Body
                data={bodyData}
                colors={['#E63600', '#ff6b6b']}
                gender="male"
                side="front"
                scale={0.35} // Made even smaller
              />
              <Text style={styles.viewLabel}>Front</Text>
            </View>
            <View style={styles.bodyView}>
              <Body
                data={bodyData}
                colors={['#E63600', '#ff6b6b']}
                gender="male"
                side="back"
                scale={0.35} // Made even smaller
              />
              <Text style={styles.viewLabel}>Back</Text>
            </View>
          </View> */}
        </View> 
  
        <TouchableOpacity
          style={[
            styles.nextButton,
            selectedMuscles.length === 0 && styles.nextButtonDisabled
          ]}
          onPress={goToNextStep}
          disabled={selectedMuscles.length === 0}
        >
          <Text style={styles.nextButtonText}>
            {selectedMuscles.length > 0 ? 'Continue' : 'Select muscles to continue'}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };
  

  const renderSettings = () => (
    <View className="px-6 py-4">
      <Text className="text-2xl font-bold text-gray-900 mb-6">Settings</Text>
      <View className="space-y-4">
        <OptionCard
          icon={<Sparkles size={24} />}
          title="Use My Settings"
          subtitle="From your profile"
          selected={useInitialSettings === true}
          onPress={() => {
            const newSetting = true;
            setUseInitialSettings(newSetting);
            setStep(workoutType === "Single Workout" ? 7 : 8);
            onGenerateWorkout(newSetting); // Pass newSetting directly
          }}

        />
        <View style={{ height: 10 }} />
        <OptionCard
          icon={<Dumbbell size={24} />}
          title="Tailor Now"
          subtitle="Customize workout details"
          selected={useInitialSettings === false}
          onPress={() => {
            setUseInitialSettings(false);
            goToNextStep();
          }}
        />
      </View>
    </View>
  );

  const renderExerciseCount = () => (
    <View className="px-6 py-4">
      <Text className="text-3xl font-bold text-gray-900 mb-6">Exercise Count</Text>
      <Text className="text-lg text-gray-500 mb-8">Exercises per workout</Text>
      <View className="space-y-6">
        {EXERCISE_COUNTS.map((count) => (
          <OptionCard
            key={count}
            icon={<Plus size={24} color="#E63600" />}
            title={count}
            subtitle="Exercises"
            selected={exerciseCount === count}
            onPress={() => {
              setExerciseCount(count);
              goToNextStep();
            }}
            marginBottom={count === EXERCISE_COUNTS[EXERCISE_COUNTS.length - 1] ? 0 : 20}
          />
        ))}
      </View>
    </View>
  );

  const renderRoutineDays = () => (
    <View className="px-6 py-4">
      <Text className="text-3xl font-bold text-gray-900 mb-6">Training Frequency</Text>
      <Text className="text-lg text-gray-500 mb-8">Days per week commitment</Text>
      <View className="space-y-4">
        <View style={{ height: 10 }} />

        {ROUTINE_DAYS.map(({ days, label, subtitle }) => (

          <OptionCard
            key={days}
            icon={<Calendar size={24} color="#E63600" />}
            title={label}
            subtitle={subtitle}
            selected={routineDays === days}
            onPress={() => {
              setRoutineDays(days);
              goToNextStep();
            }}
            marginBottom={days === ROUTINE_DAYS[ROUTINE_DAYS.length - 1].days ? 0 : 20}
          />
        ))}
      </View>
    </View>
  );

  const renderRepRange = () => (
    <View className="px-6 py-4">
      <Text className="text-3xl font-bold text-gray-900 mb-6">Repetition Range</Text>
      <View className="space-y-4">
        <View style={{ height: 10 }} />

        {REP_RANGES.map((range) => (
          <OptionCard
            key={range}
            icon={<Sparkles size={24} color="#E63600" />}
            title={range}
            subtitle="Reps per set"
            selected={repRange === range}
            onPress={() => {
              setRepRange(range);
              goToNextStep();
            }}
            marginBottom={range === REP_RANGES[REP_RANGES.length - 1] ? 0 : 20}
          />
        ))}
      </View>
    </View>
  );

  const renderDifficulty = () => (
    <View className="px-6 py-4">
      <Text className="text-3xl font-bold text-gray-900 mb-6">Difficulty Level</Text>
      <View className="space-y-4">
        <View style={{ height: 10 }} />

        {DIFFICULTY_LEVELS.map((level) => (
          <OptionCard
            key={level}
            icon={<Dumbbell size={24} color="#E63600" />}
            title={level}
            subtitle={`${level} intensity`}
            selected={difficulty === level}
            onPress={() => {
              setDifficulty(level);
              goToNextStep();
            }}
            marginBottom={level === DIFFICULTY_LEVELS[DIFFICULTY_LEVELS.length - 1] ? 0 : 20}
          />
        ))}
      </View>
    </View>
  );

  const renderGeneration = () => (
    <View className="px-6 py-4">
      <Text className="text-3xl font-bold text-gray-900 mb-6">Workout Plan</Text>
      {isLoading ? (
        <View className="py-12 items-center">
          <ActivityIndicator size="large" color="#E63600" />
          <Text className="mt-4 text-base text-gray-500">Generating your plan...</Text>
        </View>
      ) : error ? (
        <View className="mt-4 p-4 bg-red-50 rounded-xl">
          <Text className="text-red-600">{error}</Text>
        </View>
      )
        // : workoutPlan ? (
        //   <View className="mt-4 p-5 bg-gray-50 rounded-xl max-h-96">
        //     <ScrollView className="max-h-80">
        //       <Text className="text-base text-gray-800 leading-6">{workoutPlan}</Text>
        //     </ScrollView>
        //   </View>
        // ) 
        : (
          <TouchableOpacity
            className="mt-8 bg-[#E63600] rounded-xl px-6 py-4 items-center"
            onPress={() => onGenerateWorkout(false)}
            disabled={isLoading}
          >
            <Text className="text-white font-semibold text-lg">Generate Workout</Text>
          </TouchableOpacity>
        )}
    </View>
  );

  // original one
  const renderStepContent = () => {
    switch (step) {
      case 0:
        return renderWelcome();
      case 1:
        return renderWorkoutType();
      case 2:
        return workoutType === "Single Workout" ? renderMuscleGroups() : renderSettings();
      case 3:
        return workoutType === "Single Workout" ? renderSettings() : renderRoutineDays(); // Updated line
      case 4:
        return workoutType === "Single Workout" ? renderExerciseCount() : renderDifficulty();
      case 5:
        return workoutType === "Single Workout" ? renderRepRange() : renderExerciseCount();
      case 6:
        return workoutType === "Single Workout" ? renderDifficulty() : renderRepRange();
      case 7:
        return workoutType === "Single Workout" ? renderGeneration() : renderGeneration();
      case 8:
        return renderGeneration();
      default:
        return null;
    }
  };

  // const renderStepContent = () => {
  //   switch (step) {
  //     case 0:
  //       return renderWelcome();
  //     case 1:
  //       return renderWorkoutType();
  //     case 2:
  //       return workoutType === "Single Workout" ? renderMuscleGroups() : renderSettings();
  //     case 3:
  //       return workoutType === "Single Workout" ? renderSettings() : renderRoutineDays(); // Updated line
  //     case 4:
  //       return workoutType === "Single Workout" ? renderExerciseCount() : renderDifficulty();
  //     case 5:
  //       return workoutType === "Single Workout" ? renderRepRange() : renderExerciseCount();
  //     case 6:
  //       return workoutType === "Single Workout" ? renderDifficulty() : renderRepRange();
  //     case 7:
  //       return workoutType === "Single Workout" ? renderGeneration() : renderGeneration();
  //     case 8:
  //       return renderGeneration();
  //     default:
  //       return null;
  //   }
  // };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" backgroundColor="white" />
      {step === 0 ? (
        <LinearGradient colors={['#E63600', '#FF8C66']} className="flex-1">
          <ScrollView className="flex-grow">{renderStepContent()}</ScrollView>
        </LinearGradient>
      ) : (
        <>
          <ProgressIndicator currentStep={step} totalSteps={getTotalSteps()} />
          <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
            <ScrollView className="flex-1 pb-4">
              {renderStepContent()}
            </ScrollView>
          </Animated.View>
        </>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
    backgroundColor: '#ffffff',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#222',
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 7,
    color: '#666',
  },
  selectionContainer: {
    marginBottom: 10,
  },
  bodyContainer: {
    backgroundColor: '#f8f9fa',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
    color: '#222',
  },
  bodyWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 160, // Reduced height to match smaller scale
  },
  bodyView: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  viewLabel: {
    marginTop: 8,
    fontSize: 14,
    color: '#777',
    fontWeight: '500',
  },
  nextButton: {
    marginTop: 30,
    backgroundColor: '#E63600',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#E63600',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  nextButtonDisabled: {
    backgroundColor: '#cccccc',
    shadowOpacity: 0,
  },
  nextButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
});


export default CreateAIWorkoutScreen;
