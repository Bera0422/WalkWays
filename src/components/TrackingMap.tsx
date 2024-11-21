import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import MapView from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import * as Location from 'expo-location';
import { getDistance } from 'geolib'; // Import geolib for distance calculation

interface TrackingMapProp {
    updateDistanceWalked: (distance: number) => void;
}

const TrackingMap: React.FC<TrackingMapProp> = ({ updateDistanceWalked }) => {
    const apiKey = process.env.GOOGLE_MAPS_API_KEY || "";

    const [location, setLocation] = useState<Location.LocationObject | null>(null);
    const [errorMsg, setErrorMsg] = useState('');
    const [visitedWaypoints, setVisitedWaypoints] = useState<
        { index: number; coords: { latitude: number; longitude: number } }[]
    >([]);
    const [currentWaypointIndex, setCurrentWaypointIndex] = useState(0);

    const startCoords = { latitude: 48.8566, longitude: 2.3522 };
    const endCoords = { latitude: 48.8716, longitude: 2.3011 };

    const waypoints = [
        { latitude: 48.8566, longitude: 2.3522 },
        { latitude: 48.8589, longitude: 2.3397 },
        { latitude: 48.8623, longitude: 2.3303 },
        { latitude: 48.8655, longitude: 2.3202 },
        { latitude: 48.8686, longitude: 2.3105 },
        { latitude: 48.8716, longitude: 2.3011 },
    ];

    const proximityThreshold = 10; // Meters

    // Mocked movement simulation
    useEffect(() => {
        const simulateMovement = () => {
            if (currentWaypointIndex < waypoints.length) {
                const nextCoords = waypoints[currentWaypointIndex];
                setLocation({
                    coords: nextCoords,
                    timestamp: Date.now(),
                    mocked: true,
                } as Location.LocationObject);
                setCurrentWaypointIndex((prevIndex) => prevIndex + 1);
            }
        };

        const intervalId = setInterval(simulateMovement, 2000); // Move to the next waypoint every 2 seconds
        return () => clearInterval(intervalId); // Cleanup on unmount
    }, [currentWaypointIndex]);

    // Real movement
    // useEffect(() => {
    //     (async () => {
    //         let { status } = await Location.requestForegroundPermissionsAsync();
    //         if (status !== 'granted') {
    //             setErrorMsg('Permission to access location was denied');
    //             return;
    //         }

    //         Location.watchPositionAsync(
    //             { accuracy: Location.Accuracy.High, distanceInterval: 1 },
    //             (loc) => {
    //                 setLocation(loc);
    //                 updateVisitedWaypoints(loc);
    //             }
    //         );
    //     })();
    // }, []);

    // Update visited waypoints and calculate distance
    useEffect(() => {
        if (location) {
            const { latitude, longitude } = location.coords;

            // Find nearest unvisited waypoint
            waypoints.forEach((point, index) => {
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
                        updateDistanceWalked(distance);
                    }
                }
            });
        }
    }, [location]);

    return (
        <View style={styles.container}>
            {location ? (
                <MapView
                    provider="google"
                    style={styles.map}
                    initialRegion={{
                        latitude: location.coords.latitude,
                        longitude: location.coords.longitude,
                        latitudeDelta: 0.01,
                        longitudeDelta: 0.01,
                    }}
                    showsUserLocation={true}
                >
                    {/* Route directions */}
                    <MapViewDirections
                        origin={startCoords}
                        destination={endCoords}
                        waypoints={waypoints}
                        mode="WALKING"
                        apikey={apiKey}
                        strokeWidth={4}
                        strokeColor="blue"
                    />

                    {/* Highlight visited waypoints */}
                    {visitedWaypoints.length > 1 && (
                        <MapViewDirections
                            origin={visitedWaypoints[0].coords}
                            destination={visitedWaypoints[visitedWaypoints.length - 1].coords}
                            waypoints={visitedWaypoints.map((wp) => wp.coords)}
                            mode="WALKING"
                            apikey={apiKey}
                            strokeWidth={4}
                            strokeColor="green" // Visited portion color
                        />
                    )}
                </MapView>
            ) : (
                <Text>{errorMsg || 'Loading map...'}</Text>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    map: { flex: 1 },
});

export default TrackingMap;
