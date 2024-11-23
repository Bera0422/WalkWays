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
import { FontAwesome } from '@expo/vector-icons'; // For star icons
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
              {routeDetails.rating} <FontAwesome name="star" size={18} color="#FFD700" />
            </Text>
          </View>

          <Text style={styles.descriptionTitle}>Description</Text>
          <Text style={styles.descriptionText}>{routeDetails.details.description}</Text>
        </View>

        {/* Map View */}
        <MapView
          provider="google"
          style={styles.map}
          initialRegion={{
            latitude: routeDetails.details.location.latitude,
            longitude: routeDetails.details.location.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.005,
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

        {/* Stats */}
        <View style={styles.statsContainer}>
          <Stat label="Estimated Time" value={routeDetails.estimatedTime} />
          <Stat label="Distance" value={routeDetails.distance} />
          <Stat label="Elevation" value={routeDetails.elevation} />
        </View>

        {/* Community Feedback */}
        {routeReviews.length > 0 && (
          <View style={styles.feedbackContainer}>
            <Text style={styles.feedbackTitle}>Community Feedback</Text>
            <FlatList
              data={routeReviews}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => <Review review={item} />}
              scrollEnabled={false}
            />
          </View>
        )}
      </ScrollView>

      {/* Start Walk Button */}
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

const Stat = ({ label, value }: { label: string, value: any }) => (
  <View style={styles.stat}>
    <Text style={styles.statLabel}>{label}</Text>
    <Text style={styles.statValue}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9f9f9' },
  scrollContainer: { paddingBottom: 80 },
  carouselImage: {
    width: win.width - 20,
    height: 200,
    margin: 3,
    marginTop: 10,
    borderRadius: 10
  },
  detailsContainer: { padding: 20 },
  routeName: { fontSize: 24, fontWeight: 'bold', color: '#333' },
  tagsAndRating: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  tagsContainer: { flexDirection: 'row', flexWrap: 'wrap' },
  rating: { fontSize: 18, fontWeight: '600', color: '#555' },
  descriptionTitle: { fontSize: 18, fontWeight: 'bold', marginTop: 10 },
  descriptionText: { fontSize: 14, lineHeight: 20, color: '#666', marginTop: 5 },
  map: { height: 200, marginVertical: 20, borderRadius: 10 },
  statsContainer: { flexDirection: 'row', justifyContent: 'space-around', marginTop: 20 },
  stat: { alignItems: 'center' },
  statLabel: { fontSize: 12, color: '#888' },
  statValue: { fontSize: 16, fontWeight: '600', color: '#333' },
  feedbackContainer: { padding: 20, marginTop: 20 },
  feedbackTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  startWalkButton: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#4CAF50',
    paddingVertical: 15,
    alignItems: 'center',
  },
  startWalkText: { color: '#fff', fontSize: 18, fontWeight: '600' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { marginTop: 10, fontSize: 16, color: '#555' },
  errorContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  errorText: { fontSize: 18, color: '#ff4444' },
});

export default RouteDetailsScreen;
