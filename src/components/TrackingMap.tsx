import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, useWindowDimensions, ActivityIndicator, TouchableOpacity } from 'react-native';
import MapView from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import * as Location from 'expo-location';
import { getDistance } from 'geolib'; // Import geolib for distance calculation
import RenderHTML from 'react-native-render-html';
import { FontAwesome, MaterialIcons } from '@expo/vector-icons';

const MAX_WAYPOINTS = 25;
const proximityThreshold = 20; // Meters

interface TrackingMapProp {
  updateDistanceWalked: (distance: number) => void;
  waypoints: { latitude: number; longitude: number }[]
}

const TrackingMap: React.FC<TrackingMapProp> = ({ updateDistanceWalked, waypoints }) => {
  const apiKey = process.env.GOOGLE_MAPS_API_KEY || "";
  const { width } = useWindowDimensions()

  const [errMsg, setErrorMsg] = useState('');
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [visitedWaypoints, setVisitedWaypoints] = useState<
    { index: number; coords: { latitude: number; longitude: number } }[]
  >([]);
  const [currentInstruction, setCurrentInstruction] = useState<string>('');
  const [instructions, setInstructions] = useState<
    { step: string; location: { latitude: number; longitude: number } }[]
  >([]);
  const [instructionWaypoints, setInstructionWaypoints] = useState<
    { latitude: number; longitude: number }[]
  >([]);

  const startCoords = waypoints[0];
  const endCoords = waypoints[1];

  const [isFollowing, setIsFollowing] = useState(true);
  const [region, setRegion] = useState({
    latitude: waypoints[0].latitude,
    longitude: waypoints[0].longitude,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  });

  // const startCoords = { latitude: 48.8566, longitude: 2.3522 };
  // const endCoords = { latitude: 48.8716, longitude: 2.3011 };

  // const startCoords = { latitude: 47.7616868, longitude: -122.2080222 };
  // const endCoords = { latitude: 47.7633868, longitude: -122.2087400 };

  // const routeWaypoints = [
  //     { latitude: 48.8566, longitude: 2.3522 },
  //     { latitude: 48.8589, longitude: 2.3397 },
  //     { latitude: 48.8623, longitude: 2.3303 },
  //     { latitude: 48.8655, longitude: 2.3202 },
  //     { latitude: 48.8686, longitude: 2.3105 },
  //     { latitude: 48.8716, longitude: 2.3011 },
  // ];

  // const routeWaypoints = [
  //     { latitude: 47.7616868, longitude: -122.2080222 },
  //     { latitude: 47.7615385, longitude: -122.2093291 },
  //     { latitude: 47.7633868, longitude: -122.2087400 },
  //     { latitude: 47.7616758, longitude: -122.2077624 },
  // ];


  // Mocked movement simulation
  useEffect(() => {
    let currentIndex = 0;
    setLocation({
      coords: waypoints[0],
      timestamp: Date.now(),
      mocked: true,
    } as Location.LocationObject);

    const simulateMovement = () => {
      if (currentIndex < instructionWaypoints.length) {
        const nextCoords = instructionWaypoints[currentIndex];
        setLocation({
          coords: nextCoords,
          timestamp: Date.now(),
          mocked: true,
        } as Location.LocationObject);

        currentIndex += 1;
      }
    };

    const intervalId = setInterval(simulateMovement, 2000); // Move to the next waypoint every 2 seconds
    return () => clearInterval(intervalId); // Cleanup on unmount
  }, [instructionWaypoints]);

  // Real movement
  // useEffect(() => {
  //   (async () => {
  //     let { status } = await Location.requestForegroundPermissionsAsync();
  //     if (status !== 'granted') {
  //       setErrorMsg('Permission to access location was denied');
  //       return;
  //     }

  //     Location.watchPositionAsync(
  //       { accuracy: Location.Accuracy.High, distanceInterval: 8 },
  //       (loc) => {
  //         setLocation(loc);
  //       }
  //     );
  //   })();
  // }, []);

  // Update visited waypoints and calculate distance
  useEffect(() => {
    if (location) {
      const { latitude, longitude } = location.coords;

      if (isFollowing) {
        setRegion({
          latitude: latitude,
          longitude: longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        });
      }

      // Find nearest unvisited waypoint
      instructionWaypoints.forEach((point, index) => {
        if (
          !visitedWaypoints.some((wp) => wp.index === index) &&
          getDistance(point, { latitude, longitude }) < proximityThreshold
        ) {
          // Add to visited waypoints
          setVisitedWaypoints((prev) => [
            ...prev,
            { index, coords: point },
          ]);

          // Calculate distance from the last visited waypoint
          if (visitedWaypoints.length > 0) {
            const lastWaypoint = visitedWaypoints[visitedWaypoints.length - 1].coords;
            const distance = getDistance(lastWaypoint, point);
            console.log(distance);
            updateDistanceWalked(distance);
          }
        }
      });

      // Update current instruction
      const matchingStep = instructions.find((inst) =>
        getDistance(inst.location, { latitude, longitude }) < proximityThreshold
      );
      if (matchingStep) {
        setCurrentInstruction(matchingStep.step);
      }

    }
  }, [location]);

  // Handle route directions and instructions
  const handleDirections = (result: any) => {
    if (result && result.legs) {
      const steps = result.legs.flatMap((leg: any) =>
        leg.steps.map((step: any) => ({
          step: step.html_instructions,
          // .replace(/<[^>]*>?/gm, ''), // Remove HTML tags
          location: {
            latitude: step.start_location.lat,
            longitude: step.start_location.lng,
          },
        }))
      );
      console.log(steps);
      setInstructions(steps);
      setInstructionWaypoints(steps.map((inst: any) => inst.location));

      if (steps.length > 0) {
        setCurrentInstruction(steps[0].step); // Set the first instruction initially
      }
    }
  };

  const getWaypointBatches = (waypoints: any) => {
    const batches = [];
    for (let i = 0; i < waypoints.length; i += MAX_WAYPOINTS) {
      batches.push(waypoints.slice(i, i + MAX_WAYPOINTS));
    }
    return batches;
  }

  const handleRegionChange = () => {
    if (isFollowing) {
      setIsFollowing(false); // Stop following when user moves the map
    }
  };

  const handleRecenter = () => {
    console.log(region);
    if (location) {
      setRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
      console.log(region);
      setIsFollowing(true);
    }
  };
  return (
    <View style={styles.container}>
      {location ? (
        <>
          <MapView
            // provider="google"
            style={styles.map}
            initialRegion={{
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            }}
            showsUserLocation={true}
            region={region}
            followsUserLocation={isFollowing}
            onRegionChange={handleRegionChange}
          >
            {/* Route directions */}
            <MapViewDirections
              origin={startCoords}
              destination={endCoords}
              waypoints={waypoints}
              mode="WALKING"
              apikey={apiKey}
              strokeWidth={4}
              strokeColor="#007AFF" // Updated route color
              onReady={handleDirections}
            />
            {/* Highlight visited waypoints */}
            {visitedWaypoints.length > 1 &&
              getWaypointBatches(visitedWaypoints).map((batch, index) => (
                <MapViewDirections
                  key={index}
                  origin={batch[0].coords}
                  destination={batch[batch.length - 1].coords}
                  waypoints={batch.slice(1, batch.length - 1).map((wp: any) => wp.coords)}
                  mode="WALKING"
                  apikey={apiKey}
                  strokeWidth={4}
                  strokeColor="#34C759" // Visited portion color
                />
              ))}
          </MapView>
          {!isFollowing && (
            <TouchableOpacity style={styles.recenterButton} onPress={handleRecenter}>
              <FontAwesome name="crosshairs" size={24} color="#fff" />
            </TouchableOpacity>
          )}
          <View style={styles.instructionContainer}>
            <MaterialIcons name="directions-walk" size={24} color="#6A1B9A" />
            <RenderHTML
              contentWidth={width}
              source={{ html: currentInstruction || 'Loading directions...' }}
              baseStyle={styles.instructionText}
            />
          </View>
        </>
      ) : (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>{errMsg || 'Loading map...'}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9F9F9',
  },
  map: {
    flex: 1,
    borderRadius: 10,
    margin: 10,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  instructionContainer: {
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  instructionText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#888',
    marginTop: 10,
  },
  recenterButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    backgroundColor: '#007AFF',
    borderRadius: 30,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 4, // For Android shadow
  },
});

export default TrackingMap;
