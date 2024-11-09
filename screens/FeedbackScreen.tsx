// FeedbackScreen.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, StatusBar, TouchableWithoutFeedback, Keyboard, SafeAreaView, AppState, AppStateStatus } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { FeedbackScreenNavigationProp, FeedbackScreenRouteProp } from '../src/types/props';
import { getData, saveData } from '../src/utils/storage';
import CheckBox from 'expo-checkbox';
import MediaUpload from '../components/MediaUpload';
import { ScrollView } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
    const [selectedTags, setSelectedTags] = useState<string[]>(['Historical', 'Dog Friendly', 'Family Friendly']);
    const [selectedMedia, setSelectedMedia] = useState<string | null>(null);
    const routeId = route.params.routeId;

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

    const toggleTag = (tag: string) => {
        setSelectedTags((prevTags) =>
            prevTags.includes(tag) ? prevTags.filter((t) => t !== tag) : [...prevTags, tag]
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
        const reviewData = {
            routeId: routeId,
            id: '1',
            name: 'John Doe',
            avatar: require('../assets/avatars/1.jpg'),
            rating: rating,
            date: '2 weeks ago',
            tags: selectedTags,
            message: reviewMessage,
            shareWithCommunity: shareWithCommunity,
            media: selectedMedia
        };

        try {
            const allReviews = (await getData('reviews')) || [];
            reviewData.id = (allReviews.length + 1).toString();
            await saveData('reviews', [...allReviews, reviewData]);
            console.log('Feedback saved:', reviewData);
        } catch (error) {
            console.error('Error saving feedback:', error);
        }
        await AsyncStorage.removeItem('unsavedFeedback')
        navigation.reset({
            index: 0,
            routes: [{ name: 'CommunityStack', params: { screen: 'Community' } }],
        })
    };

    return (
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <ScrollView style={styles.container} contentContainerStyle={styles.scrollContainer}>
            {/* <ScrollView> */}
            <Text style={styles.sectionTitle}>Rate Your Experience</Text>
            <View style={styles.starContainer}>{renderStars()}</View>

            <Text style={styles.sectionTitle}>Tag the route</Text>
            <View style={styles.tagContainer}>
                {['Historical', 'Dog Friendly', 'Family Friendly', 'Scenic', 'Well-lit', 'Good for Photography', 'Challenging'].map((tag) => (
                    <TouchableOpacity
                        key={tag}
                        style={[styles.tag, selectedTags.includes(tag) ? styles.activeTag : styles.inactiveTag]}
                        onPress={() => toggleTag(tag)}
                    >
                        <Text style={selectedTags.includes(tag) ? styles.activeTagText : styles.inactiveTagText}>{tag}</Text>
                    </TouchableOpacity>
                ))}
            </View>

            <Text style={styles.sectionTitle}>Share any thoughts</Text>
            <TextInput
                style={styles.textInput}
                placeholder="Write your thoughts here..."
                value={reviewMessage}
                onChangeText={(text) => {setReviewMessages(text); setFeedback({ ...feedback, comments: text})}}
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
        borderRadius: 20,
        margin: 4,
    },
    activeTag: {
        backgroundColor: '#6A1B9A',
    },
    inactiveTag: {
        backgroundColor: '#F0F0F0',
    },
    activeTagText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    inactiveTagText: {
        color: '#808080',
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
