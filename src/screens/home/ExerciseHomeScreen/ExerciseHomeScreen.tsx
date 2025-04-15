import React, { useState, useCallback } from 'react';
import { View, SafeAreaView, Platform, Text } from 'react-native';
import { TabView, TabBar } from 'react-native-tab-view';
import { ExercisesTab } from './ExercisesTab';
import { WorkoutsTab } from './WorkoutsTab';


export const ExerciseHomeScreen: React.FC = () => {
  const [index, setIndex] = useState(0); // default to first tab
  const [routes] = useState([
    { key: 'exercises', title: 'Exercises' },
    { key: 'workouts', title: 'Workouts' },
  ]);

  const renderScene = useCallback(({ route }: { route: { key: string } }) => {
    switch (route.key) {
      case 'exercises':
        return <ExercisesTab />;
      case 'workouts':
        return <WorkoutsTab />;
      default:
        return null;
    }
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top']}>
      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        lazy
        renderLazyPlaceholder={() => (
          <View className="flex-1 items-center justify-center bg-white">
            <Text>Loading...</Text>
          </View>
        )}
        renderTabBar={(props) => (
          <TabBar
            {...props}
            indicatorStyle={{ backgroundColor: '#3B82F6' }}
            style={[
              { backgroundColor: 'white' },
              Platform.OS === 'ios' && { paddingTop: 20 },
            ]}
            labelStyle={{
              color: '#1F2937',
              fontFamily: 'Inter-SemiBold',
              fontSize: 14,
            }}
            activeColor="#3B82F6"
            inactiveColor="#6B7280"
            pressColor="transparent"
          />
        )}
        sceneContainerStyle={{
          paddingTop: Platform.OS === 'ios' ? 16 : 0,
        }}
      />

    </SafeAreaView>
  );
};
