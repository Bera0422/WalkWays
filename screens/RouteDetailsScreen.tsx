import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { RouteDetailsScreenRouteProp, RouteDetailsScreenNavigationProp } from '../src/types/types';
import { FontAwesome } from '@expo/vector-icons'; // For star icons
import Review from '../components/Review';
import { Dimensions } from 'react-native';
import MapView, { Polyline } from 'react-native-maps';
import { getData } from '../src/utils/storage';

const win = Dimensions.get('window');

type RouteDetail = {
  name: string;
  distance: string;
  time: string;
  elevation: string;
  tags: string[];
  images: any[]; // List of images for the carousel
  description: string;
  rating: number;
  reviews: Review[];
};

type Review = {
  id: string;
  name: string;
  avatar: any;
  rating: number;
  date: string;
  tags: string[];
  message?: string;
};

// Sample data for the selected route
const routeDetail: RouteDetail = {
  name: 'Manhattan Walk',
  distance: '3.2 miles',
  time: '1 hour',
  elevation: 'Mostly Flat',
  tags: ['City Skyline', 'Family-Friendly', 'Scenic'],
  images: [
    require('../assets/manhattan.jpg'),
    require('../assets/golden_gate.jpg'),
    require('../assets/rome.jpg'),
  ],
  description: 'Experience the best views of the city skyline on this scenic route...',
  rating: 4.5,
  reviews: [
    {
      id: '1',
      name: 'John Doe',
      avatar: require('../assets/avatars/1.jpg'),
      rating: 5,
      date: '2 weeks ago',
      tags: ['Scenic', 'Dog-Friendly', 'Well-Maintained'],
      message: 'Loved the scenic views and it was perfect for my dog!',
    },
    {
      id: '2',
      name: 'Joe Smith',
      avatar: require('../assets/avatars/42.jpg'),
      rating: 4,
      date: '1 month ago',
      tags: ['Family-Friendly', 'Relaxing'],
      message: 'A bit crowded but overall a lovely experience.',
    },
  ],
};

interface Props {
  route: RouteDetailsScreenRouteProp;
  navigation: RouteDetailsScreenNavigationProp;
}

const RouteDetailsScreen: React.FC<Props> = ({ route, navigation }) => {
  const [routeReviews, setRouteReviewse] = useState<any[]>([]);
  const routeId = route.params.routeItem.id;
  useEffect(() => {
    const fetchRouteFeedback = async () => {
      const allFeedbacks = await getData('reviews');
      const routeSpecificFeedbacks = allFeedbacks?.filter((f: any) => f.routeId === routeId) || [];
      setRouteReviewse(routeSpecificFeedbacks);
    };

    fetchRouteFeedback();
  }, [routeId]);

  console.log(routeReviews)

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <ScrollView style={styles.scrollContainer}>
        {/* Image Carousel */}
        <FlatList
          data={routeDetail.images}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => <Image source={item} style={styles.carouselImage} />}
        />

        {/* Route Information */}
        <View style={styles.detailsContainer}>
          <Text style={styles.routeName}>{routeDetail.name}</Text>
          <View style={styles.tagsAndRating}>
            <View style={styles.tagsContainer}>
              {routeDetail.tags.map((tag, index) => (
                <Text key={index} style={styles.tag}>{tag}</Text>
              ))}
            </View>
            <Text style={styles.rating}>
              {routeDetail.rating} <FontAwesome name="star" color="#FFD700" />
            </Text>
          </View>

          {/* Description */}
          <Text style={styles.descriptionTitle}>Description</Text>
          <Text style={styles.descriptionText}>{routeDetail.description}</Text>

        </View>

        {/* <View style={styles.mapPreview}>
          <Text>Map Preview Placeholder</Text>
        </View> */}

        {/* Map View */}
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: 37.78825,
            longitude: -122.4324,
            latitudeDelta: 0.01,
            longitudeDelta: 0.005,
          }}
        >
          {/* Placeholder Polyline Route */}
          <Polyline
            coordinates={[
              { latitude: 37.78825, longitude: -122.4324 },
              { latitude: 37.78525, longitude: -122.4324 },
            ]}
            strokeColor="#0000FF"
            strokeWidth={3}
          />
        </MapView>

        {/* Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.stat}>
            <Text style={styles.statLabel}>Estimated Time</Text>
            <Text style={styles.statValue}>{routeDetail.time}</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statLabel}>Distance</Text>
            <Text style={styles.statValue}>{routeDetail.distance}</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statLabel}>Elevation</Text>
            <Text style={styles.statValue}>{routeDetail.elevation}</Text>
          </View>
        </View>

        {/* Community Feedback */}
        <View style={styles.feedbackContainer}>
          <Text style={styles.feedbackTitle}>Community Feedback</Text>
          <FlatList
            // data={routeDetail.reviews}
            data={routeReviews}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <Review review={item} />}
            scrollEnabled={false} // This keeps feedback list from conflicting with main scroll
          />
        </View>
        <TouchableOpacity onPress={() => console.log('Read More Reviews')}>
          <Text style={styles.readMore}>Read more</Text>
        </TouchableOpacity>
      </ScrollView>
      {/* Fixed Start Walk Button */}
      <TouchableOpacity
        style={styles.startWalkButton}
        onPress={() => 
          navigation.reset({
            index: 0,
            routes: [{ name: 'TrackingStack', params: { screen: 'Tracking', params: { routeId } } }],
        })
      }
      >
        <Text style={styles.startWalkText}>Start Walk</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f8f8' },
  scrollContainer: {
    paddingBottom: 80, // Leaves space for the Start Walk button
  },
  carouselImage: { width: win.width, height: 200 },
  detailsContainer: { padding: 20 },
  routeName: { fontSize: 24, fontWeight: 'bold', color: '#333' },
  tagsAndRating: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  tagsContainer: { flexDirection: 'row', flexWrap: 'wrap' },
  tag: { backgroundColor: '#e0e0e0', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 15, marginRight: 5, marginBottom: 5 },
  rating: { fontSize: 18, color: '#333' },
  mapPreview: { backgroundColor: '#d0d0d0', height: 150, justifyContent: 'center', alignItems: 'center', marginVertical: 20 },
  mapPreviewText: { fontSize: 16, color: '#555' },
  map: {
    height: 200,
    marginVertical: 10,
    marginHorizontal: 10,
    borderRadius: 10,
  },
  descriptionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  descriptionText: {
    fontSize: 14,
    color: '#555',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 15,
  },
  stat: {
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 12,
    color: '#888',
  },
  statValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  feedbackContainer: {
    padding: 20,
  },
  feedbackTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  reviewContainer: { flexDirection: 'row', marginVertical: 10 },
  avatar: { width: 50, height: 50, borderRadius: 25 },
  reviewContent: { marginLeft: 10, flex: 1 },
  reviewHeader: { flexDirection: 'row', justifyContent: 'space-between' },
  reviewStars: { fontSize: 14, color: '#FFD700' },
  reviewDate: { fontSize: 12, color: '#555' },
  reviewTag: { backgroundColor: '#e0e0e0', padding: 5, borderRadius: 10, fontSize: 12, marginRight: 5 },
  reviewMessage: { fontSize: 14, color: '#555', marginTop: 5 },
  readMore: { fontSize: 16, color: '#007bff', textAlign: 'center', marginBottom: 70 },
  startWalkButton: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#4CAF50',
    paddingVertical: 15,
    alignItems: 'center',
  },
  startWalkText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default RouteDetailsScreen;