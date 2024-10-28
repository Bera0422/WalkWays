import React from 'react';
import { View, Text, TextInput, Image, FlatList, TouchableOpacity, StyleSheet, TouchableWithoutFeedback, Keyboard, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons'
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import RouteCard from '../components/RouteCard';
import SearchBar from '../components/SearchBar';

const filters = [
  { filterId: '1', name: 'Historical', icon: 'building-columns' },
  { filterId: '2', name: 'Scenic', icon: 'image' },
  { filterId: '3', name: 'Well-Lit', icon: 'lightbulb' },
  { filterId: '4', name: 'Family Friendly', icon: 'children' },
  { filterId: '5', name: 'Dog Friendly', icon: 'dog' },
  { filterId: '6', name: 'Challenging', icon: 'hill-rockslide' },
  { filterId: '7', name: 'Good for Photography', icon: 'camera' },
  // Add more filters as needed
];

const routes = [
  {
    id: '1',
    name: 'Manhattan Walk',
    distance: '3.2 miles',
    time: '1 hour',
    rating: 4.5,
    tags: [
      { id: '1', name: 'City Skyline', icon: 'city' },
      { id: '2', name: 'Best for Tourists', icon: 'suitcase' },
    ],
    image: require('../assets/manhattan.jpg'), // Placeholder image
  },
  {
    id: '2',
    name: 'Rome Historic Walk',
    distance: '4 miles',
    time: '1 hour 20 min',
    rating: 5.0,
    tags: [
      { id: '1', name: 'Ancient Ruins', icon: '' },
      { id: '2', name: 'Cobblestone Streets', icon: '' },
    ],
    image: require('../assets/rome.jpg'), // Placeholder image
  },
  {
    id: '3',
    name: 'Golden Gate Stroll',
    distance: '2.8 miles',
    time: '50 mins',
    rating: 4.8,
    tags: [
      { id: '1', name: 'Scenic', icon: 'image' },
      { id: '2', name: 'Iconic', icon: 'grin-stars' },
    ],
    image: require('../assets/golden_gate.jpg'), // Placeholder image
  },
];


const HomeScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={styles.container}>
        <StatusBar barStyle="light-content" />

        {/* Header with Search and Filters */}
        <View style={styles.header}>
          {/* <Text style={styles.title}>WalkWays</Text> */}
          <SearchBar placeholder="Find routes to walk" />

          <FlatList
            data={filters}
            horizontal
            keyExtractor={(item) => item.filterId}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.filterCard}>
                <FontAwesome6 name={item.icon} size={18} color="#fff" style={styles.filterIcon} />
                <Text style={styles.filterText}>{item.name}</Text>
              </TouchableOpacity>
            )}
            contentContainerStyle={styles.filterContainer}
            showsHorizontalScrollIndicator={false}
          />
        </View>

        {/* Route List */}

        <FlatList
          data={routes}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <RouteCard
              item={item}
              onPress={() => navigation.navigate('RouteDetails', { routeItem: item })}
            />
          )}
        />

      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
    paddingTop: 10,
  },
  header: {
    paddingHorizontal: 20,
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10
  },
  filterButton: {
    padding: 8,
    backgroundColor: '#6A2766',
    borderRadius: 8,
    marginHorizontal: 10,
    flexDirection: 'row'
  },
  filterCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#6A2766',
    padding: 10,
    marginHorizontal: 5,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  filterIcon: {
    marginRight: 5,
  },
  filterText: {
    fontSize: 14,
    color: '#fff',
  },
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
  tag: {
    flexDirection: 'row',
    backgroundColor: '#eee',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    marginRight: 5,
    fontSize: 12,
    color: '#333',
  },
  tagIcon: {
    marginRight: 4,
  },
  tagText: {
    fontSize: 12,
    color: '#333',
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderColor: '#ddd',
  },
});

export default HomeScreen;