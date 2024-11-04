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
    <View style={styles.detailsContainer}>
      <Image source={item.image} style={styles.cardImage} />

      {/* Rating */}
      <View style={styles.ratingContainer}>
        <Ionicons name="star" size={16} color="#FFD700" />
        <Text style={styles.ratingText}>{item.rating}</Text>
      </View>

      <View style={styles.cardContent}>
        <Text style={styles.routeName}>{item.name}</Text>

        {/* Distance */}
        <View style={styles.detailTextContainer}>
          <Text style={styles.detailLabel}>Distance:</Text>
          <Text style={styles.detailValue}>{item.distance}</Text>
        </View>

        {/* Estimated Time */}
        <View style={styles.detailTextContainer}>
          <Text style={styles.detailLabel}>Estimated Time:</Text>
          <Text style={styles.detailValue}>{item.time}</Text>
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

const styles = StyleSheet.create({
  card: {
    flexDirection: 'column',
    margin: 15,
    padding: 20,
    backgroundColor: '#EBDCF5',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
  },
  detailsContainer: {
    flexDirection: 'row',
  },
  cardImage: {
    width: 110,
    height: 110,
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
  },
  routeName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  detailTextContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 25, 
  },
  detailLabel: {
    color: '#555',
    fontSize: 15,
  },
  detailValue: {
    color: '#333',
    fontSize: 15,
  },
  tagsContainer: {
    flexDirection: 'row',
    marginTop: 10,
  },
});

export default RouteCard;
