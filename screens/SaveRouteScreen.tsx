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

    const [routeName, setRouteName] = useState('');
    const [description, setDescription] = useState('');
    const [elevation, setElevation] = useState('');
    const [rating, setRating] = useState(4);
    const [selectedTags, setSelectedTags] = useState<any[]>([]);
    const [availableTags, setAvailableTags] = useState<any[]>([]);
    const [selectedMedia, setSelectedMedia] = useState<string | null>(null);
    const [shareOnHome, setShareOnHome] = useState(false);
    const [loading, setLoading] = useState(false);

    const elevationOptions = ['Flat', 'Hilly', 'Mixed'];

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
    title: { fontSize: 18, fontWeight: 'bold', marginVertical: 16 },
    textInput: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        padding: 10,
        marginBottom: 16,
    },
    multiLineInput: { minHeight: 100, textAlignVertical: 'top' },
    option: {
        padding: 10,
        borderWidth: 1,
        borderRadius: 8,
        borderColor: '#ccc',
        marginBottom: 10,
    },
    activeOption: { backgroundColor: '#6A1B9A', borderColor: '#6A1B9A' },
    optionText: { textAlign: 'center' },
    activeOptionText: { color: '#fff' },
    tagContainer: { flexDirection: 'row', flexWrap: 'wrap' },
    tag: { margin: 4, padding: 10, borderRadius: 20 },
    activeTag: { backgroundColor: '#6A1B9A' },
    inactiveTag: { backgroundColor: '#E0E0E0' },
    tagText: { fontSize: 14 },
    activeTagText: { color: '#fff' },
    inactiveTagText: { color: '#000' },
    starContainer: { flexDirection: 'row', justifyContent: 'center', marginBottom: 20 },
    checkboxContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
    checkboxLabel: { marginLeft: 8 },
    submitButton: {
        backgroundColor: '#6A1B9A',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
    },
    submitButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
    loadingIndicator: { marginTop: 20 },
});

export default SaveRouteScreen;
