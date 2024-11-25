// import React, { useEffect, useState } from 'react';
// import { View, FlatList, StyleSheet, TouchableOpacity, Text, StatusBar, ActivityIndicator } from 'react-native';
// import PostCard from '../src/components/PostCard';
// import SearchBar from '../src/components/SearchBar';
// import { addCommentToPost, fetchCommunityPosts, toggleLikePost } from '../src/services/firestoreService';
// import { useAuth } from '../src/context/AuthContext';
// import { Post } from '../src/types/types';

// const CommunityScreen: React.FC = () => {
//     const { user } = useAuth();
//     const [posts, setPosts] = useState<any[]>([]);
//     const [loading, setLoading] = useState(true);

//     useEffect(() => {
//         const fetchPosts = async () => {
//             try {
//                 const fetchedPosts = await fetchCommunityPosts();
//                 setPosts(fetchedPosts);
//             } catch (error) {
//                 console.error("Failed to fetch posts:", error);
//             } finally {
//                 setLoading(false);
//             }
//         };


//         fetchPosts();
//     }, []);

//     if (loading) {
//         return (
//             <View style={styles.loadingContainer}>
//                 <ActivityIndicator
//                     size="large"
//                     color={"#000"}
//                 />
//                 <Text>Loading...</Text>
//             </View>
//         );
//     }

//     const updatePost = (updatedPost: Post) => {
//         setPosts(prevPosts =>
//             prevPosts.map(post => (post.id === updatedPost.id ? updatedPost : post))
//         );
//     };

//     const handleLikePost = async (postId: string, isLiked: boolean) => {
//         const updatedPost = await toggleLikePost(postId, user?.uid, isLiked);
//         if (updatedPost) updatePost(updatedPost);
//         console.log(updatedPost, " is liked by ", user?.email);
//     };

//     const handleCommentPost = async (postId: string, comment: string) => {
//         const updatedPost = await addCommentToPost(postId, comment, user?.displayName, user?.uid, );
//         if (updatedPost) updatePost(updatedPost);
//         console.log(user?.uid, " commented on ", postId, " as ", comment);
//     };

//     return (
//         <View style={styles.container}>
//             <StatusBar barStyle="light-content" />
//             {/* <View style={styles.header}>
//                 <SearchBar placeholder='Search in your community' value={''} onChangeText={console.log} />
//             </View> */}
//             <FlatList
//                 data={posts}
//                 keyExtractor={(item) => item.id}
//                 renderItem={({ item }) => (
//                     <PostCard
//                         post={item}
//                         onLike={handleLikePost}
//                         onComment={handleCommentPost}
//                         currentUserId={user?.uid || ""}
//                     />
//                 )}
//                 contentContainerStyle={styles.postsList}
//             />

//             {/* <TouchableOpacity style={styles.postButton}>
//                 <Text style={styles.postButtonText}>+</Text>
//             </TouchableOpacity> */}
//         </View>
//     );
// };

// const styles = StyleSheet.create({
//     container: { flex: 1, backgroundColor: '#f8f8f8' },
//     header: {
//         paddingTop: 10,
//         paddingHorizontal: 10
//     },
//     postsList: {
//         paddingHorizontal: 15,
//         paddingBottom: 70,
//         marginTop: 30,
//     },
//     postButton: {
//         position: 'absolute',
//         bottom: 20,
//         right: 20,
//         backgroundColor: '#007AFF',
//         width: 60,
//         height: 60,
//         borderRadius: 30,
//         alignItems: 'center',
//         justifyContent: 'center',
//         shadowColor: '#000',
//         shadowOpacity: 0.2,
//         shadowOffset: { width: 0, height: 2 },
//     },
//     postButtonText: { fontSize: 30, color: '#fff', fontWeight: 'bold' },
//     loadingContainer: {
//         flex: 1,
//         justifyContent: 'center',
//         alignItems: 'center',
//     },
// });

// export default CommunityScreen;

import React, { useEffect, useState, useCallback } from 'react';
import { View, FlatList, StyleSheet, TouchableOpacity, Text, StatusBar, ActivityIndicator, RefreshControl } from 'react-native';
import PostCard from '../src/components/PostCard';
import { addCommentToPost, fetchCommunityPosts, toggleLikePost } from '../src/services/firestoreService';
import { useAuth } from '../src/context/AuthContext';
import { Post } from '../src/types/types';

const CommunityScreen: React.FC = () => {
    const { user } = useAuth();
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const fetchPosts = useCallback(async () => {
        setLoading(true);
        try {
            const fetchedPosts = await fetchCommunityPosts();
            setPosts(fetchedPosts);
        } catch (error) {
            console.error("Failed to fetch posts:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchPosts();
    }, [fetchPosts]);

    const onRefresh = async () => {
        setRefreshing(true);
        await fetchPosts();
        setRefreshing(false);
    };

    const updatePost = (updatedPost: Post) => {
        setPosts(prevPosts =>
            prevPosts.map(post => (post.id === updatedPost.id ? updatedPost : post))
        );
    };

    const handleLikePost = async (postId: string, isLiked: boolean) => {
        try {
            const updatedPost = await toggleLikePost(postId, user?.uid, isLiked);
            if (updatedPost) updatePost(updatedPost);
        } catch (error) {
            console.error("Failed to like post:", error);
        }
    };

    const handleCommentPost = async (postId: string, comment: string) => {
        try {
            const updatedPost = await addCommentToPost(postId, comment, user?.displayName, user?.uid);
            if (updatedPost) updatePost(updatedPost);
        } catch (error) {
            console.error("Failed to add comment:", error);
        }
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#000" />
                <Text>Loading...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" />
            <FlatList
                data={posts}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <PostCard
                        post={item}
                        onLike={handleLikePost}
                        onComment={handleCommentPost}
                        currentUserId={user?.uid || ""}
                    />
                )}
                contentContainerStyle={styles.postsList}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
            />
            {/* <TouchableOpacity style={styles.postButton}>
                <Text style={styles.postButtonText}>+</Text>
            </TouchableOpacity> */}
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f8f8f8' },
    postsList: {
        paddingHorizontal: 15,
        paddingBottom: 70,
        marginTop: 30,
    },
    postButton: {
        position: 'absolute',
        bottom: 20,
        right: 20,
        backgroundColor: '#007AFF',
        width: 60,
        height: 60,
        borderRadius: 30,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowOffset: { width: 0, height: 2 },
    },
    postButtonText: { fontSize: 30, color: '#fff', fontWeight: 'bold' },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default CommunityScreen;
