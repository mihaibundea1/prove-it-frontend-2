import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { Heart, MessageCircle, Share2, Trash2 } from 'lucide-react-native';
import { formatDistanceToNow } from 'date-fns';
import { CommentModal } from './CommentModal';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { Post, Comment } from '../../types/feed.types';

const PostCard: React.FC<{ post: Post }> = React.memo(({ post }) => {
  // Dummy user data for testing
  const userCredentials = {
    username: 'dummyUser',
    _id: 'dummyId', // Dummy user ID
    avatar: 'https://via.placeholder.com/100'
  };

  const [likes, setLikes] = useState(post.like_count);
  const [liked, setLiked] = useState(post.likes.some(like => like.username === userCredentials.username));
  const [comments, setComments] = useState<Comment[]>(post.comments);
  const [newComment, setNewComment] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleLike = () => {
    const newLikes = liked ? likes - 1 : likes + 1;
    setLikes(newLikes);
    setLiked(!liked);
  };

  const deleteComment = (commentId: string) => {
    setComments(prev => prev.filter(comment => comment.comment_id !== commentId));
  };

  const handleAddComment = (newComment: string) => {
    if (newComment.trim() === '') return;
    const newCommentData: Comment = {
      comment_id: `${comments.length + 1}`, 
      username: userCredentials.username,
      comment: newComment,
      comment_date: new Date().toISOString(),
    };
    setComments(prev => [...prev, newCommentData]);
    setNewComment('');
  };

  const toggleModal = () => {
    setIsModalVisible(!isModalVisible);
  };

  return (
    <View className="bg-white rounded-xl shadow-sm mx-4 my-2 overflow-hidden">
      <View className="flex-row items-center p-4">
        <Image
          source={{ uri: userCredentials.avatar }}
          className="w-10 h-10 rounded-full mr-3"
        />
        <View className="flex-1">
          <Text className="font-semibold text-gray-800">{post.username}</Text>
          <Text className="text-xs text-gray-500">{formatDistanceToNow(new Date(post.post_date))} ago</Text>
        </View>
        {post.credentials_id === userCredentials._id && (
          <TouchableOpacity className="p-2">
            <Trash2 size={wp(5)} color="#E63600" />
          </TouchableOpacity>
        )}
      </View>
      <Image
        source={{ uri: post.image_url }}
        className="w-full h-64"
        resizeMode="cover"
      />
      <View className="p-4">
        <Text className="text-gray-800 mb-2">{post.description}</Text>
        <View className="flex-row justify-between items-center">
          <View className="flex-row space-x-4">
            <TouchableOpacity className="flex-row items-center" onPress={handleLike}>
              <Heart size={wp(5)} color="#E63600" fill={liked ? "#E63600" : "none"} />
              <Text className="ml-1 text-gray-600">{likes}</Text>
            </TouchableOpacity>
            <TouchableOpacity className="flex-row items-center" onPress={toggleModal}>
              <MessageCircle size={wp(5)} color="#E63600" />
              <Text className="ml-1 text-gray-600">{comments.length}</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity>
            <Share2 size={wp(5)} color="#E63600" />
          </TouchableOpacity>
        </View>
      </View>
      <CommentModal
        isVisible={isModalVisible}
        toggleModal={toggleModal}
        comments={comments}
        userCredentials={userCredentials}
        addComment={handleAddComment}
        deleteComment={deleteComment}
      />
    </View>
  );
});

export default PostCard;

