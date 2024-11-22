import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, TouchableWithoutFeedback, Keyboard, StatusBar, ActivityIndicator } from 'react-native';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import RouteCard from '../src/components/RouteCard';
import SearchBar from '../src/components/SearchBar';
import _routes from '../data/routes';
import { Route } from '../src/types/types';
import { fetchRoutes, fetchTags } from '../src/services/firestoreService';

const HomeScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [routes, setRoutes] = useState<Route[]>([]);
  const [filters, setFilters] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filteredRoutes, setFilteredRoutes] = useState<Route[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState<string[]>([]);

  useEffect(() => {
    // Fetch routes data from Firestore when the component mounts
    const getRoutes = async () => {
      try {
        const fetchedRoutes = await fetchRoutes();
        setRoutes(fetchedRoutes);
        setFilteredRoutes(fetchedRoutes);
      } catch (error) {
        console.error("Failed to fetch routes:", error);
      } finally {
        setLoading(false);
      }
    };

    getRoutes();
  }, []);

  useEffect(() => {
    const getFilters = async () => {
      try {
        const fetchedFilters = await fetchTags();
        setFilters(fetchedFilters);
      } catch (error) {
        console.error("Failed to fetch filters:", error);
      } finally {
        setLoading(false);
      }
    };

    getFilters();
  }, []);

  const handleFilter = (filterId: string) => {
    const isSelected = activeFilters.includes(filterId);
    const newFilters = isSelected
      ? activeFilters.filter(id => id !== filterId)
      : [...activeFilters, filterId];

    setActiveFilters(newFilters);

    // Filter routes based on active filters
    const filtered = routes.filter(route =>
      newFilters.every(filter => route.tags.some(tag => tag.id === filter))
    );
    setFilteredRoutes(filtered);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    const filtered = routes.filter(route =>
      route.name.toLowerCase().includes(query.toLowerCase()) ||
      route.details.description.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredRoutes(filtered);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator
          size="large"
          color={"#000"}
        />
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={styles.container}>
        <StatusBar barStyle="light-content" />

        {/* Header with Search and Filters */}
        <View style={styles.header}>
          {/* <Text style={styles.title}>WalkWays</Text> */}
          <SearchBar
            placeholder="Find routes to walk"
            value={searchQuery}
            onChangeText={handleSearch}
          />

          <FlatList
            data={filters}
            horizontal
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[styles.filterCard, activeFilters.includes(item.id) && styles.selectedFilter]}
                onPress={() => handleFilter(item.id)}
              >
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
          data={filteredRoutes}
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
  selectedFilter: {
    backgroundColor: '#B39DDB', // Highlight selected filter
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default HomeScreen;