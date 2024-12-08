import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    Keyboard,
    SafeAreaView,
    ActivityIndicator,
} from 'react-native';
import CheckBox from 'expo-checkbox';
import { FontAwesome } from '@expo/vector-icons';
import { useAuth } from '../src/context/AuthContext';
import MediaUpload from '../src/components/MediaUpload';
import {
    fetchTags,
    saveRoute,
    uploadImage,
} from '../src/services/firestoreService';
import { SaveRouteScreenNavigationProp, SaveRouteScreenRouteProp } from '../src/types/props';
import { GeoPoint, Timestamp } from 'firebase/firestore';
import { convertDistance } from 'geolib';

interface Props {
    route: SaveRouteScreenRouteProp;
    navigation: SaveRouteScreenNavigationProp;
}
const SaveRouteScreen: React.FC<Props> = ({ route, navigation }) => {

    const routeWaypoints = route.params.routeWaypoints;
    const distanceWalked = route.params.distanceWalked;
    const estimatedTime = route.params.estimatedTime;

    const elevationOptions = ['Flat', 'Hilly', 'Mixed'];

    const [routeName, setRouteName] = useState('');
    const [description, setDescription] = useState('');
    const [elevation, setElevation] = useState(elevationOptions[0]);
    const [rating, setRating] = useState(4);
    const [selectedTags, setSelectedTags] = useState<any[]>([]);
    const [availableTags, setAvailableTags] = useState<any[]>([]);
    const [selectedMedia, setSelectedMedia] = useState<string | null>(null);
    const [shareOnHome, setShareOnHome] = useState(false);
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
    }, []);

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
            <TouchableOpacity
            key={index}
            onPress={() => setRating(index + 1)}
        >
            <FontAwesome
                name={index < rating ? 'star' : 'star-o'}
                size={50}
                color="#FFD700"
            />
            </TouchableOpacity>
        ));

    const submitRoute = async () => {
        if (!routeName.trim()) {
            alert('Route name is required.');
            return;
        }

        setLoading(true);

        let imageUrl = null;
        if (selectedMedia) {
            imageUrl = await uploadImage(selectedMedia, 'route-uploads');
        }

        const routeData = {
            details: {
                description: description,
                images: imageUrl ? [imageUrl] : [],
                location: new GeoPoint(routeWaypoints[0].latitude, routeWaypoints[0].longitude),
                waypoints: routeWaypoints.map((waypoint) => new GeoPoint(waypoint.latitude, waypoint.longitude)),
            },
            distance: `${convertDistance(distanceWalked, 'mi').toFixed(2)} miles`,
            elevation: elevation,
            estimatedTime: `${Math.floor(estimatedTime / 60).toString()} mins`,
            name: routeName,
            rating: rating,
            reviewCount: 1,
            tags: selectedTags,
            timestamp: Timestamp.now(),
            displayOnHome: shareOnHome,
            curated: false,
        };

        try {
            await saveRoute(routeData);
            navigation.reset({ index: 0, routes: [{ name: 'HomeStack', params: { screen: 'Home' } }] });
        } catch (error) {
            console.error('Error saving route:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <Text style={styles.title}>Save Your Route</Text>

                <TextInput
                    style={styles.textInput}
                    placeholder="Route Name"
                    value={routeName}
                    onChangeText={setRouteName}
                />

                <Text style={styles.title}>Upload Route Photo</Text>
                <MediaUpload onSelectMedia={handleMediaSelect} />

                <Text style={styles.title}>Brief Description</Text>
                <TextInput
                    style={[styles.textInput, styles.multiLineInput]}
                    placeholder="Write a brief description..."
                    value={description}
                    onChangeText={setDescription}
                    multiline
                />

                <Text style={styles.title}>Elevation Feedback</Text>
                {elevationOptions.map((option) => (
                    <TouchableOpacity
                        key={option}
                        style={[
                            styles.option,
                            elevation === option && styles.activeOption,
                        ]}
                        onPress={() => setElevation(option)}
                    >
                        <Text
                            style={[
                                styles.optionText,
                                elevation === option && styles.activeOptionText,
                            ]}
                        >
                            {option}
                        </Text>
                    </TouchableOpacity>
                ))}

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

                <Text style={styles.title}>Rate Your Route</Text>
                <View style={styles.starContainer}>{renderStars()}</View>

                <View style={styles.checkboxContainer}>
                    <CheckBox value={shareOnHome} onValueChange={setShareOnHome} />
                    <Text style={styles.checkboxLabel}>Share on Home Screen</Text>
                </View>

                {loading ? (
                    <ActivityIndicator size="large" color="#6A1B9A" style={styles.loadingIndicator} />
                ) : (
                    <TouchableOpacity style={styles.submitButton} onPress={submitRoute}>
                        <Text style={styles.submitButtonText}>Save Route</Text>
                    </TouchableOpacity>
                )}
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
    scrollContent: { padding: 16 },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginVertical: 12,
        color: '#6A1B9A',
    },
    textInput: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 12,
        padding: 12,
        marginBottom: 16,
        fontSize: 16,
        backgroundColor: '#f9f9f9',
    },
    multiLineInput: { minHeight: 100, textAlignVertical: 'top' },
    option: {
        padding: 12,
        borderWidth: 1,
        borderRadius: 8,
        borderColor: '#ccc',
        marginBottom: 12,
        backgroundColor: '#f9f9f9',
    },
    activeOption: { backgroundColor: '#6A1B9A', borderColor: '#6A1B9A' },
    optionText: { textAlign: 'center', fontSize: 16 },
    activeOptionText: { color: '#fff', fontWeight: 'bold' },
    tagContainer: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 16 },
    tag: {
        margin: 6,
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 25,
        borderWidth: 1,
        borderColor: '#ccc',
        backgroundColor: '#E0E0E0',
    },
    activeTag: { backgroundColor: '#6A1B9A', borderColor: '#6A1B9A' },
    inactiveTag: { backgroundColor: '#E0E0E0' },
    tagText: { fontSize: 14, color: '#333' },
    activeTagText: { color: '#fff' },
    inactiveTagText: { color: '#333' },
    starContainer: { flexDirection: 'row', justifyContent: 'center', marginVertical: 16 },
    checkboxContainer: { flexDirection: 'row', alignItems: 'center', marginVertical: 16 },
    checkboxLabel: { marginLeft: 10, fontSize: 16, color: '#333' },
    submitButton: {
        backgroundColor: '#6A1B9A',
        paddingVertical: 15,
        paddingHorizontal: 25,
        borderRadius: 12,
        alignItems: 'center',
        marginVertical: 20,
    },
    submitButtonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
    loadingIndicator: { marginTop: 20 },
    warning: {
        color: 'red',
        textAlign: 'center',
        marginVertical: 8,
    },
});

export default SaveRouteScreen;