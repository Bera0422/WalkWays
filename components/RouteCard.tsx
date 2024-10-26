import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Tag from './Tag';
import { Route } from '../src/types/RouteTypes';

interface Props {
    item: Route,
    onPress: () => void
}

const RouteCard: React.FC<Props> = ({ item, onPress }) => (
  <TouchableOpacity onPress={onPress} style={styles.card}>
    <Image source={item.image} style={styles.cardImage} />

    {/* Rating */}
    <View style={styles.ratingContainer}>
      <Ionicons name="star" size={16} color="#FFD700" />
      <Text style={styles.ratingText}>{item.rating}</Text>
    </View>

    <View style={styles.cardContent}>
      <Text style={styles.routeName}>{item.name}</Text>
      <Text style={styles.routeDetails}>{`${item.distance} • ${item.time}`}</Text>

      {/* Tags */}
      <View style={styles.tagsContainer}>
        {item.tags.map((tag) => (
          <Tag key={tag.id} icon={tag.icon} text={tag.name} />
        ))}
      </View>
    </View>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    margin: 10,
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
  },
  cardImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 10,
  },
  ratingContainer: {
    position: 'absolute',
    top: 10,
    right: 10,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 6,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
  },
  ratingText: {
    marginLeft: 4,
    fontSize: 14,
    color: '#333',
  },
  cardContent: {
    flex: 1,
    justifyContent: 'center',
  },
  routeName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  routeDetails: {
    color: '#555',
  },
  tagsContainer: {
    flexDirection: 'row',
    marginTop: 4,
  },
});

export default RouteCard;
