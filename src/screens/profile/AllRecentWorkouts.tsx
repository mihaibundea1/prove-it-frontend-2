import type React from "react"
import { 
  View, 
  Text, 
  FlatList, 
  TouchableOpacity, 
  StatusBar,
  ActivityIndicator,
  ScrollView
} from "react-native"
import { type RouteProp, useRoute, useNavigation } from "@react-navigation/native"
import type { CompletedWorkout } from "@/services/api/endpoints/workout/types/workout.types"
import { useMemo, useState } from "react"
import { LinearGradient } from "expo-linear-gradient"
import { Workout } from "@/types/workout.types"
import { NativeStackNavigationProp } from "@react-navigation/native-stack"
import { HomeStackParamList } from "@/navigation/types/navigationTypes"
import { ProfileStackParamList } from "@/navigation/types/navigationTypes"


type RouteParams = {
  workouts: CompletedWorkout[]
  isMyProfile: boolean
}

// Enhanced muscle group emoji mapping
const getMuscleGroupEmoji = (muscleGroups?: string[]) => {
  if (!muscleGroups || muscleGroups.length === 0) return "🏋️‍♂️"

  const primaryMuscle = muscleGroups[0].toLowerCase()
  if (primaryMuscle.includes("chest")) return "💪"
  if (primaryMuscle.includes("back")) return "🔙"
  if (primaryMuscle.includes("leg")) return "🦵"
  if (primaryMuscle.includes("arm") || primaryMuscle.includes("bicep") || primaryMuscle.includes("tricep")) return "💪"
  if (primaryMuscle.includes("shoulder")) return "🏋️‍♂️"
  if (primaryMuscle.includes("core") || primaryMuscle.includes("abs")) return "🔥"
  return "🏋️‍♂️"
}

// Format duration from seconds to minutes:seconds format
const formatDuration = (seconds?: number) => {
  if (!seconds) return "0 min"
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  return minutes > 0 
    ? `${minutes}:${remainingSeconds.toString().padStart(2, '0')} min`
    : `${seconds} sec`
}

// Color utility for workout intensity
const getIntensityColor = (volume?: number, duration?: number) => {
  if (!volume || !duration) return ["#FFB577", "#F76E11"]
  
  // Calculate intensity (simple volume/duration ratio)
  const intensity = volume / (duration / 60)
  
  if (intensity > 100) return ["#FD3555", "#E63600"] // High intensity
  if (intensity > 50) return ["#F76E11", "#FF9A5A"]  // Medium intensity
  return ["#FFB577", "#FFCFA3"]                     // Low intensity
}

// Calculate days ago
const getDaysAgo = (dateString?: string) => {
  if (!dateString) return ""
  const workoutDate = new Date(dateString)
  const today = new Date()
  
  const diffTime = today.getTime() - workoutDate.getTime()
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
  
  if (diffDays === 0) return "Today"
  if (diffDays === 1) return "Yesterday"
  return `${diffDays} days ago`
}

const AllRecentWorkouts: React.FC = () => {
  const route = useRoute<RouteProp<{ params: RouteParams }, "params">>()
  const navigation = useNavigation<NativeStackNavigationProp<ProfileStackParamList>>();
  const { workouts } = route.params
  const isMyProfile = route.params
  const [filter, setFilter] = useState<string | null>(null)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [sortOption, setSortOption] = useState<'recent' | 'duration' | 'volume'>('recent')

  // Format date to a more readable format
  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A"
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    })
  }

  // Get time from date
  const formatTime = (dateString?: string) => {
    if (!dateString) return ""
    const date = new Date(dateString)
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    })
  }

  // Group workouts by week and apply sorting and filtering
  const groupedWorkouts = useMemo(() => {
    // Apply filtering first
    const filtered = filter 
      ? [...workouts].filter(workout => 
          workout.muscleGroups?.some(group => 
            group.toLowerCase().includes(filter.toLowerCase())
          )
        )
      : [...workouts]
    
    // Then apply sorting
    let sorted = filtered
    
    switch (sortOption) {
      case 'recent':
        sorted = sorted.sort(
          (a, b) => new Date(b.end_date_time || 0).getTime() - new Date(a.end_date_time || 0).getTime()
        )
        break
      case 'duration':
        sorted = sorted.sort(
          (a, b) => (b.duration || 0) - (a.duration || 0)
        )
        break
      case 'volume':
        sorted = sorted.sort(
          (a, b) => (b.volume || 0) - (a.volume || 0)
        )
        break
    }
      
    return sorted
  }, [workouts, filter, sortOption])


  // Simulate refresh
  const handleRefresh = () => {
    setIsRefreshing(true)
    setTimeout(() => setIsRefreshing(false), 1500)
  }


  return (
    <View className="flex-1 bg-gray-50">
      <StatusBar barStyle="dark-content" />
      
      {/* Enhanced Header with back button */}
      <View className="px-5 pt-12 pb-4 bg-white border-b border-gray-100">
        
        {/* Summary stats with workout count improvement */}
        <View className="flex-row justify-between mb-4">
          <View className="items-center">
            <Text className="text-gray-500 text-xs">TOTAL</Text>
            <View className="flex-row items-center">
              <Text className="text-xl font-bold text-gray-900">{workouts.length}</Text>
              <Text className="text-xs text-gray-500 ml-1">workout{workouts.length !== 1 ? "s" : ""}</Text>
            </View>
          </View>
          <View className="items-center">
            <Text className="text-gray-500 text-xs">THIS WEEK</Text>
            <View className="flex-row items-center">
              <Text className="text-xl font-bold text-gray-900">
                {workouts.filter(w => {
                  const date = new Date(w.end_date_time || 0)
                  const now = new Date()
                  const weekStart = new Date(now.setDate(now.getDate() - 7))
                  return date >= weekStart
                }).length}
              </Text>
              <Text className="text-xs text-gray-500 ml-1">sessions</Text>
            </View>
          </View>
          <View className="items-center">
            <Text className="text-gray-500 text-xs">AVG DURATION</Text>
            <View className="flex-row items-center">
              <Text className="text-xl font-bold text-gray-900">
                {Math.round(workouts.reduce((sum, w) => sum + (w.duration || 0), 0) / (workouts.length || 1) / 60)}
              </Text>
              <Text className="text-xs text-gray-500 ml-1">min</Text>
            </View>
          </View>
        </View>
        
        
      </View>

      {groupedWorkouts.length > 0 ? (
        <FlatList
          data={groupedWorkouts}
          keyExtractor={(item, index) => item._id ?? `workout-${index}`}
          contentContainerClassName="px-4 py-4"
          ItemSeparatorComponent={() => <View className="h-4" />}
          showsVerticalScrollIndicator={false}
          refreshing={isRefreshing}
          onRefresh={handleRefresh}
        
          renderItem={({ item }) => (
            <TouchableOpacity 
              activeOpacity={0.92}
              className="overflow-hidden"
            >
              <View className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
                {/* Enhanced date section with improved layout */}
                <View className="px-4 py-3 bg-white flex-row justify-between items-center border-b border-gray-100">
                  <View className="flex-row items-center">
                    <View className="w-8 h-8 rounded-full bg-gray-100 items-center justify-center mr-2">
                      <Text>{getMuscleGroupEmoji(item.muscleGroups)}</Text>
                    </View>
                    <View>
                      <Text className="font-semibold text-gray-900">{formatDate(item.end_date_time)}</Text>
                      <Text className="text-xs text-gray-500">{getDaysAgo(item.end_date_time)}</Text>
                    </View>
                  </View>
                  <View className="items-end">
                    <Text className="text-sm font-medium text-gray-700">{formatTime(item.start_date_time)}</Text>
                    <Text className="text-xs text-gray-500">
                      {formatDuration(item.duration)}
                    </Text>
                  </View>
                </View>

                {/* Workout details with enhanced visual design */}
                <View className="p-4">
                  <Text className="text-lg font-bold text-gray-900 mb-3">{item.routineName}</Text>

                  {/* Enhanced stats row with gradient background */}
                  <View className="mb-3 rounded-xl overflow-hidden">
                    <LinearGradient
                      colors={getIntensityColor(item.volume, item.duration) as any}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      className="p-0.5"
                    >
                      <View className="bg-white rounded-lg p-3 flex-row">
                        <View className="flex-1 items-center">
                          <Text className="text-xs font-medium text-gray-500 mb-1">VOLUME</Text>
                          <Text className="text-base font-semibold text-gray-900">{item.volume || 0}</Text>
                          <Text className="text-xs text-gray-500">cal</Text>
                        </View>

                        <View className="h-full w-px bg-gray-200" />

                        <View className="flex-1 items-center">
                          <Text className="text-xs font-medium text-gray-500 mb-1">DURATION</Text>
                          <Text className="text-base font-semibold text-gray-900">
                            {Math.floor((item.duration || 0) / 60)}
                          </Text>
                          <Text className="text-xs text-gray-500">min</Text>
                        </View>

                        <View className="h-full w-px bg-gray-200" />

                        <View className="flex-1 items-center">
                          <Text className="text-xs font-medium text-gray-500 mb-1">SETS</Text>
                          <Text className="text-base font-semibold text-gray-900">{item.sets || 0}</Text>
                          <Text className="text-xs text-gray-500">total</Text>
                        </View>
                      </View>
                    </LinearGradient>
                  </View>

                  {/* Enhanced exercise count with improved button */}
                  {item.exercises && (
                    <View className="flex-row items-center justify-between">
                      <View className="flex-row items-center">
                        <View className="w-7 h-7 rounded-full bg-gray-100 items-center justify-center mr-2">
                          <Text className="text-xs">🏋️</Text>
                        </View>
                        <Text className="text-gray-700">
                          {item.exercises.length} Exercise{item.exercises.length !== 1 ? "s" : ""}
                        </Text>
                      </View>

                      <TouchableOpacity 
                        className="py-2 px-5 rounded-full" 
                        activeOpacity={0.8}
                        onPress={() => navigation.navigate("WorkoutDetailsScreen", { 
                          workout: item, 
                          previousScreen: isMyProfile ? "MyRecentActivity" : "OthersRecentActivity" 
                        })}
                        
                      >
                        <LinearGradient
                          colors={["#F76E11", "#E63600"]}
                          start={{ x: 0, y: 0 }}
                          end={{ x: 1, y: 0 }}
                          className="absolute top-0 left-0 right-0 bottom-0 rounded-full"
                        />
                        <Text className="text-white font-medium">Details</Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              </View>
            </TouchableOpacity>
          )}
        />
      ) : (
        <View className="flex-1 items-center justify-center p-6">
          <View className="w-20 h-20 rounded-full bg-gray-100 items-center justify-center mb-4">
            <Text className="text-3xl">🏋️</Text>
          </View>
          <Text className="text-gray-900 text-xl font-semibold mb-2">No workouts yet</Text>
          <Text className="text-gray-500 text-center">Track your progress by completing your first workout</Text>
          
          <TouchableOpacity 
            className="mt-6 rounded-full overflow-hidden" 
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={["#F76E11", "#E63600"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              className="py-3.5 px-7"
            >
              <Text className="text-white font-semibold">Start a Workout</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      )}
    </View>
  )
}

export default AllRecentWorkouts