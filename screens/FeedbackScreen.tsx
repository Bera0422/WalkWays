// FeedbackScreen.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, StatusBar, TouchableWithoutFeedback, Keyboard, SafeAreaView, AppState, AppStateStatus } from 'react-native';
import { FontAwesome, FontAwesome6 } from '@expo/vector-icons';
import { FeedbackScreenNavigationProp, FeedbackScreenRouteProp } from '../src/types/props';
import { getData, saveData } from '../src/utils/storage';
import CheckBox from 'expo-checkbox';
import MediaUpload from '../src/components/MediaUpload';
import { ScrollView } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { fetchTags, saveCommunityPost, saveReview, uploadImage } from '../firestoreService';
import { IReview } from '../src/types/types';
import { Timestamp } from 'firebase/firestore';

type Feedback = {
    routeId: string;
    selectedTags: string[];
    rating: number;
    comments: string;
};


interface Props {
    route: FeedbackScreenRouteProp;
    navigation: FeedbackScreenNavigationProp;
}

const FeedbackScreen: React.FC<Props> = ({ route, navigation }) => {
    const [rating, setRating] = useState<number>(4);
    const [shareWithCommunity, setShareWithCommunity] = useState<boolean>(false);
    const [reviewMessage, setReviewMessages] = useState<string>('');
    const [selectedTags, setSelectedTags] = useState<any[]>([]);
    const [availableTags, setAvailableTags] = useState<any[]>([]);
    const [selectedMedia, setSelectedMedia] = useState<string | null>(null);
    const routeId = route.params.routeId;

    useEffect(() => {
        const getTags = async () => {
            try {
                const fetchedTags = await fetchTags();
                setAvailableTags(fetchedTags);
            } catch (error) {
                console.error("Failed to fetch filters:", error);
            } finally {
            }
        };
        getTags();
    }, []);

    const [feedback, setFeedback] = useState<Feedback>({
        routeId: '',
        selectedTags: [],
        rating: 0,
        comments: '',
    });

    useEffect(() => {
        loadFeedbackData();
        const appStateListener = AppState.addEventListener('change', handleAppStateChange);
        return () => {
            saveFeedbackData();
            appStateListener.remove();
        };
    }, []);

    const handleAppStateChange = async (nextAppState: AppStateStatus) => {
        if (nextAppState === 'background') {
            await saveFeedbackData();
        }
    };

    const saveFeedbackData = async () => {
        try {
            await AsyncStorage.setItem('unsavedFeedback', JSON.stringify(feedback));
        } catch (error) {
            console.error('Failed to save feedback:', error);
        }
    };

    const loadFeedbackData = async () => {
        try {
            const savedFeedback = await AsyncStorage.getItem('unsavedFeedback');
            console.log("SAVED FEEDBACK: " + savedFeedback)
            if (savedFeedback) {
                setFeedback(JSON.parse(savedFeedback));
            }
        } catch (error) {
            console.error('Failed to load feedback:', error);
        }
    };



    const handleMediaSelect = (uri: string) => {
        setSelectedMedia(uri)
        console.log(uri)
    }

    const toggleTag = (tagId: string) => {
        setSelectedTags((prevTags) =>
            prevTags.includes(tagId) ? prevTags.filter((t) => t !== tagId) : [...prevTags, tagId]
        );
    };

    const renderStars = () => {
        return Array.from({ length: 5 }).map((_, index) => (
            <FontAwesome
                key={index}
                name={index < rating ? 'star' : 'star-o'}
                size={32}
                color="#FFD700"
                onPress={() => setRating(index + 1)}
            />
        ));
    };

    const submitFeedback = async () => {
        let imageUrl = null;
        if (selectedMedia) {
            imageUrl = await uploadImage(selectedMedia, 'user-uploads');
        }
        const reviewData =
        {
            userId: '',
            rating: rating,
            text: reviewMessage,
            timestamp: Timestamp.now(),
            media: imageUrl,
            routeId: routeId,
            tags: selectedTags,
        };

        try {
            await saveReview(reviewData);
            if (shareWithCommunity) {
                const communityPostData = {
                    ...reviewData,
                    timestamp: new Date(),
                };
                await saveCommunityPost(communityPostData);
                console.log('Community post saved:', reviewData);
            }
            console.log('Feedback saved:', reviewData);
        } catch (error) {
            console.error('Error saving feedback:', error);
        }
        await AsyncStorage.removeItem('unsavedFeedback')

        navigation.reset({
            index: 0,
            routes: [{ name: 'CommunityStack', params: { screen: 'Community' } }],
        });
    };

    return (
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
            <ScrollView style={styles.container} contentContainerStyle={styles.scrollContainer}>
                {/* <ScrollView> */}
                <Text style={styles.sectionTitle}>Rate Your Experience</Text>
                <View style={styles.starContainer}>{renderStars()}</View>

                <Text style={styles.sectionTitle}>Tag the route</Text>
                <View style={styles.tagContainer}>
                    {availableTags.map((tag) => (
                        <TouchableOpacity
                            key={tag.id}
                            style={[styles.tag, selectedTags.includes(tag.id) ? styles.activeTag : styles.inactiveTag]}
                            onPress={() => toggleTag(tag.id)}
                        >
                            {/* <FontAwesome6 name={tag.icon} size={18} color="#fff" style={styles.tagIcon} /> */}
                            <Text style={selectedTags.includes(tag.id) ? styles.activeTagText : styles.inactiveTagText}>{tag.name}</Text>
                        </TouchableOpacity>
                    ))}
                </View>

                <Text style={styles.sectionTitle}>Share any thoughts</Text>
                <TextInput
                    style={styles.textInput}
                    placeholder="Write your thoughts here..."
                    value={reviewMessage}
                    onChangeText={(text) => { setReviewMessages(text); setFeedback({ ...feedback, comments: text }) }}
                    multiline
                />
                {/* Upload Media */}
                <MediaUpload onSelectMedia={handleMediaSelect} />

                {/* Share with community checkbox */}
                <View style={styles.checkboxContainer}>
                    <CheckBox value={shareWithCommunity} onValueChange={setShareWithCommunity} />
                    <Text style={styles.checkboxLabel}>Share with your community</Text>
                </View>


                <TouchableOpacity style={styles.submitButton} onPress={submitFeedback}>
                    <Text style={styles.submitButtonText}>Submit</Text>
                </TouchableOpacity>
            </ScrollView>
        </TouchableWithoutFeedback>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#fff',
    },
    scrollContainer: {
        padding: 16,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 20,
    },
    starContainer: {
        flexDirection: 'row',
        marginVertical: 10,
    },
    tagContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginVertical: 10,
    },
    tag: {
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 10,
        margin: 4,
        flexDirection: 'row',
    },
    activeTag: {
        backgroundColor: '#6A1B9A',
    },
    inactiveTag: {
        backgroundColor: '#b89bcc',
    },
    activeTagText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    inactiveTagText: {
        color: '#fff',
    },
    tagIcon: {
        marginRight: 5,
    },
    textInput: {
        height: 100,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 8,
        padding: 10,
        marginVertical: 10,
        textAlignVertical: 'top',
    },
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 10,
    },
    checkboxLabel: {
        marginLeft: 8,
    },
    submitButton: {
        backgroundColor: '#6A1B9A',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 20,
    },
    submitButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default FeedbackScreen;
