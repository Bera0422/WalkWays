import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import * as Location from 'expo-location';

const MapComponent = () => {
    const [location, setLocation] = useState<Location.LocationObject>();
    const [errorMsg, setErrorMsg] = useState('');
    const [directions, setDirections] = useState('');

    // Define the start and end coordinates for the route
    const startCoords = { latitude: 37.7749, longitude: -122.4194 }; // San Francisco example
    const endCoords = { latitude: 37.7849, longitude: -122.4094 };   // Slightly different location

    useEffect(() => {
        // Request location permissions and set up real-time tracking
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            console.log(status);
            if (status !== 'granted') {
                setErrorMsg('Permission to access location was denied');
                return;
            }

            // Start tracking location
            Location.watchPositionAsync(
                { accuracy: Location.Accuracy.High, distanceInterval: 1 },
                (loc) => {
                    setLocation(loc);
                }
            );
        })();
    }, []);

    // Function to update directions text
    const handleDirections = (result: { legs: string | any[]; }) => {
        if (result && result.legs && result.legs.length > 0) {
            const steps = result.legs[0].steps.map((step: { instructions: any; }) => step.instructions);
            setDirections(steps.join('. ')); // Combine step instructions
        }
    };

    return (
        <View style={styles.container}>
            {location ? (
                <MapView
                    provider='google'
                    style={styles.map}
                    initialRegion={{
                        latitude: location.coords.latitude,
                        longitude: location.coords.longitude,
                        latitudeDelta: 0.01,
                        longitudeDelta: 0.01,
                    }}
                    showsUserLocation={true}
                    followsUserLocation={true}
                >
                    {/* Route Polyline */}
                    <MapViewDirections
                        origin={startCoords}
                        destination={endCoords}
                        apikey="AIzaSyCqUBbguSneKYTN-MUKfY0bM3_vUuvYHnE"
                        strokeWidth={4}
                        strokeColor="blue"
                        onReady={handleDirections} // To handle directions text update
                    />
                    {/* Start and End Markers */}
                    <Marker coordinate={startCoords} title="Start" />
                    <Marker coordinate={endCoords} title="End" />
                </MapView>
            ) : (
                <Text>{errorMsg || 'Loading map...'}</Text>
            )}

            {/* Display Directions */}
            <View style={styles.directionsContainer}>
                <Text style={styles.directionsText}>Directions: {directions}</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    map: { flex: 5 },
    directionsContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
        backgroundColor: '#fff',
    },
    directionsText: {
        fontSize: 16,
        color: '#333',
    },
});

export default MapComponent;
