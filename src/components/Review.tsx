import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import Tag from './Tag';
import { Avatar } from 'react-native-paper';
import { IReview } from '../types/types';

type ReviewProps = {
    review: IReview;
};

const Review: React.FC<ReviewProps> = ({ review }) => {
    const renderStars = () => {
        const totalStars = 5;
        const filledStars = Array(review.rating).fill('★');
        const unfilledStars = Array(totalStars - review.rating).fill('★');

        return (
            <Text style={styles.reviewStars}>
                {filledStars.map((star, index) => (
                    <Text key={`filled-${index}`} style={styles.filledStar}>
                        {star}
                    </Text>
                ))}
                {unfilledStars.map((star, index) => (
                    <Text key={`unfilled-${index}`} style={styles.unfilledStar}>
                        {star}
                    </Text>
                ))}
            </Text>
        );
    };

    return (
        <View style={styles.reviewContainer}>
            {/* Header Section */}
            <View style={styles.header}>
                <Avatar.Text
                    style={styles.avatar}
                    size={40}
                    label={review.name && review.name.charAt(0).toUpperCase()}
                />
                <View style={styles.headerDetails}>
                    <Text style={styles.reviewUser}>{review.name}</Text>
                    <Text style={styles.reviewDate}>
                        {review.timestamp.toDate().toLocaleDateString()}
                    </Text>
                </View>
            </View>

            {/* Star Rating */}
            <View style={styles.reviewHeader}>{renderStars()}</View>

            {/* Tags Section */}
            {review.tags && (
                <View style={styles.tagsContainer}>
                    {review.tags.map((tag) => (
                        <Tag key={tag.id} icon={tag.icon} text={tag.name} />
                    ))}
                </View>
            )}

            {/* Review Message */}
            {review.text && <Text style={styles.reviewMessage}>{review.text}</Text>}

            {/* Media Section */}
            {review.media && (
                <Image source={{ uri: review.media }} style={styles.reviewMedia} />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    reviewContainer: {
        padding: 16,
        backgroundColor: '#ffffff',
        borderRadius: 12,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
        elevation: 3,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    avatar: {
        marginRight: 12,
        backgroundColor: '#6c63ff', // Purple background for avatar
    },
    headerDetails: {
        flex: 1,
    },
    reviewUser: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    reviewDate: {
        fontSize: 12,
        color: '#888',
    },
    reviewHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    reviewStars: {
        flexDirection: 'row',
        fontSize: 16,
    },
    filledStar: {
        color: '#FFD700', // Gold color for filled stars
    },
    unfilledStar: {
        color: '#E0E0E0', // Light gray for unfilled stars
    },
    tagsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: 8,
    },
    reviewMessage: {
        fontSize: 14,
        color: '#444',
        lineHeight: 20,
        marginBottom: 8,
    },
    reviewMedia: {
        width: '100%',
        height: 200,
        borderRadius: 10,
        marginTop: 10,
    },
});

export default Review;
