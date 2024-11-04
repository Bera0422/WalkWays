// components/PostCard.tsx
import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

interface PostCardProps {
  avatar: any;
  name: string;
  date: string;
  comment: string;
  postImage?: any;
}

const PostCard: React.FC<PostCardProps> = ({ avatar, name, date, comment, postImage }) => {
  console.log(postImage);
  return (
    <View style={styles.card}>
      <Image source={avatar} style={styles.avatar} />
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.name}>{name}</Text>
          <Text style={styles.date}>{date}</Text>
        </View>
        <Text style={styles.comment}>{comment}</Text>
        {postImage && <Image source={{uri: postImage}} style={styles.postImage} />}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    padding: 10,
    marginVertical: 8,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  content: { flex: 1 },
  header: { flexDirection: 'row', justifyContent: 'space-between' },
  name: { fontWeight: 'bold' },
  date: { color: '#777', fontSize: 12 },
  comment: { marginVertical: 5 },
  postImage: { width: '100%', height: 150, borderRadius: 8, marginTop: 5 },
});

export default PostCard;
