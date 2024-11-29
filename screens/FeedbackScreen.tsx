// import React, { useEffect, useState } from 'react';
// import {
//     View,
//     Text,
//     TextInput,
//     TouchableOpacity,
//     StyleSheet,
//     TouchableWithoutFeedback,
//     Keyboard,
//     ScrollView,
//     SafeAreaView,
//     ActivityIndicator,
//     AppState,
// } from 'react-native';
// import CheckBox from 'expo-checkbox';
// import { FontAwesome } from '@expo/vector-icons';
// import { Timestamp } from 'firebase/firestore';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { useAuth } from '../src/context/AuthContext';
// import MediaUpload from '../src/components/MediaUpload';
// import {
//     fetchTags,
//     saveCommunityPost,
//     saveReview,
//     uploadImage,
// } from '../src/services/firestoreService';
// import { FeedbackScreenNavigationProp, FeedbackScreenRouteProp } from '../src/types/props';

// interface Props {
//     route: FeedbackScreenRouteProp;
//     navigation: FeedbackScreenNavigationProp;
// }

// const FeedbackScreen: React.FC<Props> = ({ route, navigation }) => {
//     const { user } = useAuth();
//     const routeId = route.params.routeId;
//     const routeName = route.params.routeName;

//     const [rating, setRating] = useState(4);
//     const [shareWithCommunity, setShareWithCommunity] = useState(false);
//     const [reviewMessage, setReviewMessage] = useState('');
//     const [selectedTags, setSelectedTags] = useState<any[]>([]);
//     const [availableTags, setAvailableTags] = useState<any[]>([]);
//     const [selectedMedia, setSelectedMedia] = useState<string | null>(null);
//     const [loading, setLoading] = useState(false);  // New state for loading indicator

//     useEffect(() => {
//         const fetchAvailableTags = async () => {
//             try {
//                 const tags = await fetchTags();
//                 setAvailableTags(tags);
//             } catch (error) {
//                 console.error('Error fetching tags:', error);
//             }
//         };

//         fetchAvailableTags();
//         loadFeedbackData();

//         const saveOnAppClose = () => saveFeedbackData();
//         const appStateListener = AppState.addEventListener('change', saveOnAppClose);

//         return () => {
//             appStateListener.remove();
//             saveFeedbackData();
//         };
//     }, []);

//     const saveFeedbackData = async () => {
//         const feedbackData = {
//             routeId,
//             rating,
//             reviewMessage,
//             selectedTags,
//         };
//         try {
//             await AsyncStorage.setItem('unsavedFeedback', JSON.stringify(feedbackData));
//         } catch (error) {
//             console.error('Failed to save feedback:', error);
//         }
//     };

//     const loadFeedbackData = async () => {
//         try {
//             const savedFeedback = await AsyncStorage.getItem('unsavedFeedback');
//             if (savedFeedback) {
//                 const feedback = JSON.parse(savedFeedback);
//                 setRating(feedback.rating || 4);
//                 setReviewMessage(feedback.reviewMessage || '');
//                 setSelectedTags(feedback.selectedTags || []);
//             }
//         } catch (error) {
//             console.error('Failed to load feedback:', error);
//         }
//     };

//     const handleMediaSelect = (uri: string) => setSelectedMedia(uri);

//     const toggleTag = (tagId: string) => {
//         setSelectedTags((tags) =>
//             tags.includes(tagId) ? tags.filter((id) => id !== tagId) : [...tags, tagId]
//         );
//     };

//     const renderStars = () =>
//         Array.from({ length: 5 }, (_, index) => (
//             <FontAwesome
//                 key={index}
//                 name={index < rating ? 'star' : 'star-o'}
//                 size={50}
//                 color="#FFD700"
//                 onPress={() => setRating(index + 1)}
//             />
//         ));

//     const submitFeedback = async () => {
//         setLoading(true);  // Show loading spinner when starting the upload process

//         let imageUrl = null;
//         if (selectedMedia) {
//             imageUrl = await uploadImage(selectedMedia, 'user-uploads');
//         }

//         const feedbackData = {
//             userId: user?.uid,
//             routeId,
//             rating,
//             text: reviewMessage,
//             tags: selectedTags,
//             media: imageUrl,
//             timestamp: Timestamp.now(),
//         };

//         try {
//             await saveReview(feedbackData);
//             if (shareWithCommunity) {
//                 await saveCommunityPost({ routeName: routeName, ...feedbackData, timestamp: new Date() });
//             }
//             await AsyncStorage.removeItem('unsavedFeedback');
//             navigation.reset({ index: 0, routes: [{ name: 'CommunityStack', params: { screen: 'Community' } }] });
//         } catch (error) {
//             console.error('Error submitting feedback:', error);
//         } finally {
//             setLoading(false);  // Hide loading spinner after the process completes
//         }
//     };

//     return (
//         <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
//             <ScrollView contentContainerStyle={styles.container}>
//                 <Text style={styles.title}>Rate Your Experience</Text>
//                 <View style={styles.starContainer}>{renderStars()}</View>

//                 <Text style={styles.title}>Tag the Route</Text>
//                 <View style={styles.tagContainer}>
//                     {availableTags.map((tag) => (
//                         <TouchableOpacity
//                             key={tag.id}
//                             style={[
//                                 styles.tag,
//                                 selectedTags.includes(tag.id) ? styles.activeTag : styles.inactiveTag,
//                             ]}
//                             onPress={() => toggleTag(tag.id)}
//                         >
//                             <Text
//                                 style={[
//                                     styles.tagText,
//                                     selectedTags.includes(tag.id) ? styles.activeTagText : styles.inactiveTagText,
//                                 ]}
//                             >
//                                 {tag.name}
//                             </Text>
//                         </TouchableOpacity>
//                     ))}
//                 </View>

//                 <Text style={styles.title}>Share Your Thoughts</Text>
//                 <TextInput
//                     style={styles.textInput}
//                     placeholder="Write your thoughts here..."
//                     value={reviewMessage}
//                     onChangeText={setReviewMessage}
//                     multiline
//                 />

//                 <MediaUpload onSelectMedia={handleMediaSelect} />

//                 <View style={styles.checkboxContainer}>
//                     <CheckBox value={shareWithCommunity} onValueChange={setShareWithCommunity} />
//                     <Text style={styles.checkboxLabel}>Share with your community</Text>
//                 </View>

//                 {loading ? (  // Show loading spinner when in loading state
//                     <ActivityIndicator size="large" color="#6A1B9A" style={styles.loadingIndicator} />
//                 ) : (
//                     <TouchableOpacity style={styles.submitButton} onPress={submitFeedback}>
//                         <Text style={styles.submitButtonText}>Submit</Text>
//                     </TouchableOpacity>
//                 )}
//             </ScrollView>
//         </TouchableWithoutFeedback>
//     );
// };

// const styles = StyleSheet.create({
//     container: {
//         flexGrow: 1,
//         padding: 16,
//         backgroundColor: '#fff',
//     },
//     title: {
//         fontSize: 18,
//         fontWeight: 'bold',
//         marginVertical: 16,
//     },
//     starContainer: {
//         flexDirection: 'row',
//         marginBottom: 20,
//         alignSelf: 'center'
//     },
//     tagContainer: {
//         flexDirection: 'row',
//         flexWrap: 'wrap',
//         marginBottom: 20,
//     },
//     tag: {
//         borderRadius: 20,
//         paddingHorizontal: 12,
//         paddingVertical: 8,
//         margin: 4,
//     },
//     activeTag: {
//         backgroundColor: '#6A1B9A',
//     },
//     inactiveTag: {
//         backgroundColor: '#E0E0E0',
//     },
//     tagText: {
//         fontSize: 14,
//     },
//     activeTagText: {
//         color: '#fff',
//     },
//     inactiveTagText: {
//         color: '#000',
//     },
//     textInput: {
//         borderWidth: 1,
//         borderColor: '#ccc',
//         borderRadius: 8,
//         padding: 10,
//         textAlignVertical: 'top',
//         minHeight: 100,
//         marginBottom: 20,
//     },
//     checkboxContainer: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         marginBottom: 20,
//     },
//     checkboxLabel: {
//         marginLeft: 8,
//     },
//     submitButton: {
//         backgroundColor: '#6A1B9A',
//         padding: 15,
//         borderRadius: 8,
//         alignItems: 'center',
//     },
//     submitButtonText: {
//         color: '#fff',
//         fontSize: 16,
//         fontWeight: 'bold',
//     },
//     loadingIndicator: {
//         marginTop: 20,
//     },
// });

// export default FeedbackScreen;


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
    const routeName = route.params.routeName;

    const [rating, setRating] = useState(4);
    const [shareWithCommunity, setShareWithCommunity] = useState(false);
    const [reviewMessage, setReviewMessage] = useState('');
    const [selectedTags, setSelectedTags] = useState<any[]>([]);
    const [availableTags, setAvailableTags] = useState<any[]>([]);
    const [selectedMedia, setSelectedMedia] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [warningMessage, setWarningMessage] = useState<string | null>(null);

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
        if (selectedTags.includes(tagId)) {
            setSelectedTags((tags) => tags.filter((id) => id !== tagId));
        } else if (selectedTags.length < 3) {
            setSelectedTags((tags) => [...tags, tagId]);
        } else {
            setWarningMessage('You can select up to 3 tags only!');
            setTimeout(() => setWarningMessage(null), 3000);
        }
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
        setLoading(true);

        let imageUrl = null;
        if (selectedMedia) {
            imageUrl = await uploadImage(selectedMedia, 'user-uploads');
        }

        const feedbackData = {
            userId: user?.uid,
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
                await saveCommunityPost({ routeName: routeName, ...feedbackData, timestamp: new Date() });
            }
            await AsyncStorage.removeItem('unsavedFeedback');
            navigation.reset({ index: 0, routes: [{ name: 'CommunityStack', params: { screen: 'Community' } }] });
        } catch (error) {
            console.error('Error submitting feedback:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleLoginRedirect = () => {
        navigation.reset({ index: 0, routes: [{ name: 'AuthStack', params: { screen: 'Login' } }] });
    }

    if (!user?.uid) {
        return (
            <ScrollView contentContainerStyle={styles.container}>
                <Text style={styles.title}>Log in to Provide Feedback</Text>
                <TouchableOpacity onPress={handleLoginRedirect}>
                    <Text style={styles.loginPrompt}>
                        Tap here to log in and provide feedback on your route.
                    </Text>
                </TouchableOpacity>
            </ScrollView>
        );
    }

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

                {warningMessage && <Text style={styles.warning}>{warningMessage}</Text>}

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
                    <CheckBox
                        value={shareWithCommunity}
                        onValueChange={setShareWithCommunity}
                    />
                    <Text style={styles.checkboxLabel}>Share with your community</Text>
                </View>

                {loading ? (
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
        padding: 20,
        backgroundColor: '#f9f9f9', // Light background for a clean feel
    },
    title: {
        fontSize: 20,
        fontWeight: '600',
        marginBottom: 12,
        color: '#6A1B9A',
    },
    starContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 20,
    },
    tagContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: 20,
    },
    tag: {
        borderRadius: 20,
        paddingHorizontal: 15,
        paddingVertical: 8,
        margin: 5,
    },
    activeTag: {
        backgroundColor: '#6A1B9A',
    },
    inactiveTag: {
        backgroundColor: '#E0E0E0',
    },
    tagText: {
        fontSize: 16,
        fontWeight: '500',
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
        padding: 12,
        textAlignVertical: 'top',
        minHeight: 100,
        marginBottom: 20,
        fontSize: 16,
        backgroundColor: '#fff',
    },
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    checkboxLabel: {
        marginLeft: 10,
        fontSize: 16,
        color: '#333',
    },
    submitButton: {
        backgroundColor: '#6A1B9A',
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 8,
        alignItems: 'center',
        shadowColor: '#6A1B9A',
        shadowOpacity: 0.2,
        shadowRadius: 6,
        elevation: 5,
    },
    submitButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '700',
    },
    loadingIndicator: {
        marginTop: 20,
    },
    warning: {
        color: 'red',
        textAlign: 'center',
        marginTop: 8,
    },
    loginPrompt: {
        fontSize: 16,
        color: '#6A1B9A',
        textAlign: 'center',
        marginTop: 20,
        textDecorationLine: 'underline',
    },
});

export default FeedbackScreen;