import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import Tag from './Tag';
import { Route } from '../types/types';

interface Props {
  item: Route;
  onPress: () => void;
}

const { width } = Dimensions.get('window');

const RouteCard: React.FC<Props> = ({ item, onPress }) => {
  const isCurated = item.curated;

  return (
    <TouchableOpacity onPress={onPress} style={styles.card}>
      {/* Larger Image */}
      {item.image && <Image source={{ uri: item.image }} style={styles.cardImage} />}

      {/* Content Section */}
      <View style={styles.content}>
        {/* Route Name */}
        <Text style={styles.routeName} numberOfLines={1}>
          {item.name}
        </Text>

        {/* Distance and Time */}
        <View style={styles.detailsRow}>
          <View style={styles.detailItem}>
            <Ionicons name="walk" size={20} color="#6C63FF" />
            <Text style={styles.detailText}>{item.distance}</Text>
          </View>
          <View style={styles.detailItem}>
            <Ionicons name="time-outline" size={20} color="#6C63FF" />
            <Text style={styles.detailText}>{item.estimatedTime}</Text>
          </View>
        </View>

        {/* Rating and Badge */}
        <View style={styles.detailsRow}>
          <View style={styles.ratingContainer}>
            <Ionicons name="star" size={20} color="#FFD700" />
            <Text style={styles.ratingText}>{item.rating.toFixed(1)}</Text>
          </View>
          <View style={isCurated ? styles.curatedBadge : styles.userGeneratedBadge}>
            <FontAwesome name={isCurated ? 'check-circle' : 'user'} size={16} color={isCurated ? "#FFF" : "#D32F2F"} />
            <Text style={isCurated ? styles.curatedBadgeText : styles.userGeneratedBadgeText}>
              {isCurated ? 'Curated' : 'User-Generated'}
            </Text>
          </View>
        </View>
      </View>

      {/* Tags */}
      <View style={styles.tagsContainer}>
        {item.tags.map((tag) => (
          <Tag key={tag.id} icon={tag.icon} text={tag.name} />
        ))}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    marginVertical: 10,
    marginHorizontal: 15,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
    padding: 15,
    backgroundColor: '#fff',
  },
  cardImage: {
    width: '100%',
    height: width * 0.5, // Aspect ratio for image
    borderRadius: 12,
    marginBottom: 15,
  },
  content: {
    paddingHorizontal: 10,
  },
  routeName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
    marginBottom: 10,
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailText: {
    marginLeft: 6,
    fontSize: 16,
    color: '#555',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    marginLeft: 4,
    fontSize: 18,
    color: '#333',
    fontWeight: '600',
  },
  badgeContainer: {
    marginLeft: 10,
  },
  curatedBadge: {
    backgroundColor: '#6C63FF', // Keep primary theme color
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20, // Rounded for a pill-like appearance
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 4, // For Android shadow
    flexDirection: 'row', // Add flex for icon and text alignment
    alignItems: 'center',
    gap: 8, // Spacing between icon and text
  },
  curatedBadgeText: {
    fontSize: 14,
    fontWeight: '700', // Stronger font weight for emphasis
    color: '#FFF',
  },
  userGeneratedBadge: {
    backgroundColor: '#FFCDD2', // Soft background to complement the text
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 4,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  userGeneratedBadgeText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#D32F2F', // Red text for emphasis
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
  },
});

export default RouteCard;
