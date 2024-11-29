import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, useWindowDimensions, Button, TouchableOpacity } from 'react-native';
import MapView from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import * as Location from 'expo-location';
import { getDistance } from 'geolib'; // Import geolib for distance calculation
import { FontAwesome } from '@expo/vector-icons';

const MAX_WAYPOINTS = 25;
const UPDATE_THRESHOLD = 15; // Meters

interface RecordWalkProp {
    onEndWalk: (
        route: { latitude: number; longitude: number }[]
    ) => void;
    updateDistanceWalked: (distance: number) => void;
}

const RecordWalk: React.FC<RecordWalkProp> = ({ onEndWalk, updateDistanceWalked }) => {
    const apiKey = process.env.GOOGLE_MAPS_API_KEY || "";

    const [errMsg, setErrorMsg] = useState('');
    const [location, setLocation] = useState<Location.LocationObject | null>(null);
    const [visitedWaypoints, setVisitedWaypoints] = useState<
        { index: number; coords: { latitude: number; longitude: number } }[]
    >([]);

    const [isFollowing, setIsFollowing] = useState(true);
    const [region, setRegion] = useState({
        latitude: 0,
        longitude: 0,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
    });

    // const startCoords = { latitude: 48.8566, longitude: 2.3522 };
    // const endCoords = { latitude: 48.8716, longitude: 2.3011 };

    // const startCoords = { latitude: 47.7616868, longitude: -122.2080222 };
    // const endCoords = { latitude: 47.7633868, longitude: -122.2087400 };

    const mockCoords = [
        { latitude: 48.8566, longitude: 2.3522 },
        { latitude: 48.8589, longitude: 2.3397 },
        { latitude: 48.8623, longitude: 2.3303 },
        { latitude: 48.8655, longitude: 2.3202 },
        { latitude: 48.8686, longitude: 2.3105 },
        { latitude: 48.8716, longitude: 2.3011 },
    ];

    // const routeWaypoints = [
    //     { latitude: 47.7616868, longitude: -122.2080222 },
    //     { latitude: 47.7615385, longitude: -122.2093291 },
    //     { latitude: 47.7633868, longitude: -122.2087400 },
    //     { latitude: 47.7616758, longitude: -122.2077624 },
    // ];


    // Mocked movement simulation
    // useEffect(() => {
    //     let currentIndex = 0;
    //     setLocation({
    //         coords: mockCoords[0],
    //         timestamp: Date.now(),
    //         mocked: true,
    //     } as Location.LocationObject);

    //     const simulateMovement = () => {
    //         if (currentIndex < mockCoords.length) {
    //             const nextCoords = mockCoords[currentIndex];
    //             setLocation({
    //                 coords: nextCoords,
    //                 timestamp: Date.now(),
    //                 mocked: true,
    //             } as Location.LocationObject);

    //             currentIndex += 1;
    //         }
    //     };

    //     const intervalId = setInterval(simulateMovement, 2000); // Move to the next waypoint every 2 seconds
    //     return () => clearInterval(intervalId); // Cleanup on unmount
    // }, []);

    // Real movement
    useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                setErrorMsg('Permission to access location was denied');
                return;
            }

            Location.watchPositionAsync(
                { accuracy: Location.Accuracy.High, distanceInterval: 8 },
                (loc) => {
                    setLocation(loc);
                }
            );
        })();
    }, []);


    // Update visited waypoints and calculate distance
    useEffect(() => {
        if (!location) return;

        const { latitude, longitude } = location.coords;

        if (isFollowing) {
            setRegion({
                latitude: latitude,
                longitude: longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
            });
        }
        // If no waypoints exist, initialize the path with the first waypoint
        if (visitedWaypoints.length === 0) {
            setVisitedWaypoints([{ index: 0, coords: { latitude, longitude } }]);
            return;
        }

        // Calculate distance from the last visited waypoint
        const lastPoint = visitedWaypoints[visitedWaypoints.length - 1]?.coords;
        if (!lastPoint) return;

        const distance = getDistance(lastPoint, { latitude, longitude });

        // Update path and distance if threshold is met
        if (distance > UPDATE_THRESHOLD) {
            updateDistanceWalked(distance);
            setVisitedWaypoints((prevPath) => [
                ...prevPath,
                { index: prevPath.length, coords: { latitude, longitude } },
            ]);
        }
    }, [location, visitedWaypoints]);


    const getWaypointBatches = (waypoints: any) => {
        const batches = [];
        for (let i = 0; i < waypoints.length; i += MAX_WAYPOINTS) {
            batches.push(waypoints.slice(i, i + MAX_WAYPOINTS));
        }
        return batches;
    }

    const { width } = useWindowDimensions()

    const handleEndWalk = () => {
        onEndWalk(visitedWaypoints.map((point) => point.coords));
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
                        {/* Highlight visited waypoints */}
                        {visitedWaypoints.length > 1 &&
                            getWaypointBatches(visitedWaypoints).map((batch, index) => (
                                <MapViewDirections
                                    key={index} // Ensure unique keys for each batch
                                    origin={batch[0].coords}
                                    destination={batch[batch.length - 1].coords}
                                    waypoints={batch.slice(1, batch.length - 1).map((wp: any) => wp.coords)}
                                    mode="WALKING"
                                    apikey={apiKey}
                                    strokeWidth={4}
                                    strokeColor="green" // Visited portion color
                                />
                            ))}
                    </MapView>
                    {!isFollowing && (
                        <TouchableOpacity style={styles.recenterButton} onPress={handleRecenter}>
                            <FontAwesome name="crosshairs" size={24} color="#fff" />
                        </TouchableOpacity>
                    )}
                    <TouchableOpacity style={styles.endWalkButton} onPress={handleEndWalk}>
                        <Text style={styles.endWalkButtonText}>End Recording Walk</Text>
                    </TouchableOpacity>

                </>
            ) : (
                <Text>{errMsg || 'Loading map...'}</Text>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    map: { flex: 1 },
    instructionContainer: {
        position: 'absolute',
        bottom: 20,
        backgroundColor: 'rgba(235, 218, 244, 0.9)',
        padding: 18,
        borderRadius: 8,
        marginHorizontal: 20,
        alignSelf: 'center'
    },
    instructionText: {
        fontSize: 16,
        textAlign: 'center',
    },
    endWalkButton: {
        backgroundColor: '#E53935',
        paddingVertical: 15,
        alignItems: 'center',
        margin: 10,
        borderRadius: 5,
    },
    endWalkButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
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

export default RecordWalk;

// import React, { useEffect, useState } from 'react';
// import { View, Text, StyleSheet, TouchableOpacity, useWindowDimensions } from 'react-native';
// import MapView from 'react-native-maps';
// import MapViewDirections from 'react-native-maps-directions';
// import * as Location from 'expo-location';
// import { getDistance } from 'geolib';

// const MAX_WAYPOINTS = 25;
// const UPDATE_THRESHOLD = 1; // Meters
// const BATCH_SIZE = 5; // Number of waypoints in a batch

// interface RecordWalkProp {
//     onEndWalk: (route: { latitude: number; longitude: number }[]) => void;
//     updateDistanceWalked: (distance: number) => void;
// }

// const RecordWalk: React.FC<RecordWalkProp> = ({ onEndWalk, updateDistanceWalked }) => {
//     const apiKey = process.env.GOOGLE_MAPS_API_KEY || "";

//     const [errMsg, setErrorMsg] = useState('');
//     const [location, setLocation] = useState<Location.LocationObject | null>(null);
//     const [visitedWaypoints, setVisitedWaypoints] = useState<
//         { index: number; coords: { latitude: number; longitude: number } }[]
//     >([]);
//     const [batch, setBatch] = useState<
//         { index: number; coords: { latitude: number; longitude: number } }[]
//     >([]);


//     // Mocked movement simulation
//     useEffect(() => {
//         const mockCoords = [
//             { latitude: 48.8566, longitude: 2.3522 },
//             { latitude: 48.8589, longitude: 2.3397 },
//             { latitude: 48.8623, longitude: 2.3303 },
//             { latitude: 48.8655, longitude: 2.3202 },
//             { latitude: 48.8686, longitude: 2.3105 },
//             { latitude: 48.8716, longitude: 2.3011 },
//         ];

//         let currentIndex = 0;
//         setLocation({
//             coords: mockCoords[0],
//             timestamp: Date.now(),
//             mocked: true,
//         } as Location.LocationObject);

//         const simulateMovement = () => {
//             if (currentIndex < mockCoords.length) {
//                 const nextCoords = mockCoords[currentIndex];
//                 setLocation({
//                     coords: nextCoords,
//                     timestamp: Date.now(),
//                     mocked: true,
//                 } as Location.LocationObject);

//                 currentIndex += 1;
//             }
//         };

//         const intervalId = setInterval(simulateMovement, 2000); // Move to the next waypoint every 2 seconds
//         return () => clearInterval(intervalId); // Cleanup on unmount
//     }, []);

//     // useEffect(() => {
//     //     (async () => {
//     //         let { status } = await Location.requestForegroundPermissionsAsync();
//     //         if (status !== 'granted') {
//     //             setErrorMsg('Permission to access location was denied');
//     //             return;
//     //         }

//     //         Location.watchPositionAsync(
//     //             { accuracy: Location.Accuracy.High, distanceInterval: 8 },
//     //             (loc) => {
//     //                 setLocation(loc);
//     //             }
//     //         );
//     //     })();
//     // }, []);

//     useEffect(() => {
//         if (!location) return;

//         const { latitude, longitude } = location.coords;

//         if (visitedWaypoints.length === 0) {
//             setVisitedWaypoints([{ index: 0, coords: { latitude, longitude } }]);
//             return;
//         }

//         const lastPoint = visitedWaypoints[visitedWaypoints.length - 1]?.coords;
//         if (!lastPoint) return;

//         const distance = getDistance(lastPoint, { latitude, longitude });

//         if (distance > UPDATE_THRESHOLD) {
//             updateDistanceWalked(distance);

//             const newPoint = { index: visitedWaypoints.length, coords: { latitude, longitude } };
//             setBatch((prevBatch) => {
//                 const updatedBatch = [...prevBatch, newPoint];

//                 if (updatedBatch.length >= BATCH_SIZE) {
//                     // Calculate the average latitude and longitude
//                     const avgLatitude =
//                         updatedBatch.reduce((sum, point) => sum + point.coords.latitude, 0) /
//                         updatedBatch.length;
//                     const avgLongitude =
//                         updatedBatch.reduce((sum, point) => sum + point.coords.longitude, 0) /
//                         updatedBatch.length;

//                     const averagePoint = {
//                         index: visitedWaypoints.length,
//                         coords: { latitude: avgLatitude, longitude: avgLongitude },
//                     };

//                     // Add the averaged point to visitedWaypoints
//                     setVisitedWaypoints((prev) => [...prev, averagePoint]);
//                     return []; // Reset the batch
//                 }

//                 return updatedBatch;
//             });
//         }
//     }, [location, visitedWaypoints]);


//     const handleEndWalk = () => {
//         if (batch.length > 0) {
//             const midpointIndex = Math.floor(batch.length / 2);
//             const midpoint = batch[midpointIndex];
//             setVisitedWaypoints((prev) => [...prev, midpoint]);
//         }
//         onEndWalk(visitedWaypoints.map((point) => point.coords));
//     };

//     const getWaypointBatches = (waypoints: any) => {
//         const batches = [];
//         for (let i = 0; i < waypoints.length; i += MAX_WAYPOINTS) {
//             batches.push(waypoints.slice(i, i + MAX_WAYPOINTS));
//         }
//         return batches;
//     };

//     const { width } = useWindowDimensions();

//     return (
//         <View style={styles.container}>
//             {location ? (
//                 <>
//                     <MapView
//                         provider="google"
//                         style={styles.map}
//                         initialRegion={{
//                             latitude: location.coords.latitude,
//                             longitude: location.coords.longitude,
//                             latitudeDelta: 0.01,
//                             longitudeDelta: 0.01,
//                         }}
//                         showsUserLocation={true}
//                     >
//                         {visitedWaypoints.length > 1 &&
//                             getWaypointBatches(visitedWaypoints).map((batch, index) => (
//                                 <MapViewDirections
//                                     key={index}
//                                     origin={batch[0].coords}
//                                     destination={batch[batch.length - 1].coords}
//                                     waypoints={batch.slice(1, batch.length - 1).map((wp: any) => wp.coords)}
//                                     mode="WALKING"
//                                     apikey={apiKey}
//                                     strokeWidth={4}
//                                     strokeColor="green"
//                                 />
//                             ))}
//                     </MapView>
//                     <TouchableOpacity style={styles.endWalkButton} onPress={handleEndWalk}>
//                         <Text style={styles.endWalkButtonText}>End Recording Walk</Text>
//                     </TouchableOpacity>
//                 </>
//             ) : (
//                 <Text>{errMsg || 'Loading map...'}</Text>
//             )}
//         </View>
//     );
// };

// const styles = StyleSheet.create({
//     container: { flex: 1 },
//     map: { flex: 1 },
//     endWalkButton: {
//         backgroundColor: '#E53935',
//         paddingVertical: 15,
//         alignItems: 'center',
//         margin: 10,
//         borderRadius: 5,
//     },
//     endWalkButtonText: {
//         color: '#fff',
//         fontSize: 16,
//         fontWeight: 'bold',
//     },
// });

// export default RecordWalk;

