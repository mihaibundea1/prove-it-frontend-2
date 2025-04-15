import React, { useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Dimensions } from 'react-native';

interface WeeklyCalendarProps {
  onDatePressed: (date: Date) => void;
  // Add this prop to receive workout dates
  workoutDates?: string[]; // Array of date strings in 'YYYY-MM-DD' format
}

const screenWidth = Dimensions.get('window').width;
const NUMBER_OF_WEEKS = 105; // 52 weeks before, current week, and 52 after
const CURRENT_WEEK_INDEX = 52; // current week at the middle of the list

const WeeklyCalendar: React.FC<WeeklyCalendarProps> = ({ onDatePressed, workoutDates = [] }) => {
  const flatListRef = useRef<FlatList<number>>(null);
  const weeks = Array.from({ length: NUMBER_OF_WEEKS }, (_, i) => i);

  // FIXED: Format date to YYYY-MM-DD in LOCAL timezone, not UTC
  const formatDateString = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Helper: Check if a date has workouts
  const hasWorkoutsOnDate = (date: Date): boolean => {
    const dateString = formatDateString(date);
    return workoutDates.includes(dateString);
  };

  // Helper: get the start of the week for a given date (Sunday as the first day)
  const getStartOfWeek = (date: Date): Date => {
    const d = new Date(date);
    const day = d.getDay();
    d.setDate(d.getDate() - day);
    d.setHours(0, 0, 0, 0);
    return d;
  };

  // Helper: add weeks to a date
  const addWeeks = (date: Date, weeks: number): Date => {
    const newDate = new Date(date);
    newDate.setDate(newDate.getDate() + weeks * 7);
    return newDate;
  };

  // Render one week page.
  const renderWeek = ({ index }: { index: number; item: number }) => {
    // Calculate week offset relative to the current week.
    const weekOffset = index - CURRENT_WEEK_INDEX;
    const weekStart = addWeeks(getStartOfWeek(new Date()), weekOffset);
    const weekDates: Date[] = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(weekStart);
      day.setDate(weekStart.getDate() + i);
      weekDates.push(day);
    }

    // Calculate the month names for the week.
    const monthNames = weekDates.map(date =>
      date.toLocaleDateString('en-US', { month: 'long' })
    );
    const uniqueMonths = Array.from(new Set(monthNames));

    // Determine today's date (zeroing out time)
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return (
      <View style={[styles.weekContainer, { width: screenWidth }]}>
        <View style={styles.monthContainer}>
          <Text style={styles.monthText}>
            {uniqueMonths.join(' / ')}
          </Text>
        </View>
        <View style={styles.weekDaysContainer}>
          {weekDates.map((date, idx) => {
            const isToday = date.getTime() === today.getTime();
            const hasWorkout = hasWorkoutsOnDate(date);
            // For debugging
            if(hasWorkout) {
            }
            return (
              <TouchableOpacity
                key={date.toISOString()} // Use date.toISOString() for a unique and consistent key
                style={[
                  styles.dayContainer, 
                  isToday && styles.currentDayContainer,
                  !isToday && hasWorkout && styles.dayContainer, // Apply workout style if it's not today
                ]}
                onPress={() => onDatePressed(date)}
              >
                <Text 
                  style={[
                    styles.dayText, 
                    isToday && styles.currentDayText,
                    !isToday && hasWorkout && styles.dayText,
                  ]}
                >
                  {date.toLocaleDateString('en-US', { weekday: 'short' })}
                </Text>
                <Text 
                  style={[
                    styles.dateText, 
                    isToday && styles.currentDayText,
                    !isToday && hasWorkout && styles.dayText,
                  ]}
                >
                  {date.getDate()}
                </Text>
            
                {/* Optional: Add indicator dot for days with workouts */}
                {hasWorkout && !isToday && <View style={styles.workoutIndicator} />}
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={weeks}
        horizontal
        pagingEnabled
        initialScrollIndex={CURRENT_WEEK_INDEX}
        getItemLayout={(_, index) => ({
          length: screenWidth,
          offset: screenWidth * index,
          index,
        })}
        showsHorizontalScrollIndicator={false}
        renderItem={renderWeek}
        keyExtractor={(item) => item.toString()}
      />
    </View>
  );
};

export default WeeklyCalendar;

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
  },
  weekContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  monthContainer: {
    marginBottom: 5,
    alignItems: 'center',
  },
  monthText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '600',
  },
  weekDaysContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    paddingHorizontal: 10,
  },
  dayContainer: {
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 5,
    borderRadius: 25,
  },
  dayText: {
    fontSize: 14,
    color: '#555',
  },
  dateText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#555',
    marginTop: 4,
  },
  currentDayContainer: {
    backgroundColor: '#ee4444',
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  currentDayText: {
    color: '#fff',
    fontWeight: '600',
  },
  // Add these new styles for workout days
  // workoutDayContainer: {
  //   backgroundColor: '#4287f5', // Blue color for workout days
  //   paddingVertical: 10,
  //   paddingHorizontal: 15,
  // },
  // workoutDayText: {
  //   color: '#fff',
  //   fontWeight: '600',
  // },
  // Optional dot indicator style
  workoutIndicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#ee4444',
    marginTop: 2,
  },
});