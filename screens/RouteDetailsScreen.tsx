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
  ActivityIndicator,
} from 'react-native';
import { RouteDetailsScreenRouteProp, RouteDetailsScreenNavigationProp } from '../src/types/props';
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import Review from '../src/components/Review';
import { Dimensions } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import { IReview, Route } from '../src/types/types';
import { fetchRouteDetails, fetchRouteReviews } from '../src/services/firestoreService';
import Tag from '../src/components/Tag';
import MapViewDirections from 'react-native-maps-directions';

const win = Dimensions.get('window');

interface Props {
  route: RouteDetailsScreenRouteProp;
  navigation: RouteDetailsScreenNavigationProp;
}

const RouteDetailsScreen: React.FC<Props> = ({ route, navigation }) => {
  const apiKey = process.env.GOOGLE_MAPS_API_KEY || "";

  const [routeReviews, setRouteReviews] = useState<IReview[]>([]);
  const routeId = route.params.routeItem.id;

  const [routeDetails, setRouteDetails] = useState<Route>();
  const [waypoints, setWaypoints] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getRoute = async () => {
      try {
        const fetchedRouteDetails = await fetchRouteDetails(routeId);
        setRouteDetails(fetchedRouteDetails);
        setWaypoints(
          fetchedRouteDetails.details.waypoints.map((waypoint) => ({
            latitude: waypoint.latitude,
            longitude: waypoint.longitude,
          }))
        );
      } catch (error) {
        console.error("Failed to fetch route:", error);
      } finally {
        setLoading(false);
      }
    };

    getRoute();
  }, []);

  useEffect(() => {
    const getRouteReviews = async () => {
      try {
        const fetchedReviews = await fetchRouteReviews(routeId);
        setRouteReviews(fetchedReviews);
      } catch (error) {
        console.error("Error fetching route reviews:", error);
      }
    };

    getRouteReviews();
  }, [routeId]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text style={styles.loadingText}>Fetching route details...</Text>
      </View>
    );
  }

  if (!routeDetails) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Route not found.</Text>
      </View>
    );
  }
  console.log(waypoints);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Image Carousel */}
        <FlatList
          data={routeDetails.details.images}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => <Image source={{ uri: item }} style={styles.carouselImage} />}
        />

        {/* Route Information */}
        <View style={styles.detailsContainer}>
          <Text style={styles.routeName}>{routeDetails.name}</Text>
          <View style={styles.tagsAndRating}>
            <View style={styles.tagsContainer}>
              {routeDetails.tags.map((tag) => (
                <Tag key={tag.id} icon={tag.icon} text={tag.name} />
              ))}
            </View>
            <Text style={styles.rating}>
              {routeDetails.rating.toFixed(1)} <FontAwesome name="star" size={18} color="#FFD700" />
            </Text>
          </View>

          <Text style={styles.descriptionTitle}>Description</Text>
          <Text style={styles.descriptionText}>{routeDetails.details.description}</Text>
        </View>

        {/* Map View */}
        <MapView
          // provider="google"
          style={styles.map}
          initialRegion={{
            latitude: routeDetails.details.location.latitude,
            longitude: routeDetails.details.location.longitude,
            latitudeDelta: 0.03, //41.902782 12.496366
            longitudeDelta: 0.03,
          }}
        >
          <MapViewDirections
            origin={waypoints[0]}
            destination={waypoints[waypoints.length - 1]}
            waypoints={waypoints}
            mode="WALKING"
            apikey={apiKey}
            strokeWidth={3}
            strokeColor="#FF6347"
          />
          <Marker coordinate={waypoints[0]} title="Start" pinColor="green" />
          <Marker coordinate={waypoints[waypoints.length - 1]} title="End" pinColor="red" />
        </MapView>

        <View style={styles.statsContainer}>
          <View style={styles.stat}>
          <Ionicons name="time" size={20} color="#6C63FF" />
          <Text style={styles.statLabel}>Estimated Time</Text>
            <Text style={styles.statValue}>{routeDetails.estimatedTime}</Text>
          </View>
          <View style={styles.stat}>
          <Ionicons name="walk" size={20} color="#6C63FF" />
          <Text style={styles.statLabel}>Distance</Text>
            <Text style={styles.statValue}>{routeDetails.distance}</Text>
          </View>
          <View style={styles.stat}>
          <Ionicons name="triangle" size={20} color="#6C63FF" />
          <Text style={styles.statLabel}>Elevation</Text>
            <Text style={styles.statValue}>{routeDetails.elevation}</Text>
          </View>
        </View>


        {/* Community Feedback */}

        <View style={styles.feedbackContainer}>
          <Text style={styles.feedbackTitle}>Community Feedback</Text>
          {routeReviews.length > 0 ? (
            <FlatList
              data={routeReviews}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => <Review review={item} />}
              scrollEnabled={false}
            />) : <Text style={styles.feedbackTitle}>No reviews</Text>
          }

        </View>
      </ScrollView>

      {/* Start Walk Button */}
      <TouchableOpacity
        style={styles.startWalkButton}
        onPress={() =>
          navigation.reset({
            index: 0,
            routes: [{ name: 'TrackingStack', params: { screen: 'Tracking', params: { routeDetails } } }],
          })
        }
      >
        <Text style={styles.startWalkText}>Start Walk</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const Stat = ({ label, value }: { label: string, value: any }) => (
  <View style={styles.stat}>
    <Text style={styles.statLabel}>{label}</Text>
    <Text style={styles.statValue}>{value}</Text>
  </View>
);

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: '#f9f9f9' },
//   scrollContainer: { paddingBottom: 80 },
//   carouselImage: {
//     width: win.width - 20,
//     height: 200,
//     margin: 3,
//     marginTop: 10,
//     borderRadius: 10
//   },
//   detailsContainer: { padding: 20 },
//   routeName: { fontSize: 24, fontWeight: 'bold', color: '#333' },
//   tagsAndRating: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
//   tagsContainer: { flexDirection: 'row', flexWrap: 'wrap' },
//   rating: { fontSize: 18, fontWeight: '600', color: '#555' },
//   descriptionTitle: { fontSize: 18, fontWeight: 'bold', marginTop: 10 },
//   descriptionText: { fontSize: 14, lineHeight: 20, color: '#666', marginTop: 5 },
//   map: { height: 200, marginVertical: 20, borderRadius: 10 },
//   statsContainer: { flexDirection: 'row', justifyContent: 'space-around', marginTop: 20 },
//   stat: { alignItems: 'center' },
//   statLabel: { fontSize: 12, color: '#888' },
//   statValue: { fontSize: 16, fontWeight: '600', color: '#333' },
//   feedbackContainer: { padding: 20, marginTop: 20 },
//   feedbackTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
//   startWalkButton: {
//     position: 'absolute',
//     bottom: 0,
//     left: 0,
//     right: 0,
//     backgroundColor: '#4CAF50',
//     paddingVertical: 15,
//     alignItems: 'center',
//   },
//   startWalkText: { color: '#fff', fontSize: 18, fontWeight: '600' },
//   loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
//   loadingText: { marginTop: 10, fontSize: 16, color: '#555' },
//   errorContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
//   errorText: { fontSize: 18, color: '#ff4444' },
// });

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  scrollContainer: { paddingBottom: 80 },
  carouselImage: {
    width: win.width - 20,
    height: 200,
    marginHorizontal: 10,
    marginTop: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  detailsContainer: { paddingHorizontal: 20, paddingVertical: 15, backgroundColor: '#fff' },
  routeName: { fontSize: 26, fontWeight: 'bold', color: '#2c3e50', marginBottom: 10 },
  tagsAndRating: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  tagsContainer: { flexDirection: 'row', flexWrap: 'wrap' },
  rating: { fontSize: 18, fontWeight: '600', color: '#333' },
  descriptionTitle: { fontSize: 21, fontWeight: 'bold', color: '#34495e', marginBottom: 5 },
  descriptionText: { fontSize: 15, lineHeight: 22, color: '#34495e' },
  map: { height: 250, marginVertical: 20, marginHorizontal: 10, borderRadius: 10 },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    marginVertical: 15,
  },
  stat: { alignItems: 'center', flex: 1 },
  statLabel: {
    fontSize: 14,
    color: '#34495e',
    marginTop: 8,
  },
  statValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
    marginTop: 4,
  },
  feedbackContainer: { padding: 20, marginTop: 20, backgroundColor: '#fff', borderRadius: 10, marginHorizontal: 10 },
  feedbackTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 10, color: '#2c3e50' },
  startWalkButton: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#27ae60',
    paddingVertical: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  startWalkText: { color: '#fff', fontSize: 18, fontWeight: '600', letterSpacing: 0.5 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#ecf0f1' },
  loadingText: { marginTop: 10, fontSize: 16, color: '#7f8c8d' },
  errorContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20 },
  errorText: { fontSize: 18, color: '#e74c3c', textAlign: 'center' },
});


export default RouteDetailsScreen;
