import React, { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  Animated,
  Platform,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  StatusBar,
} from 'react-native';
import Modal from 'react-native-modal';
import { Calendar } from 'react-native-calendars';
import { ChevronDown, Clock, Calendar as CalendarIcon } from 'lucide-react-native';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const isIOS = Platform.OS === 'ios';

// Define constants for pickers:
const PICKER_CONTAINER_HEIGHT = 240;
const ITEM_HEIGHT = hp('8%'); // Using percentage-based height for each scroll item
const PICKER_PADDING = (PICKER_CONTAINER_HEIGHT - ITEM_HEIGHT) / 2;

// Helper: Format a Date to "YYYY-MM-DD" in local time.
const formatDateToLocalString = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // getMonth is zero-based.
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#ffffff',
    paddingTop: isIOS ? 0 : StatusBar.currentHeight,
  },
  container: {
    flex: 1,
    paddingHorizontal: SCREEN_WIDTH * 0.06,
    paddingTop: isIOS ? 40 : 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  headerText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000',
  },
  closeButton: {
    padding: 16,
  },
  tabContainer: {
    flexDirection: 'row',
    height: 56,
    backgroundColor: '#f3f4f6',
    borderRadius: 16,
    padding: 6,
    marginBottom: 16,
  },
  tabButton: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabText: {
    fontSize: 16,
    marginLeft: 4,
  },
  contentContainer: {
    flex: 1,
  },
  selectedDateContainer: {
    padding: 16,
    marginTop: 16,
    backgroundColor: '#f3f4f6',
    borderRadius: 12,
    alignItems: 'center',
  },
  selectedDateLabel: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 4,
  },
  selectedDateText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  timeHeader: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
    textAlign: 'center',
    marginBottom: 16,
  },
  timeDisplayContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    backgroundColor: '#f3f4f6',
    height: 56,
    borderRadius: 12,
  },
  timeDisplayText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
  },
  pickerRow: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  pickerContainer: {
    height: PICKER_CONTAINER_HEIGHT,
    width: 80,
    overflow: 'hidden',
  },
  pickerItem: {
    height: ITEM_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  pickerItemSelected: {
    backgroundColor: '#ee4444',
    borderRadius: 8,
  },
  pickerItemText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
  },
  pickerItemTextSelected: {
    color: '#fff',
  },
  confirmButtonContainer: {
    position: 'absolute',
    bottom: hp('4%'),
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  confirmButton: {
    backgroundColor: '#ee4444',
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 24,
    width: '90%',
    alignItems: 'center',
    elevation: 5, // Adds shadow effect on Android
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  confirmButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
});

interface ScheduleWorkoutModalProps {
  isVisible: boolean;
  initialDate: Date;
  onConfirmSchedule: (utcDateTime: string) => void;
  onClose: () => void;
}

const ScheduleWorkoutModal: React.FC<ScheduleWorkoutModalProps> = ({
  isVisible,
  initialDate,
  onConfirmSchedule,
  onClose,
}) => {
  // Manage ALL date/time state internally
  const [selectedDate, setSelectedDate] = useState(new Date(initialDate));
  const [selectedHour, setSelectedHour] = useState(() => {
    const hour = initialDate.getHours() % 12 || 12;
    return hour;
  });
  const [selectedMinute, setSelectedMinute] = useState(initialDate.getMinutes());
  const [selectedPeriod, setSelectedPeriod] = useState(initialDate.getHours() < 12 ? 'AM' : 'PM');
  const [activeTab, setActiveTab] = useState<'date' | 'time'>('date');
  const tabAnimation = useState(new Animated.Value(0))[0];
  const [tabContainerWidth, setTabContainerWidth] = useState(0);

  // Use local formatted date for Calendar.
  const calendarDate = formatDateToLocalString(selectedDate);

  // Define arrays for each wheel:
  const hours = useMemo(
    () =>
      Array.from({ length: 12 }, (_, i) => ({
        value: i + 1,
        display: (i + 1).toString().padStart(2, '0'),
      })),
    []
  );
  const minutes = useMemo(
    () =>
      Array.from({ length: 60 }, (_, i) => ({
        value: i,
        display: i.toString().padStart(2, '0'),
      })),
    []
  );
  const periods = useMemo(
    () => [
      { value: 'AM', display: 'AM' },
      { value: 'PM', display: 'PM' },
    ],
    []
  );

  // Helper: Combine the selected calendar date and time, then convert to UTC ISO string.
  const getUTCDateTime = useCallback(() => {
  const date = new Date(selectedDate);
  let hours = selectedHour;
  if (selectedPeriod === 'PM' && hours !== 12) hours += 12;
  if (selectedPeriod === 'AM' && hours === 12) hours = 0;

  // Set the selected time in the local time zone
  date.setHours(hours, selectedMinute, 0, 0);

  // Convert to UTC using .toISOString()
  return date.toISOString();
}, [selectedDate, selectedHour, selectedMinute, selectedPeriod]);

  // Refs for programmatic scrolling
  const hourScrollRef = useRef<ScrollView>(null);
  const minuteScrollRef = useRef<ScrollView>(null);
  const periodScrollRef = useRef<ScrollView>(null);

  useEffect(() => {
    if (isVisible) {
      setTimeout(() => {
        // Ensures it runs after modal is fully rendered
        hourScrollRef.current?.scrollTo({ y: (selectedHour - 1) * ITEM_HEIGHT, animated: false });
        minuteScrollRef.current?.scrollTo({ y: selectedMinute * ITEM_HEIGHT, animated: false });
        periodScrollRef.current?.scrollTo({ y: (selectedPeriod === 'AM' ? 0 : 1) * ITEM_HEIGHT, animated: false });
      }, 100);
    }
  }, [isVisible, selectedHour, selectedMinute, selectedPeriod]);

  // Helper to align a picker exactly to the computed offset
  const alignScroll = (scrollRef: React.RefObject<ScrollView>, index: number) => {
    scrollRef.current?.scrollTo({ y: index * ITEM_HEIGHT, animated: true });
  };

  // Snap handlers for each scroll wheel:
  const onHourMomentumScrollEnd = useCallback(
    (event: any) => {
      const y = event.nativeEvent.contentOffset.y;
      const index = Math.round(y / ITEM_HEIGHT);
      alignScroll(hourScrollRef, index);
      setSelectedHour(hours[index].value);
    },
    [hours]
  );

  const onMinuteMomentumScrollEnd = useCallback(
    (event: any) => {
      const y = event.nativeEvent.contentOffset.y;
      const index = Math.round(y / ITEM_HEIGHT);
      alignScroll(minuteScrollRef, index);
      setSelectedMinute(minutes[index].value);
    },
    [minutes]
  );

  const onPeriodMomentumScrollEnd = useCallback(
    (event: any) => {
      const y = event.nativeEvent.contentOffset.y;
      const index = Math.round(y / ITEM_HEIGHT);
      alignScroll(periodScrollRef, index);
      setSelectedPeriod(periods[index].value);
    },
    [periods]
  );

  // Tab switching animation
  const switchTab = useCallback(
    (tab: 'date' | 'time') => {
      setActiveTab(tab);
      Animated.timing(tabAnimation, {
        toValue: tab === 'date' ? 0 : 1,
        duration: 300,
        useNativeDriver: false,
      }).start();
    },
    [tabAnimation]
  );

  const formattedTime = useMemo(() => {
    const displayHour = selectedHour;
    const displayMinute = selectedMinute.toString().padStart(2, '0');
    return `${displayHour}:${displayMinute} ${selectedPeriod}`;
  }, [selectedHour, selectedMinute, selectedPeriod]);

  const handleConfirm = () => {
    onConfirmSchedule(getUTCDateTime());
    onClose();
  };

  return (
    <Modal
      isVisible={isVisible}
      onBackdropPress={onClose}
      style={{ margin: 0 }}
      animationIn="slideInUp"
      animationOut="slideOutDown"
      backdropTransitionOutTiming={0}
    >
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          {/* Simplified Header */}
          <View style={styles.header}>
            <Text style={styles.headerText}>Schedule Workout</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <ChevronDown size={30} color="#2D2D2D" />
            </TouchableOpacity>
          </View>

          {/* Tab Selector */}
          <View
            onLayout={(e) => setTabContainerWidth(e.nativeEvent.layout.width)}
            style={styles.tabContainer}
          >
            <TouchableOpacity style={styles.tabButton} onPress={() => switchTab('date')}>
              <CalendarIcon size={18} color={activeTab === 'date' ? '#ee4444' : '#888'} />
              <Text
                style={[
                  styles.tabText,
                  { fontWeight: activeTab === 'date' ? '600' : '400', color: activeTab === 'date' ? '#ee4444' : '#888' },
                ]}
              >
                Date
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.tabButton} onPress={() => switchTab('time')}>
              <Clock size={18} color={activeTab === 'time' ? '#ee4444' : '#888'} />
              <Text
                style={[
                  styles.tabText,
                  { fontWeight: activeTab === 'time' ? '600' : '400', color: activeTab === 'time' ? '#ee4444' : '#888' },
                ]}
              >
                Time
              </Text>
            </TouchableOpacity>
          </View>

          {activeTab === 'date' ? (
            <View style={styles.contentContainer}>
              <Calendar
                current={calendarDate}
                onDayPress={(day: any) => {
                  const newDate = new Date(day.dateString);
                  setSelectedDate(newDate);
                  switchTab('time');
                }}
                markedDates={{
                  [calendarDate]: {
                    selected: true,
                    selectedColor: '#ee4444',
                  },
                }}
                theme={{
                  calendarBackground: '#fff',
                  selectedDayBackgroundColor: '#ee4444',
                  todayTextColor: '#ee4444',
                  arrowColor: '#ee4444',
                  textDayFontSize: 16,
                  textMonthFontSize: 16,
                  textDayHeaderFontSize: 14,
                  'stylesheet.day.basic': {
                    base: {
                      width: 40,
                      height: 40,
                      alignItems: 'center',
                      justifyContent: 'center',
                    },
                  },
                }}
              />
              <View style={styles.selectedDateContainer}>
                <Text style={styles.selectedDateLabel}>Selected Date:</Text>
                <Text style={styles.selectedDateText}>
                  {selectedDate.toLocaleDateString(undefined, {
                    weekday: 'long',
                    month: 'long',
                    day: 'numeric',
                  })}
                </Text>
              </View>
            </View>
          ) : (
            <View style={styles.contentContainer}>
              <Text style={styles.timeHeader}>Select Time</Text>
              <View style={styles.timeDisplayContainer}>
                <Text style={styles.timeDisplayText}>{formattedTime}</Text>
              </View>
              <View style={styles.pickerRow}>
                {/* Hours Wheel */}
                <View style={styles.pickerContainer}>
                  <ScrollView
                    ref={hourScrollRef}
                    contentContainerStyle={{ paddingVertical: PICKER_PADDING }}
                    showsVerticalScrollIndicator={false}
                    snapToInterval={ITEM_HEIGHT}
                    decelerationRate="fast"
                    snapToAlignment="center"
                    onMomentumScrollEnd={onHourMomentumScrollEnd}
                  >
                    {hours.map((hour) => (
                      <View
                        key={`hour-${hour.value}`}
                        style={[
                          styles.pickerItem,
                          selectedHour === hour.value && styles.pickerItemSelected,
                        ]}
                      >
                        <Text
                          style={[
                            styles.pickerItemText,
                            selectedHour === hour.value && styles.pickerItemTextSelected,
                          ]}
                        >
                          {hour.display}
                        </Text>
                      </View>
                    ))}
                  </ScrollView>
                </View>
                {/* Minutes Wheel */}
                <View style={styles.pickerContainer}>
                  <ScrollView
                    ref={minuteScrollRef}
                    contentContainerStyle={{ paddingVertical: PICKER_PADDING }}
                    showsVerticalScrollIndicator={false}
                    snapToInterval={ITEM_HEIGHT}
                    decelerationRate="fast"
                    snapToAlignment="center"
                    onMomentumScrollEnd={onMinuteMomentumScrollEnd}
                  >
                    {minutes.map((minute) => (
                      <View
                        key={`minute-${minute.value}`}
                        style={[
                          styles.pickerItem,
                          selectedMinute === minute.value && styles.pickerItemSelected,
                        ]}
                      >
                        <Text
                          style={[
                            styles.pickerItemText,
                            selectedMinute === minute.value && styles.pickerItemTextSelected,
                          ]}
                        >
                          {minute.display}
                        </Text>
                      </View>
                    ))}
                  </ScrollView>
                </View>
                {/* Period Wheel */}
                <View style={styles.pickerContainer}>
                  <ScrollView
                    ref={periodScrollRef}
                    contentContainerStyle={{ paddingVertical: PICKER_PADDING }}
                    showsVerticalScrollIndicator={false}
                    snapToInterval={ITEM_HEIGHT}
                    decelerationRate="fast"
                    snapToAlignment="center"
                    onMomentumScrollEnd={onPeriodMomentumScrollEnd}
                  >
                    {periods.map((period) => (
                      <View
                        key={`period-${period.value}`}
                        style={[
                          styles.pickerItem,
                          selectedPeriod === period.value && styles.pickerItemSelected,
                        ]}
                      >
                        <Text
                          style={[
                            styles.pickerItemText,
                            selectedPeriod === period.value && styles.pickerItemTextSelected,
                          ]}
                        >
                          {period.display}
                        </Text>
                      </View>
                    ))}
                  </ScrollView>
                </View>
              </View>
            </View>
          )}

          <View style={styles.confirmButtonContainer}>
            <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm}>
              <Text style={styles.confirmButtonText}>Confirm Schedule</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

export default ScheduleWorkoutModal;