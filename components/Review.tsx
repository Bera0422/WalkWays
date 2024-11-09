import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { IReview } from '../src/types/types';
import Tag from './Tag';

type ReviewProps = {
    review: IReview
};

const Review: React.FC<ReviewProps> = ({ review }) => {
    const renderStars = () => {
        const totalStars = 5;
        const filledStars = Array(review.rating).fill('★');
        const unfilledStars = Array(totalStars - review.rating).fill('★');

        return (
            <Text style={styles.reviewStars}>
                {filledStars.map((star, index) => (
                    <Text key={`filled-${index}`} style={styles.filledStar}>{star}</Text>
                ))}
                {unfilledStars.map((star, index) => (
                    <Text key={`unfilled-${index}`} style={styles.unfilledStar}>{star}</Text>
                ))}
            </Text>
        );
    };

    return (
        <View style={styles.reviewContainer}>
            <View style={styles.header}>
                <Image source={{ uri: review.avatar }} style={styles.avatar} />
                <Text style={styles.reviewUser}>{review.name}</Text>
                <Text style={styles.reviewDate}>{review.timestamp.toDate().toLocaleDateString()}</Text>
            </View>

            <View style={styles.reviewHeader}>
                {renderStars()}
            </View>

            {/* Tags */}
            {review.tags && <View style={styles.tagsContainer}>
                {review.tags.map((tag) => (
                    <Tag key={tag.id} icon={tag.icon} text={tag.name} />
                ))}
            </View>}

            {review.text && <Text style={styles.reviewMessage}>{review.text}</Text>}
            {review.media && <Image source={{ uri: review.media }} style={styles.reviewMedia} />}

        </View>
    );
};

const styles = StyleSheet.create({
    reviewContainer: {
        padding: 15,
        backgroundColor: '#fff',
        borderRadius: 10,
        marginBottom: 10,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 1 },
        shadowRadius: 4,
        elevation: 2,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between', // Align name and date on the same row
        marginBottom: 5,
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 10,
    },
    reviewUser: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
        flex: 1, // Pushes the date to the right
    },
    reviewDate: {
        fontSize: 12,
        color: '#555',
    },
    reviewHeader: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        marginVertical: 5,
    },
    reviewStars: {
        flexDirection: 'row',
        fontSize: 14,
    },
    filledStar: {
        color: '#FFD700', // Gold color for filled stars
    },
    unfilledStar: {
        color: '#C0C0C0', // Gray color for unfilled stars
    },
    tagsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginVertical: 5,
    },
    reviewTag: {
        backgroundColor: '#e0e0e0',
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 10,
        fontSize: 12,
        color: '#555',
        marginRight: 5,
        marginBottom: 5,
    },
    reviewMessage: {
        fontSize: 14,
        color: '#555',
        marginTop: 5,
    },
    reviewMedia: {
        width: '100%',
        height: 150,
        borderRadius: 8,
        marginTop: 5
    },

});

export default Review;
