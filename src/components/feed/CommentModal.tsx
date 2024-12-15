import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import Modal from "react-native-modal";
import Icon from "react-native-vector-icons/Ionicons";
import { formatDistanceToNow } from "date-fns";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { SendHorizonal } from "lucide-react-native";

// Updated User type with dummy data
interface User {
  id: string;
  username: string;
  avatar: string;
  email?: string;
}

interface Comment {
  comment_id: string;
  username: string;
  comment: string;
  comment_date: string;
}

interface CommentModalProps {
  isVisible: boolean;
  toggleModal: () => void;
  comments?: Comment[];
  userCredentials?: Pick<User, "username" | "avatar">; 
  addComment?: (text: string) => void;
  deleteComment?: (commentId: string) => void;
}

interface CommentItemProps {
  comment: Comment;
  userCredentials: Pick<User, "username">;
  deleteComment: (commentId: string) => void;
}

// Dummy data
const DUMMY_USER: User = {
  id: '1',
  username: 'johndoe',
  avatar: 'https://i.pravatar.cc/150?img=1',
  email: 'john.doe@example.com'
};

const DUMMY_COMMENTS: Comment[] = [
  {
    comment_id: '1',
    username: 'johndoe',
    comment: 'This is a great post!',
    comment_date: new Date().toISOString()
  },
  {
    comment_id: '2',
    username: 'janedoe',
    comment: 'I totally agree!',
    comment_date: new Date(Date.now() - 3600000).toISOString() // 1 hour ago
  },
  {
    comment_id: '3',
    username: 'bobsmith',
    comment: 'Interesting perspective.',
    comment_date: new Date(Date.now() - 86400000).toISOString() // 1 day ago
  }
];

const CommentItem: React.FC<CommentItemProps> = ({
  comment,
  userCredentials,
  deleteComment,
}) => {
  const createdAtDate = new Date(comment.comment_date);
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
            {isValidDate
              ? formatDistanceToNow(createdAtDate) + " ago"
              : "Unknown time"}
          </Text>
          <Text className="text-gray-400 text-xs">Reply</Text>
        </View>
      </View>

      {comment.username === userCredentials.username && (
        <TouchableOpacity
          onPress={() => deleteComment(comment.comment_id)}
          className="ml-2"
        >
          <Icon name="trash-outline" size={wp(5.5)} color="red" />
        </TouchableOpacity>
      )}
    </View>
  );
};

export const CommentModal: React.FC<CommentModalProps> = ({
  isVisible = false,
  toggleModal = () => {},
  comments = DUMMY_COMMENTS,
  userCredentials = DUMMY_USER,
  addComment = (text: string) => console.log('Comment added:', text),
  deleteComment = (commentId: string) => console.log('Comment deleted:', commentId),
}) => {
  const [newComment, setNewComment] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("For you");

  const handleAddComment = () => {
    if (newComment.trim()) {
      addComment(newComment);
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
            <Icon name="close" size={wp(6)} color="black" />
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
            <CommentItem
              comment={item}
              userCredentials={userCredentials}
              deleteComment={deleteComment}
            />
          )}
          keyExtractor={(item) => item.comment_id}
          className="px-4"
        />

        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={wp(40)}
          className="p-4 border-t border-gray-100"
          style={{ marginBottom: hp(3) }}
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
              <SendHorizonal size={wp(7)} color="black" />
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
};

// Optional: Export dummy data if you want to use it elsewhere
export { DUMMY_USER, DUMMY_COMMENTS };