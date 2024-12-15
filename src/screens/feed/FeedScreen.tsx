import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, RefreshControl, StatusBar, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Bell, Search, Dumbbell, Footprints, Apple, PlusCircle, Award, Users } from 'lucide-react-native';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import PostCard from '../../components/feed/PostCard';

const dummyPosts = [
  {
    _id: '1',
    post_id: '1',
    credentials_id: 'dummyId',
    username: 'user1',
    description: 'Morning workout session!',
    image_url: 'https://via.placeholder.com/600',
    post_date: new Date().toISOString(),
    like_count: 10,
    comment_count: 3,
    likes: [
      { like_id: '1', username: 'user2', date: new Date().toISOString() },
      { like_id: '2', username: 'user3', date: new Date().toISOString() },
    ],
    comments: [
      { comment_id: '1', username: 'user2', comment: 'Great session!', comment_date: new Date().toISOString() },
      { comment_id: '2', username: 'user3', comment: 'Keep it up!', comment_date: new Date().toISOString() },
    ],
  },
  {
    _id: '2',
    post_id: '2',
    credentials_id: 'dummyId',
    username: 'user2',
    description: 'Leg day grind!',
    image_url: 'https://via.placeholder.com/600',
    post_date: new Date().toISOString(),
    like_count: 5,
    comment_count: 1,
    likes: [
      { like_id: '3', username: 'user1', date: new Date().toISOString() },
    ],
    comments: [
      { comment_id: '3', username: 'user1', comment: 'Nice work!', comment_date: new Date().toISOString() },
    ],
  },
];

const FeedScreen = () => {
  const navigation = useNavigation();
  const [refreshing, setRefreshing] = useState(false);

  const renderPost = ({ item }) => <PostCard post={item} />;

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  const HeaderComponent = () => (
    <View className="bg-[#E63600] rounded-b-3xl shadow-lg pb-4">
      <View className="flex-row justify-between items-center px-6 py-4" style={{ marginTop: hp(5) }}>
        <View className="flex-row items-center">
          <Image
            source={{ uri: 'https://via.placeholder.com/100' }}
            className="w-10 h-10 rounded-full mr-3"
          />
          <View>
            <Text className="text-xl font-bold text-white">Hi, John!</Text>
            <Text className="text-sm text-white opacity-80">Ready to crush your goals?</Text>
          </View>
        </View>
        <View className="flex-row space-x-4">
          <TouchableOpacity className="bg-white/20 p-2 rounded-full" onPress={() => navigation.navigate('Search')}>
            <Search size={wp(6)} color="white" />
          </TouchableOpacity>
          <TouchableOpacity className="bg-white/20 p-2 rounded-full">
            <Bell size={wp(6)} color="white" />
          </TouchableOpacity>
        </View>
      </View>
      <View className="mx-6 my-4 bg-white/10 rounded-xl p-4">
        <Text className="text-white text-lg font-semibold mb-2">Today's Goal</Text>
        <View className="flex-row justify-between items-center">
          <View className="flex-row items-center">
            <Dumbbell size={wp(6)} color="white" />
            <Text className="text-white ml-2">30 min strength training</Text>
          </View>
          <TouchableOpacity className="bg-white py-1 px-3 rounded-full">
            <Text className="text-[#E63600] font-semibold">Start</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View className="flex-row justify-around mt-2">
        <CategoryButton icon={<Award size={wp(6)} color="#E63600" />} label="Challenges" />
        <CategoryButton icon={<Users size={wp(6)} color="#E63600" />} label="Community" />
        <CategoryButton icon={<Apple size={wp(6)} color="#E63600" />} label="Nutrition" />
      </View>
    </View>
  );

  const CategoryButton = ({ icon, label }) => (
    <TouchableOpacity className="items-center">
      <View className="bg-white p-3 rounded-2xl shadow-md">
        {icon}
      </View>
      <Text className="text-sm mt-2 font-semibold text-white">{label}</Text>
    </TouchableOpacity>
  );

  return (
    <View className="flex-1 bg-gray-50">
      <StatusBar barStyle="light-content" />
      <FlatList
        data={dummyPosts}
        renderItem={renderPost}
        keyExtractor={(item) => item.post_id.toString()}
        ListHeaderComponent={HeaderComponent}
        contentContainerStyle={{ paddingBottom: hp(10) }}
        onEndReached={() => {}}
        onEndReachedThreshold={0.5}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#E63600"
            title="Pull to refresh..."
            titleColor="#E63600"
          />
        }
      />

      <TouchableOpacity
        className="absolute bottom-5 right-5 bg-[#E63600] p-4 rounded-full shadow-lg"
        onPress={() => navigation.navigate('NewPost')}
      >
        <PlusCircle size={wp(8)} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};

export default FeedScreen;

