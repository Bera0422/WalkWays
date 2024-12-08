import { Timestamp } from 'firebase/firestore';
import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TextInput, TouchableOpacity, FlatList } from 'react-native';
import { Post } from '../types/types';
import { Avatar } from 'react-native-paper';

interface PostCardProps {
  post: Post;
  onLike: (postId: string, isLiked: boolean) => void;
  onComment: (postId: string, comment: string) => void;
  currentUserId: string;
}

const PostCard: React.FC<PostCardProps> = ({ post, onLike, onComment, currentUserId }) => {
  const [newComment, setNewComment] = useState('');
  const postImage = post.images?.[0];
  // const postImage = post.postImage;
  const likeCount = Object.values(post.likes || {}).filter(value => value === true).length;
  const isLiked = post.likes && post.likes[currentUserId] || false;
  
  const handleLike = () => {
    onLike(post.id, isLiked);
  };

  const handleAddComment = () => {
    if (newComment.trim()) {
      onComment(post.id, newComment.trim());
      setNewComment('');
    }
  };

  return (
    <View style={styles.card}>
      {/* Avatar */}
      <Avatar.Text style={styles.avatar} size={50} label={post.name ? post.name.charAt(0).toUpperCase() : ""} />
      
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.name}>{post.name}</Text>
          <Text style={styles.date}>{post.date}</Text>
        </View>

        {post.routeName && <Text style={styles.routeName}>📍 {post.routeName}</Text>}
        <Text style={styles.comment}>{post.text}</Text>

        {/* Post Image */}
        {postImage && <Image source={{ uri: postImage }} style={styles.postImage} />}

        <View style={styles.interactionRow}>
          <TouchableOpacity onPress={handleLike} style={styles.likeButton}>
            {currentUserId && <Text style={[styles.likeButtonText, isLiked && styles.liked]}>
              {isLiked ? '❤️ Unlike' : '🤍 Like'}
            </Text>}
          </TouchableOpacity>
          <Text style={styles.likeCount}>{likeCount} {likeCount === 1 ? 'Like' : 'Likes'}</Text>
        </View>

        {/* Comments List */}
        <FlatList
          data={post.comments}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <View style={styles.commentItem}>
              <Text style={styles.commentAuthor}>{item.name}</Text>
              <Text style={styles.commentText}>{item.comment}</Text>
              <Text style={styles.commentDate}>
                {item.timestamp.toDate().toLocaleDateString()}
              </Text>
            </View>
          )}
          style={styles.commentsList}
        />

        {/* Add Comment Section */}
        {currentUserId && (
          <View style={styles.addCommentSection}>
            <TextInput
              style={styles.commentInput}
              placeholder="Add a comment..."
              placeholderTextColor="#888"
              value={newComment}
              onChangeText={setNewComment}
            />
            <TouchableOpacity onPress={handleAddComment} style={styles.addCommentButton}>
              <Text style={styles.addCommentButtonText}>Post</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    padding: 12,
    marginVertical: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    elevation: 5,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
    borderWidth: 2,
    borderColor: '#007BFF', // Blue border to match the like button
  },
  content: { flex: 1 },
  header: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  name: { fontWeight: '700', fontSize: 16 },
  routeName: { fontWeight: '600', color: '#6A2766' },
  date: { fontSize: 12, color: '#999' },
  comment: { fontSize: 14, color: '#333', marginVertical: 8 },
  postImage: {
    width: '100%',
    height: 250,
    borderRadius: 12, // Larger radius for more rounded edges
    resizeMode: 'cover',
    backgroundColor: '#f8f8f8',
    marginTop: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  interactionRow: { flexDirection: 'row', alignItems: 'center', marginVertical: 10 },
  likeButton: { marginRight: 12, paddingVertical: 6},
  likeButtonText: { fontWeight: '600', color: '#007BFF' },
  liked: { color: '#E0245E' },
  likeCount: { fontSize: 14, color: '#555' },
  commentsList: { marginVertical: 12 },
  commentItem: {
    backgroundColor: '#f1f1f1',
    padding: 10,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#ddd', // Light border color
  },
  commentAuthor: { fontWeight: '700', marginBottom: 2, color: '#333' },
  commentText: { fontSize: 14, color: '#444', marginBottom: 4 },
  commentDate: { fontSize: 10, color: '#777', alignSelf: 'flex-end' },
  addCommentSection: { flexDirection: 'row', alignItems: 'center', marginTop: 8 },
  commentInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginRight: 10,
    fontSize: 14,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 4,
  },
  addCommentButton: {
    backgroundColor: '#007BFF',
    borderRadius: 12,
    paddingHorizontal: 18,
    paddingVertical: 10,
  },
  addCommentButtonText: { color: '#fff', fontWeight: '700' },
});

export default PostCard;
