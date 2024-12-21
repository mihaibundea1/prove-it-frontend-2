import { useState } from "react";
import { View, Text, TouchableOpacity  } from "react-native";


const MonthlyHabitTracker = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [completedDays, setCompletedDays] = useState<{[key: string]: boolean}>({});

  // Generate days for the current month
  const generateDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    return Array.from({ length: daysInMonth }, (_, i) => new Date(year, month, i + 1));
  };

  const toggleDayCompletion = (day: Date) => {
    const key = day.toISOString().split('T')[0];
    setCompletedDays(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const monthDays = generateDaysInMonth(currentDate);

  const calculateStreak = () => {
    const sortedCompletedDays = Object.keys(completedDays)
      .filter(day => completedDays[day])
      .sort();
    
    let maxStreak = 0;
    let currentStreak = 0;
    let lastDay: Date | null = null;

    sortedCompletedDays.forEach(dayStr => {
      const day = new Date(dayStr);
      
      if (!lastDay) {
        currentStreak = 1;
      } else {
        const diffDays = Math.floor((day.getTime() - lastDay.getTime()) / (1000 * 3600 * 24));
        
        if (diffDays === 1) {
          currentStreak++;
        } else if (diffDays > 1) {
          currentStreak = 1;
        }
      }

      maxStreak = Math.max(maxStreak, currentStreak);
      lastDay = day;
    });

    return maxStreak;
  };

  return (
    <View className="bg-gray-100 rounded-lg p-4 mt-4">
      <View className="flex-row justify-between items-center mb-4">
        <View>
          <Text className="text-lg font-bold text-black">Monthly Workouts</Text>
          <Text className="text-gray-500">Your fitness journey</Text>
        </View>
        <View>
          <Text className="text-[#e63600] font-bold text-lg">
            {calculateStreak()} Day Streak
          </Text>
        </View>
      </View>

      <View className="flex-row flex-wrap">
        {monthDays.slice(0, 15).map((day) => {
          const key = day.toISOString().split('T')[0];
          const isCompleted = completedDays[key];
          const isPastDate = day < new Date(new Date().setHours(0,0,0,0));

          return (
            <TouchableOpacity
              key={key}
              onPress={() => {
                if (isPastDate) {
                  toggleDayCompletion(day);
                }
              }}
              className={`w-8 h-8 m-1 rounded-lg items-center justify-center 
                ${isCompleted ? 'bg-[#e63600]' : 
                  (isPastDate ? 'bg-gray-200' : 'bg-gray-100')}`}
            >
              <Text className={`text-xs 
                ${isCompleted ? 'text-white' : 
                  (isPastDate ? 'text-black' : 'text-gray-400')}`}>
                {day.getDate()}
              </Text>
            </TouchableOpacity>
          );
        })}
        <TouchableOpacity className="w-8 h-8 m-1 rounded-lg items-center justify-center bg-gray-200">
          <Text className="text-xs text-black">...</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default MonthlyHabitTracker;