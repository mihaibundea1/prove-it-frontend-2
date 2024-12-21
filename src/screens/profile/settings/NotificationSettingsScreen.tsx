import React, { useState } from 'react';
import { View, Text, Switch, ScrollView, TouchableOpacity } from 'react-native';
import { Bell, MessageCircle, Calendar, Activity, Award } from 'lucide-react-native';

const NotificationSettingsScreen = () => {
  const [notifications, setNotifications] = useState({
    pushNotifications: true,
    emailNotifications: true,
    workoutReminders: true,
    newMessages: true,
    friendActivity: true,
    achievements: true,
  });

  const toggleSwitch = (key: keyof typeof notifications) => {
    setNotifications(prevState => ({
      ...prevState,
      [key]: !prevState[key]
    }));
  };

  const NotificationItem = ({ icon, title, description, value, onValueChange }: {
    icon: React.ReactNode,
    title: string,
    description: string,
    value: boolean,
    onValueChange: () => void
  }) => (
    <View className="flex-row items-center justify-between py-4 border-b border-gray-200">
      <View className="flex-row items-center flex-1">
        <View className="bg-gray-100 p-2 rounded-full mr-4">
          {icon}
        </View>
        <View className="flex-1">
          <Text className="text-black font-semibold">{title}</Text>
          <Text className="text-gray-500 text-sm">{description}</Text>
        </View>
      </View>
      <Switch
        trackColor={{ false: "#767577", true: "#e63600" }}
        thumbColor={value ? "#fff" : "#f4f3f4"}
        ios_backgroundColor="#3e3e3e"
        onValueChange={onValueChange}
        value={value}
      />
    </View>
  );

  const saveSettings = () => {
    // Implement the logic to save notification settings
    console.log('Saving notification settings:', notifications);
  };

  return (
    <ScrollView className="flex-1 bg-white">
      <View className="p-4">
        
        <NotificationItem
          icon={<Bell color="#e63600" size={24} />}
          title="Push Notifications"
          description="Receive push notifications on your device"
          value={notifications.pushNotifications}
          onValueChange={() => toggleSwitch('pushNotifications')}
        />

        <NotificationItem
          icon={<MessageCircle color="#e63600" size={24} />}
          title="Email Notifications"
          description="Receive notifications via email"
          value={notifications.emailNotifications}
          onValueChange={() => toggleSwitch('emailNotifications')}
        />

        <NotificationItem
          icon={<Calendar color="#e63600" size={24} />}
          title="Workout Reminders"
          description="Get reminders for scheduled workouts"
          value={notifications.workoutReminders}
          onValueChange={() => toggleSwitch('workoutReminders')}
        />

        <NotificationItem
          icon={<MessageCircle color="#e63600" size={24} />}
          title="New Messages"
          description="Be notified when you receive new messages"
          value={notifications.newMessages}
          onValueChange={() => toggleSwitch('newMessages')}
        />

        <NotificationItem
          icon={<Activity color="#e63600" size={24} />}
          title="Friend Activity"
          description="See updates on your friends' activities"
          value={notifications.friendActivity}
          onValueChange={() => toggleSwitch('friendActivity')}
        />

        <NotificationItem
          icon={<Award color="#e63600" size={24} />}
          title="Achievements"
          description="Get notified about your new achievements"
          value={notifications.achievements}
          onValueChange={() => toggleSwitch('achievements')}
        />

        <TouchableOpacity
          onPress={saveSettings}
          className="bg-[#e63600] py-3 px-6 rounded-lg items-center mt-6"
        >
          <Text className="text-white font-bold text-lg">Save Preferences</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default NotificationSettingsScreen;
