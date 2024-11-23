import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    TouchableWithoutFeedback,
    Keyboard,
    ScrollView,
    SafeAreaView,
    ActivityIndicator,
    AppState,
} from 'react-native';
import CheckBox from 'expo-checkbox';
import { FontAwesome } from '@expo/vector-icons';
import { Timestamp } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '../src/context/AuthContext';
import MediaUpload from '../src/components/MediaUpload';
import {
    fetchTags,
    saveCommunityPost,
    saveReview,
    uploadImage,
} from '../src/services/firestoreService';
import { FeedbackScreenNavigationProp, FeedbackScreenRouteProp } from '../src/types/props';

interface Props {
    route: FeedbackScreenRouteProp;
    navigation: FeedbackScreenNavigationProp;
}

const FeedbackScreen: React.FC<Props> = ({ route, navigation }) => {
    const { user } = useAuth();
    const routeId = route.params.routeId;

    const [rating, setRating] = useState(4);
    const [shareWithCommunity, setShareWithCommunity] = useState(false);
    const [reviewMessage, setReviewMessage] = useState('');
    const [selectedTags, setSelectedTags] = useState<any[]>([]);
    const [availableTags, setAvailableTags] = useState<any[]>([]);
    const [selectedMedia, setSelectedMedia] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);  // New state for loading indicator

    useEffect(() => {
        const fetchAvailableTags = async () => {
            try {
                const tags = await fetchTags();
                setAvailableTags(tags);
            } catch (error) {
                console.error('Error fetching tags:', error);
            }
        };

        fetchAvailableTags();
        loadFeedbackData();

        const saveOnAppClose = () => saveFeedbackData();
        const appStateListener = AppState.addEventListener('change', saveOnAppClose);

        return () => {
            appStateListener.remove();
            saveFeedbackData();
        };
    }, []);

    const saveFeedbackData = async () => {
        const feedbackData = {
            routeId,
            rating,
            reviewMessage,
            selectedTags,
        };
        try {
            await AsyncStorage.setItem('unsavedFeedback', JSON.stringify(feedbackData));
        } catch (error) {
            console.error('Failed to save feedback:', error);
        }
    };

    const loadFeedbackData = async () => {
        try {
            const savedFeedback = await AsyncStorage.getItem('unsavedFeedback');
            if (savedFeedback) {
                const feedback = JSON.parse(savedFeedback);
                setRating(feedback.rating || 4);
                setReviewMessage(feedback.reviewMessage || '');
                setSelectedTags(feedback.selectedTags || []);
            }
        } catch (error) {
            console.error('Failed to load feedback:', error);
        }
    };

    const handleMediaSelect = (uri: string) => setSelectedMedia(uri);

    const toggleTag = (tagId: string) => {
        setSelectedTags((tags) =>
            tags.includes(tagId) ? tags.filter((id) => id !== tagId) : [...tags, tagId]
        );
    };

    const renderStars = () =>
        Array.from({ length: 5 }, (_, index) => (
            <FontAwesome
                key={index}
                name={index < rating ? 'star' : 'star-o'}
                size={50}
                color="#FFD700"
                onPress={() => setRating(index + 1)}
            />
        ));

    const submitFeedback = async () => {
        setLoading(true);  // Show loading spinner when starting the upload process

        let imageUrl = null;
        if (selectedMedia) {
            imageUrl = await uploadImage(selectedMedia, 'user-uploads');
        }

        const feedbackData = {
            userId: user?.uid || '',
            routeId,
            rating,
            text: reviewMessage,
            tags: selectedTags,
            media: imageUrl,
            timestamp: Timestamp.now(),
        };

        try {
            await saveReview(feedbackData);
            if (shareWithCommunity) {
                await saveCommunityPost({ ...feedbackData, timestamp: new Date() });
            }
            await AsyncStorage.removeItem('unsavedFeedback');
            navigation.reset({ index: 0, routes: [{ name: 'CommunityStack', params: { screen: 'Community' } }] });
        } catch (error) {
            console.error('Error submitting feedback:', error);
        } finally {
            setLoading(false);  // Hide loading spinner after the process completes
        }
    };

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <ScrollView contentContainerStyle={styles.container}>
                <Text style={styles.title}>Rate Your Experience</Text>
                <View style={styles.starContainer}>{renderStars()}</View>

                <Text style={styles.title}>Tag the Route</Text>
                <View style={styles.tagContainer}>
                    {availableTags.map((tag) => (
                        <TouchableOpacity
                            key={tag.id}
                            style={[
                                styles.tag,
                                selectedTags.includes(tag.id) ? styles.activeTag : styles.inactiveTag,
                            ]}
                            onPress={() => toggleTag(tag.id)}
                        >
                            <Text
                                style={[
                                    styles.tagText,
                                    selectedTags.includes(tag.id) ? styles.activeTagText : styles.inactiveTagText,
                                ]}
                            >
                                {tag.name}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                <Text style={styles.title}>Share Your Thoughts</Text>
                <TextInput
                    style={styles.textInput}
                    placeholder="Write your thoughts here..."
                    value={reviewMessage}
                    onChangeText={setReviewMessage}
                    multiline
                />

                <MediaUpload onSelectMedia={handleMediaSelect} />

                <View style={styles.checkboxContainer}>
                    <CheckBox value={shareWithCommunity} onValueChange={setShareWithCommunity} />
                    <Text style={styles.checkboxLabel}>Share with your community</Text>
                </View>

                {loading ? (  // Show loading spinner when in loading state
                    <ActivityIndicator size="large" color="#6A1B9A" style={styles.loadingIndicator} />
                ) : (
                    <TouchableOpacity style={styles.submitButton} onPress={submitFeedback}>
                        <Text style={styles.submitButtonText}>Submit</Text>
                    </TouchableOpacity>
                )}
            </ScrollView>
        </TouchableWithoutFeedback>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        padding: 16,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginVertical: 16,
    },
    starContainer: {
        flexDirection: 'row',
        marginBottom: 20,
        alignSelf: 'center'
    },
    tagContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: 20,
    },
    tag: {
        borderRadius: 20,
        paddingHorizontal: 12,
        paddingVertical: 8,
        margin: 4,
    },
    activeTag: {
        backgroundColor: '#6A1B9A',
    },
    inactiveTag: {
        backgroundColor: '#E0E0E0',
    },
    tagText: {
        fontSize: 14,
    },
    activeTagText: {
        color: '#fff',
    },
    inactiveTagText: {
        color: '#000',
    },
    textInput: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        padding: 10,
        textAlignVertical: 'top',
        minHeight: 100,
        marginBottom: 20,
    },
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    checkboxLabel: {
        marginLeft: 8,
    },
    submitButton: {
        backgroundColor: '#6A1B9A',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
    },
    submitButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    loadingIndicator: {
        marginTop: 20,
    },
});

export default FeedbackScreen;
