import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet, TouchableOpacity, Text, StatusBar } from 'react-native';
import PostCard from '../components/PostCard';
import SearchBar from '../components/SearchBar';
import { getData } from '../src/utils/storage';

// const posts = [
//     {
//         id: '1',
//         avatar: require('../assets/avatars/8.jpg'),
//         name: 'Williams Nulsen',
//         date: 'Oct 26, 2023',
//         comment: 'Amazing route!',
//         postImage: require('../assets/manhattan.jpg'),
//     },
//     {
//         id: '2',
//         avatar: require('../assets/avatars/27.jpg'),
//         name: 'Lon Joudrey',
//         date: 'Oct 25, 2023',
//         comment: 'Anyone wants to join me?',
//     },
//     // Additional posts as needed
// ];

const CommunityScreen: React.FC = () => {
    const [posts, setPosts] = useState<any[]>([]);

    useEffect(() => {
        const fetchReviews = async () => {
            const allReviews = await getData('reviews');
            const communityFeedbacks = allReviews?.filter((f: any) => f.shareWithCommunity) || [];
            setPosts(communityFeedbacks);
        };

        fetchReviews();
        console.log(posts)
    }, []);
    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" />
            <View style={styles.header}>
                <SearchBar placeholder='Search in your community' />
            </View>
            <FlatList
                data={posts}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <PostCard
                        avatar={item.avatar}
                        name={item.name}
                        date={item.date}
                        comment={item.message}
                        postImage={item.media}
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
    postsList: { paddingHorizontal: 15, paddingBottom: 70 },
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
});

export default CommunityScreen;

// CommunityScreen.tsx
// import React, { useEffect, useState } from 'react';
// import { View, Text, FlatList, StyleSheet } from 'react-native';
// import { getData } from '../src/utils/storage';

// const CommunityScreen: React.FC = () => {
//     const [feedbacks, setFeedbacks] = useState<any[]>([]);

//     useEffect(() => {
//         const fetchFeedbacks = async () => {
//             const allFeedbacks = await getData('feedbacks');
//             const communityFeedbacks = allFeedbacks?.filter((f: any) => f.shareWithCommunity) || [];
//             setFeedbacks(communityFeedbacks);
//         };

//         fetchFeedbacks();
//     }, []);

//     const renderFeedback = ({ item }: { item: any }) => (
//         <View style={styles.feedbackCard}>
//             <Text>Rating: {item.rating} stars</Text>
//             <Text>Tags: {item.tags.join(', ')}</Text>
//             <Text>Thoughts: {item.thoughts}</Text>
//         </View>
//     );

//     return (
//         <View style={styles.container}>
//             <Text style={styles.title}>Community Feedback</Text>
//             <FlatList
//                 data={feedbacks}
//                 renderItem={renderFeedback}
//                 keyExtractor={(item, index) => index.toString()}
//             />
//         </View>
//     );
// };

// const styles = StyleSheet.create({
//     container: { flex: 1, backgroundColor: '#f8f8f8' },
//     header: {
//         paddingTop: 10,
//         paddingHorizontal: 10
//     },
//     postsList: { paddingHorizontal: 15, paddingBottom: 70 },
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
// });

// export default CommunityScreen;
