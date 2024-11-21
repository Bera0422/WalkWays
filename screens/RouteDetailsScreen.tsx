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
import { fetchRouteDetails, fetchRouteReviews } from '../firestoreService';
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
    // Fetch routes data from Firestore when the component mounts
    const getRoute = async () => {
      try {
        const fetchedRouteDetails = await fetchRouteDetails(routeId); // Call the Firestore fetch function
        setRouteDetails(fetchedRouteDetails);
        setWaypoints(fetchedRouteDetails.details.waypoints.map(waypoint => { return { latitude: waypoint.latitude, longitude: waypoint.longitude } }))
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
        <ActivityIndicator
          size="large"
          color={"#000"}
        />
        <Text>Loading...</Text>
      </View>
    );
  }

  if (!routeDetails) {
    return <Text>Route not found</Text>;
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <ScrollView style={styles.scrollContainer}>
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
            {/* Tags */}
            <View style={styles.tagsContainer}>
              {routeDetails.tags.map((tag) => (
                <Tag key={tag.id} icon={tag.icon} text={tag.name} />
              ))}
            </View>
            <Text style={styles.rating}>
              {routeDetails.rating} <FontAwesome name="star" color="#FFD700" />
            </Text>
          </View>

          {/* Description */}
          <Text style={styles.descriptionTitle}>Description</Text>
          <Text style={styles.descriptionText}>{routeDetails.details.description}</Text>

        </View>

        {/* <View style={styles.mapPreview}>
          <Text>Map Preview Placeholder</Text>
        </View> */}

        {/* Map View */}
        <MapView
          provider='google'
          style={styles.map}
          initialRegion={{
            latitude: routeDetails.details.location.latitude,
            longitude: routeDetails.details.location.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.005,
          }}>
          <MapViewDirections
            origin={waypoints[0]}
            destination={waypoints[waypoints.length-1]}
            waypoints={waypoints}
            mode="WALKING"
            apikey={apiKey}
            strokeWidth={2} 
            strokeColor="#FF6347" 
            lineCap="round" 
            lineJoin="round"
            geodesic={true} 
            tappable={true}
          />


          <Marker coordinate={waypoints[0]} title="Start" pinColor="green" />
          <Marker coordinate={waypoints[waypoints.length - 1]} title="End" pinColor='red' />
        </MapView>

        {/* Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.stat}>
            <Text style={styles.statLabel}>Estimated Time</Text>
            <Text style={styles.statValue}>{routeDetails.estimatedTime}</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statLabel}>Distance</Text>
            <Text style={styles.statValue}>{routeDetails.distance}</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statLabel}>Elevation</Text>
            <Text style={styles.statValue}>{routeDetails.elevation}</Text>
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
    </SafeAreaView >
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default RouteDetailsScreen;