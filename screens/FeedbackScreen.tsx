import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, StatusBar } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { FeedbackScreenNavigationProp } from '../src/types/types';


interface Props {
    navigation: FeedbackScreenNavigationProp;
}

const FeedbackScreen: React.FC<Props> = ({ navigation }) => {
    const [rating, setRating] = useState<number>(4); // Example initial rating
    const [shareWithCommunity, setShareWithCommunity] = useState<boolean>(false);
    const [thoughts, setThoughts] = useState<string>('');

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

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" />

            {/* Rate Your Experience */}
            <Text style={styles.sectionTitle}>Rate Your Experience</Text>
            <View style={styles.starContainer}>{renderStars()}</View>

            {/* Route Tags */}
            <Text style={styles.sectionTitle}>Tag the route</Text>
            <View style={styles.tagContainer}>
                {['Historical', 'Dog Friendly', 'Family Friendly', 'Scenic', 'Well-lit', 'Good for Photography', 'Challenging'].map((tag, index) => (
                    <TouchableOpacity key={index} style={[styles.tag, index < 3 ? styles.activeTag : styles.inactiveTag]}>
                        <Text style={index < 3 ? styles.activeTagText : styles.inactiveTagText}>{tag}</Text>
                    </TouchableOpacity>
                ))}
            </View>

            {/* Share any thoughts */}
            <Text style={styles.sectionTitle}>Share any thoughts</Text>
            <TextInput
                style={styles.textInput}
                placeholder="Write your thoughts here..."
                value={thoughts}
                onChangeText={setThoughts}
                multiline
            />

            {/* Share with community checkbox */}
            <View style={styles.checkboxContainer}>
                {/* <CheckBox value={shareWithCommunity} onValueChange={setShareWithCommunity} /> */}
                <Text style={styles.checkboxLabel}>Share with your community</Text>
            </View>

            {/* Submit button */}
            <TouchableOpacity style={styles.submitButton} onPress={() => { navigation.navigate('Community') }}>
                <Text style={styles.submitButtonText}>Submit</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#fff',
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