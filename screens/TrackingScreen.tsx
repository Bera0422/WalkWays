// TrackingScreen.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, Button, TouchableOpacity, FlatList, SafeAreaView, StatusBar, AppStateStatus, AppState } from 'react-native';
import MapView, { Polyline } from 'react-native-maps';
import { TrackingScreenNavigationProp, TrackingScreenRouteProp } from '../src/types/props';
import Timer from '../src/components/Timer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Pedometer } from 'expo-sensors';
import TrackingMap from '../src/components/TrackingMap';

const avatars = [
  { avatarId: '1', uri: require('../src/assets/avatars/1.jpg') },
  { avatarId: '2', uri: require('../src/assets/avatars/72.jpg') },
  { avatarId: '3', uri: require('../src/assets/avatars/5.jpg') },
  { avatarId: '4', uri: require('../src/assets/avatars/8.jpg') },
  { avatarId: '5', uri: require('../src/assets/avatars/14.jpg') },
  { avatarId: '6', uri: require('../src/assets/avatars/26.jpg') },
  { avatarId: '7', uri: require('../src/assets/avatars/27.jpg') },
  { avatarId: '8', uri: require('../src/assets/avatars/35.jpg') },
  { avatarId: '9', uri: require('../src/assets/avatars/42.jpg') },

]

interface Props {
  route: TrackingScreenRouteProp;
  navigation: TrackingScreenNavigationProp;
}

const TrackingScreen: React.FC<Props> = ({ route, navigation }) => {
  const routeId = route.params?.routeId;

  const [startTime, setStartTime] = useState<number | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [stepCount, setStepCount] = useState(0);
  const [isTracking, setIsTracking] = useState(false);
  const [savedRouteId, setSavedRouteId] = useState(-1);
  const [distanceWalked, setDistanceWalked] = useState(0);

  useEffect(() => {
    const subscription = Pedometer.watchStepCount((result: any) => {
      setStepCount(result.steps);
      // Assuming average step length in meters, adjust as needed (e.g., user profile setting).
      const stepLength = 0.762; // Average step length in meters (adjustable).
      const distanceFromSteps = result.steps * stepLength;

      // Update total distance with GPS-based distance and step-based estimate.
      setDistanceWalked((prevDistance) => Math.min(prevDistance, distanceFromSteps));
    });
    return () => subscription.remove();
  }, []);

  useEffect(() => {
    loadTrackingData();
    const appStateListener = AppState.addEventListener('change', handleAppStateChange);
    return () => {
      saveTrackingData();
      appStateListener.remove();
    };
  }, []);

  const handleAppStateChange = async (nextAppState: AppStateStatus) => {
    if (nextAppState === 'background' && isTracking) {
      await saveTrackingData();
    }
  };

  const saveTrackingData = async () => {
    try {
      await AsyncStorage.setItem(
        'trackingData',
        JSON.stringify({ startTime, elapsedTime, isTracking, savedRouteId })
      );
    } catch (error) {
      console.error('Failed to save tracking data:', error);
    }
  };

  const loadTrackingData = async () => {
    try {
      const savedData = await AsyncStorage.getItem('trackingData');
      console.log("SAVED DATA: " + savedData)
      if (savedData) {
        const parsedData = JSON.parse(savedData);
        if (parsedData.routeId === routeId) {
          setStartTime(parsedData.startTime);
          setIsTracking(parsedData.isTracking);
          setElapsedTime(parsedData.elapsedTime);
        }
        else {
          setSavedRouteId(parsedData.routeId);
          resetTracking();
        }
      }
    } catch (error) {
      console.error('Failed to load tracking data:', error);
    }
  };

  const startTracking = () => {
    setStartTime(Date.now());
    setIsTracking(true);
  };

  const resetTracking = () => {
    setStartTime(Date.now());
    setElapsedTime(0);
    setIsTracking(true);
  };

  const handleEndWalk = async () => {
    // setIsTimerActive(false);
    console.log("Ending walk: ", route)
    setIsTracking(false);
    await AsyncStorage.removeItem('trackingData');
    navigation.navigate('Feedback', { routeId: routeId })
    // Additional logic to handle ending the walk
  };

  const updateDistanceWalked = (distance: number) => {
    setDistanceWalked((prevDistance) => prevDistance + distance);
  };

  if (!isTracking) {
    return (
      <View style={styles.noWalkContainer}>
        <Text style={styles.noWalkText}>No ongoing walk</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <ScrollView>
        {/* Friends List (Horizontal Scroll) */}
        <View>
          <Text style={styles.friendsText} >Friends on this route</Text>
          <FlatList
            data={avatars}
            horizontal
            keyExtractor={(avatar) => avatar.avatarId}
            renderItem={({ item }) => (
              <Image
                source={item.uri}
                style={styles.friendAvatar}
              />
            )}
            contentContainerStyle={styles.friendAvatarContainer}
            showsHorizontalScrollIndicator={false}
          />
        </View>

        {/* Map View */}
        <View style={styles.mapContainer}>
          <TrackingMap updateDistanceWalked={updateDistanceWalked} />
        </View>
        {/* Walk Details */}
        <View style={styles.walkDetails}>
          <View style={styles.detailContainer}>
            <Text style={styles.detailLabel}>Time Elapsed</Text>
            <Timer initialTime={elapsedTime} isActive={isTracking} onComplete={handleEndWalk} />
          </View>

          <View style={styles.detailContainer}>
            <Text style={styles.detailLabel}>Distance Walked</Text>
            <Text style={styles.detailValue}>{(distanceWalked / 1000).toFixed(2)} km</Text>
          </View>
          <View style={styles.detailContainer}>
            <Text style={styles.detailLabel}>Step Count</Text>
            <Text style={styles.detailValue}>{stepCount}</Text>
          </View>
        </View>
      </ScrollView>
      {/* End Walk Button */}
      <TouchableOpacity style={styles.endWalkButton} onPress={handleEndWalk}>
        <Text style={styles.endWalkButtonText}>{isTracking ? 'End Walk' : 'Start Walk'}</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default TrackingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#fff',
  },
  noWalkContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  noWalkText: { fontSize: 18, color: '#888' },
  friendsText: {
    color: '#7F12AA',
    fontWeight: 'bold',
    margin: 10,
    fontSize: 18,
    textAlign: 'center'
  },
  friendList: {
    height: 10,
    marginBottom: 10,
  },
  friendAvatarContainer: {
  },
  friendAvatar: {
    width: 70,
    height: 70,
    borderRadius: 50,
    marginHorizontal: 10
  },
  mapContainer: {
    height: 600,  // Fixed height for the map
    marginTop: 20,
    marginHorizontal: 10,
    borderRadius: 5,
  },
  walkDetails: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 10,
  },
  detailContainer: {
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 14,
    color: '#333',
  },
  detailValue: {
    fontSize: 30,
    fontWeight: 'bold',
  },
  endWalkButton: {
    backgroundColor: 'red',
    paddingVertical: 15,
    borderRadius: 2,
    alignItems: 'center',
  },
  endWalkButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
