import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet, TouchableOpacity, Text, StatusBar, ActivityIndicator } from 'react-native';
import PostCard from '../src/components/PostCard';
import SearchBar from '../src/components/SearchBar';
import { fetchCommunityPosts } from '../src/services/firestoreService';

const CommunityScreen: React.FC = () => {
    const [posts, setPosts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const fetchedPosts = await fetchCommunityPosts();
                setPosts(fetchedPosts);
            } catch (error) {
                console.error("Failed to fetch posts:", error);
            } finally {
                setLoading(false);
            }
        };


        fetchPosts();
        console.log('Posts: ', posts)
    }, []);

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator
                    size="large"
                    color={"#000"}
                />
                <Text>Loading...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" />
            {/* <View style={styles.header}>
                <SearchBar placeholder='Search in your community' value={''} onChangeText={console.log} />
            </View> */}
            <FlatList
                data={posts}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <PostCard
                        avatar={item.avatar}
                        name={item.name}
                        date={item.date}
                        comment={item.text}
                        postImage={item.images[0]}
                    />
                )}
                contentContainerStyle={styles.postsList}
            />

            <TouchableOpacity style={styles.postButton}>
                <Text style={styles.postButtonText}>+</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f8f8f8' },
    header: {
        paddingTop: 10,
        paddingHorizontal: 10
    },
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