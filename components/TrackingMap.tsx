import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import * as Location from 'expo-location';
import RenderHTML from 'react-native-render-html';
import { useWindowDimensions } from 'react-native';

const TrackingMap: React.FC = () => {
    const [location, setLocation] = useState<Location.LocationObject>();
    const [errorMsg, setErrorMsg] = useState('');
    const [directions, setDirections] = useState('');

    // Define the start and end coordinates for the route
    const startCoords = { latitude: 37.7749, longitude: -122.4194 };
    const endCoords = { latitude: 37.7849, longitude: -122.4094 };

    const apiKey: string = process.env.GOOGLE_MAPS_API_KEY || "";

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
            const steps = result.legs[0].steps.map((step: any) => step.html_instructions);
            // console.log('<ul><li>' + steps.join('</li><li>') + '</li></ul>');
            setDirections('<ul><li>' + steps.join('</li><li>') + '</li></ul>'); // Combine step instructions
        }
    };

    const { width } = useWindowDimensions()

    return (
        <View style={styles.container}>
            {location ? (
                <MapView
                    provider='google'
                    style={styles.map}
                    initialRegion={{
                        latitude: location.coords.latitude,
                        longitude: location.coords.longitude,
                        latitudeDelta: 0.1,
                        longitudeDelta: 0.1,
                    }}
                    showsUserLocation={true}
                    followsUserLocation={true}
                >
                    {/* Route Polyline */}
                    <MapViewDirections
                        origin={startCoords}
                        destination={endCoords}
                        mode='WALKING'
                        apikey={apiKey}
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
            {/* <View style={styles.directionsContainer}> */}
            {/* <Text style={styles.directionsText}>Directions: {directions}</Text> */}
            {/* <View style={styles.instructionContainer}>
                    <RenderHTML
                        contentWidth={width}
                        source={{ html: directions }}
                    />
                </View>
            </View> */}
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    map: { flex: 5 },
    directionsContainer: {
        marginVertical: 50,
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
    instructionContainer: {
        padding: 10,
    },
});

export default TrackingMap;
