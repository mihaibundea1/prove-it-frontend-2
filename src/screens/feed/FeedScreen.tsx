import React, { useState, useCallback, useEffect } from 'react';
import { 
  View, Text, FlatList, TouchableOpacity, RefreshControl, StatusBar, 
  Image, ActivityIndicator, Animated 
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Bell, Search, PlusCircle, Filter } from 'lucide-react-native';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import PostCard from '../../components/feed/PostCard';
import { useFeed } from '@/contexts/FeedContext';
import { Post } from '../../types/feed.types';
import { LinearGradient } from 'expo-linear-gradient';
import LoadingOverlay from '@/components/shared/LoadingOverlay';

const FeedScreen = () => {
  const navigation = useNavigation();
  const { posts, fetchPosts } = useFeed();
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState('All');
  
  // Animation value for the FAB
  const fadeAnim = React.useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Fetch posts when component mounts
    const loadPosts = async () => {
      setLoading(true);
      await fetchPosts();
      setLoading(false);
      
      // Animate the FAB in
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();
    };
    
    loadPosts();
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchPosts();
    setRefreshing(false);
  }, [fetchPosts]);

  const renderPost = ({ item }: { item: Post }) => (
    <PostCard post={item} />
  );
  
  const filters = ['All', 'Popular', 'Following', 'Trending'];

  // Empty state component
  const EmptyFeed = () => (
    <View className="flex-1 justify-center items-center p-8">
      <Image 
        source={{ uri: 'https://randomuser.me/api/portraits/men/32.jpg' }} 
        className="w-24 h-24 rounded-full mb-6 opacity-50"
      />
      <Text className="text-xl font-bold text-gray-700 mb-2">No posts yet</Text>
      <Text className="text-gray-500 text-center mb-6">
        Follow more people or be the first to share a workout!
      </Text>
      <TouchableOpacity 
        className="bg-[#E63600] px-6 py-3 rounded-full"
        onPress={() => navigation.navigate('NewPost')}
      >
        <Text className="text-white font-semibold">Create First Post</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View className="flex-1 bg-gray-50">
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      
      {/* Enhanced Top Navigation */}
      <View className="bg-white pt-12 pb-2 shadow-sm">
        <View className="px-4 flex-row justify-between items-center mb-3">
          <View>
            <Text className="text-2xl font-bold text-gray-800">Feed</Text>
            <Text className="text-gray-500 text-sm">Discover workouts & progress</Text>
          </View>
          
          <View className="flex-row space-x-3">
            <TouchableOpacity 
              className="bg-gray-100 rounded-full p-2"
              onPress={() => navigation.navigate('SearchScreen')}
            >
              <Search size={wp(5.5)} color="#444" />
            </TouchableOpacity>
            <TouchableOpacity className="bg-gray-100 rounded-full p-2 relative">
              <Bell size={wp(5.5)} color="#444" />
              <View className="absolute top-0 right-0 w-3 h-3 bg-[#E63600] rounded-full border border-white"></View>
            </TouchableOpacity>
          </View>
        </View>
        
        {/* Horizontal Filter Tabs */}
        <FlatList
          horizontal
          data={filters}
          keyExtractor={(item) => item}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: wp(4) }}
          renderItem={({ item }) => (
            <TouchableOpacity 
              onPress={() => setSelectedFilter(item)}
              className={`mr-3 px-4 py-2 rounded-full ${
                selectedFilter === item ? 'bg-[#E63600]' : 'bg-gray-100'
              }`}
            >
              <Text 
                className={`font-medium ${
                  selectedFilter === item ? 'text-white' : 'text-gray-700'
                }`}
              >
                {item}
              </Text>
            </TouchableOpacity>
          )}
          className="pb-3"
        />
      </View>

      {/* Main Content */}
      {loading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#E63600" />
          <Text className="mt-4 text-gray-500">Loading posts...</Text>
        </View>
      ) : (
        <FlatList
          data={posts}
          renderItem={renderPost}
          keyExtractor={(item) => item._id}
          contentContainerStyle={{ 
            paddingTop: hp(1), 
            paddingBottom: hp(10),
            flexGrow: 1, // This ensures the empty component fills the space
          }}
          onEndReached={() => fetchPosts(posts.length / 10 + 1)}
          onEndReachedThreshold={0.5}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor="#E63600"
              colors={['#E63600']}
              progressBackgroundColor="#ffffff"
            />
          }
          ListEmptyComponent={<EmptyFeed />}
          ItemSeparatorComponent={() => <View className="h-3" />}
        />
      )}

      {/* Enhanced Floating Action Button */}
      <Animated.View 
        style={{ 
          position: 'absolute',
          bottom: 20,
          right: 20,
          opacity: fadeAnim,
          transform: [{ scale: fadeAnim }]
        }}
      >
        <TouchableOpacity
          onPress={() => navigation.navigate('NewPost')}
          className="shadow-xl"
        >
          <LinearGradient
            colors={['#E63600', '#FF5722']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            className="p-4 rounded-full"
          >
            <PlusCircle size={wp(6)} color="#fff" />
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>

    </View>
  );
};

export default FeedScreen;
