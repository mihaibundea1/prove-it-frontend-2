import React, { useState, useEffect, useCallback, useRef } from "react";
import { View, Text, TextInput, FlatList, TouchableOpacity, StatusBar, ActivityIndicator, Image } from "react-native";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { ArrowLeft, Search } from "lucide-react-native";
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from "react-native-responsive-screen";
import { useUserService } from "@/services/api/endpoints/user/hooks/useUserService";
import { SearchedUser } from "@/services/api/endpoints/user/types/user.types";
import type { ProfileStackParamList } from "@/navigation/types/navigationTypes";

const UserSearchScreen = () => {
  const { searchUsers, isLoading } = useUserService();
  const [query, setQuery] = useState("");
  const [filteredUsers, setFilteredUsers] = useState<SearchedUser[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);

  const navigation = useNavigation<NavigationProp<ProfileStackParamList>>();

  const debouncedSearch = useCallback((searchTerm: string) => {
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }
    
    debounceTimeout.current = setTimeout(async () => {
      if (searchTerm.trim() === "") {
        setFilteredUsers([]);
        setHasSearched(false);
        return;
      }
      setHasSearched(true);
      const results = await searchUsers(searchTerm);
      setFilteredUsers(results);
    }, 500);
  }, [searchUsers]);

  const handleSearch = (text: string) => {
    setQuery(text);
    debouncedSearch(text);
  };

  useEffect(() => {
    return () => {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }
    };
  }, []);

  // Define empty components separately to satisfy TypeScript
  const renderNoResults = () => (
    <View className="flex-1 justify-center items-center p-8">
      {isLoading ? (
        <ActivityIndicator size="large" color="#E63600" />
      ) : (
        <>
          <Text className="text-xl font-bold text-gray-700 mb-2">
            No users found
          </Text>
          <Text className="text-gray-500 text-center">
            Try a different search term
          </Text>
        </>
      )}
    </View>
  );

  const renderInitialState = () => (
    <View className="flex-1 justify-center items-center p-8">
      <View className="bg-gray-100 p-6 rounded-full mb-4">
        <Search size={wp(8)} color="#888" />
      </View>
      <Text className="text-xl font-bold text-gray-700 mb-2">
        Find People
      </Text>
      <Text className="text-gray-500 text-center px-8">
        Search for users by their username to connect with them
      </Text>
    </View>
  );

  const getEmptyComponent = () => {
    if (query) {
      return renderNoResults();
    }
    if (!hasSearched) {
      return renderInitialState();
    }
    return null;
  };

  return (
    <View className="flex-1 bg-gray-50">
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

      {/* Top Navigation */}
      <View className="bg-white pt-12 pb-3 shadow-sm px-4 flex-row items-center space-x-3">
        <TouchableOpacity onPress={() => navigation.goBack()} className="p-2">
          <ArrowLeft size={wp(6)} color="#444" />
        </TouchableOpacity>
        <View className="flex-1 bg-gray-100 rounded-full flex-row items-center px-4 py-2">
          <Search size={wp(5)} color="#888" />
          <TextInput
            className="flex-1 ml-2 text-gray-800"
            placeholder="Search users..."
            value={query}
            onChangeText={handleSearch}
            autoFocus
          />
          {isLoading && (
            <ActivityIndicator size="small" color="#E63600" className="ml-2" />
          )}
        </View>
      </View>

      {/* Main Content Area */}
      {isLoading && !hasSearched ? (
        // Initial loading state (first search)
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#E63600" />
          <Text className="mt-4 text-gray-500">Searching users...</Text>
        </View>
      ) : (
        // Results or empty states
        <FlatList
          data={filteredUsers}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              className="flex-row items-center p-4 border-b border-gray-200 bg-white"
              onPress={() =>
                navigation.navigate("ProfileScreen", { userId: item.id })
              }
            >
              <Image
                source={{ uri: item.avatar }}
                className="w-12 h-12 rounded-full mr-4"
              />
              <View>
                <Text className="text-lg font-semibold text-gray-800">
                  {item.username}
                </Text>
              </View>
            </TouchableOpacity>
          )}
          contentContainerStyle={{
            paddingTop: hp(2),
            paddingBottom: hp(10),
            flexGrow: 1,
          }}
          ListEmptyComponent={getEmptyComponent()}
        />
      )}
    </View>
  );
};

export default UserSearchScreen;