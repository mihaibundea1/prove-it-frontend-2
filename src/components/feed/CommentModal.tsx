import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Image,
} from "react-native";
import Modal from "react-native-modal";
import Icon from "react-native-vector-icons/Ionicons";
import { useFeed } from "@/contexts/FeedContext";
import { Comment, Post } from "@/types/feed.types";
import { SendHorizonal } from "lucide-react-native";
import { formatDistanceToNow } from "date-fns";

interface CommentItemProps {
  postId: string;
  comment: Comment;
  userCredentials: { username: string };
}

interface CommentModalProps {
  isVisible: boolean;
  toggleModal: () => void;
  postId: string;
  userCredentials: { _id: string; username: string; avatar: string };
}

const CommentItem: React.FC<CommentItemProps> = ({ postId, comment, userCredentials }) => {
  const { deleteComment } = useFeed();
  const createdAtDate = new Date(comment.created_at);
  const isValidDate = !isNaN(createdAtDate.getTime());

  return (
    <View className="flex-row mb-4 items-center">
      <View className="flex-1">
        <View className="flex-row items-center">
          <Text className="text-black font-bold mr-2">{comment.username}</Text>
        </View>
        <Text className="text-black">{comment.comment}</Text>
        <View className="flex-row items-center mt-1">
          <Text className="text-gray-400 text-xs mr-4">
            {isValidDate ? formatDistanceToNow(createdAtDate) + " ago" : "Unknown time"}
          </Text>
          <Text className="text-gray-400 text-xs">Reply</Text>
        </View>
      </View>

      {comment.username === userCredentials.username && (
        <TouchableOpacity onPress={() => deleteComment(postId, comment.comment_id)} className="ml-2">
          <Icon name="trash-outline" size={24} color="red" />
        </TouchableOpacity>
      )}
    </View>
  );
};

export const CommentModal: React.FC<CommentModalProps> = ({
  isVisible,
  toggleModal,
  postId,
  userCredentials,
}) => {
  const { addComment, deleteComment, posts } = useFeed();
  const [newComment, setNewComment] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("For you");

  // Get comments from the correct post
  const post: Post | undefined = posts.find((p) => p._id === postId);
  const comments = post?.comments || [];

  const handleAddComment = async () => {
    if (newComment.trim()) {
      await addComment(postId, userCredentials.username, newComment);
      setNewComment("");
    }
  };

  return (
    <Modal
      isVisible={isVisible}
      onSwipeComplete={toggleModal}
      onBackdropPress={toggleModal}
      swipeDirection="down"
      style={{ margin: 0, justifyContent: "flex-end" }}
    >
      <View className="bg-white rounded-t-3xl h-5/6">
        <View className="flex-row justify-between items-center p-4 border-b border-gray-100">
          <Text className="text-black text-lg font-bold">Comments</Text>
          <TouchableOpacity onPress={toggleModal}>
            <Icon name="close" size={24} color="black" />
          </TouchableOpacity>
        </View>

        <View className="flex-row justify-between items-center px-4 py-2">
          <TouchableOpacity className="flex-row items-center">
            <Text className="text-black mr-1">{sortBy}</Text>
            <Icon name="chevron-down" size={16} color="black" />
          </TouchableOpacity>
        </View>

        <FlatList
          data={comments}
          renderItem={({ item }) => (
            <CommentItem postId={postId} comment={item} userCredentials={userCredentials} />
          )}
          keyExtractor={(item) => item.comment_id}
          className="px-4"
        />

        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={40}
          className="p-4 border-t border-gray-100"
        >
          <View className="flex-row items-center">
            <Image
              source={{ uri: userCredentials.avatar }}
              className="w-8 h-8 rounded-full mr-3"
            />
            <TextInput
              value={newComment}
              onChangeText={setNewComment}
              placeholder="Add a comment..."
              placeholderTextColor="gray"
              className="flex-1 text-black bg-gray-100 rounded-full px-4 py-2 mr-2"
            />
            <TouchableOpacity onPress={handleAddComment}>
              <SendHorizonal size={24} color="black" />
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
};
