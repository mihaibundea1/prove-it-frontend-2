"use client"

import React, { useState } from "react"
import { View, Text, Image, TouchableOpacity, Dimensions } from "react-native"
import { Heart, MessageCircle, Share2, Trash2 } from "lucide-react-native"
import { formatDistanceToNow } from "date-fns"
import { CommentModal } from "./CommentModal"
import { widthPercentageToDP as wp } from "react-native-responsive-screen"
import type { Post } from "../../types/feed.types"
import { useFeed } from "@/contexts/FeedContext"
import { useUser } from "@clerk/clerk-expo"
import { useNavigation, type NavigationProp } from "@react-navigation/native"
import type { ProfileStackParamList } from "@/navigation/types/navigationTypes" // Import your navigation types

const PostCard: React.FC<{ post: Post }> = React.memo(({ post }) => {
  const { user } = useUser()
  const { likePost, unlikePost, addComment, deleteComment, deletePost } = useFeed()
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [imageError, setImageError] = useState(false)

  // Get screen width to calculate image dimensions
  const screenWidth = Dimensions.get("window").width
  // Calculate image width (full width minus padding)
  const imageWidth = screenWidth - 32 // 16px padding on each side (mx-4)

  // Correctly type the navigation hook
  const navigation = useNavigation<NavigationProp<ProfileStackParamList, "ProfileScreen">>()

  const userLike = post.likes.find((like) => like.username === user?.username)
  const isLiked = Boolean(userLike)

  const navigateToProfile = () => {
    navigation.navigate("ProfileScreen", { userId: post.user_id })
  }

  const handleLike = async () => {
    try {
      if (isLiked && userLike) {
        await unlikePost(post._id, userLike.like_id)
      } else if (user?.username) {
        await likePost(post._id, user.username)
      }
    } catch (error) {
      console.error("Error handling like:", error)
    }
  }

  const handleDeletePost = async () => {
    try {
      await deletePost(post._id)
    } catch (error) {
      console.error("Error deleting post:", error)
    }
  }

  const toggleModal = () => {
    setIsModalVisible(!isModalVisible)
  }

  return (
    <View className="bg-white rounded-xl shadow-sm overflow-hidden">
      {/* Post Header */}
      <View className="flex-row items-center p-4">
        <TouchableOpacity onPress={navigateToProfile}>
          <Image
            source={{ uri: user?.imageUrl || "https://via.placeholder.com/100" }}
            className="w-10 h-10 rounded-full mr-3"
          />
        </TouchableOpacity>
        <View className="flex-1">
          <TouchableOpacity onPress={navigateToProfile}>
            <Text className="font-semibold text-gray-800">{post.username}</Text>
          </TouchableOpacity>
          <Text className="text-xs text-gray-500">{formatDistanceToNow(new Date(post.created_at))} ago</Text>
        </View>
        {post.user_id === user?.id && (
          <TouchableOpacity className="p-2" onPress={handleDeletePost}>
            <Trash2 size={wp(5)} color="#E63600" />
          </TouchableOpacity>
        )}
      </View>

      {/* Post Image - Square with full width */}
      <View className="bg-gray-100">
        <Image
          source={{ uri: imageError ? "https://via.placeholder.com/500?text=Image+Error" : post.image_url }}
          style={{ width: imageWidth, height: imageWidth, alignSelf: "center" }}
          resizeMode="cover"
          onError={() => setImageError(true)}
        />
      </View>

      {/* Post Actions */}
      <View className="p-4">
        <Text className="text-gray-800 mb-3">{post.description}</Text>
        <View className="flex-row justify-between items-center">
          <View className="flex-row space-x-6">
            <TouchableOpacity className="flex-row items-center" onPress={handleLike}>
              <Heart size={wp(5)} color="#E63600" fill={isLiked ? "#E63600" : "none"} />
              <Text className="ml-1 text-gray-600">{post.like_count}</Text>
            </TouchableOpacity>
            <TouchableOpacity className="flex-row items-center" onPress={toggleModal}>
              <MessageCircle size={wp(5)} color="#E63600" />
              <Text className="ml-1 text-gray-600">{post.comment_count}</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity>
            <Share2 size={wp(5)} color="#E63600" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Comment Modal */}
      <CommentModal
        isVisible={isModalVisible}
        toggleModal={toggleModal}
        postId={post._id}
        userCredentials={{
          username: user?.username || "",
          _id: user?.id || "",
          avatar: user?.imageUrl || "",
        }}
      />
    </View>
  )
})

export default PostCard

