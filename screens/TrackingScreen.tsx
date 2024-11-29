import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  AppState,
} from 'react-native';
import { convertDistance } from 'geolib';
import { Timestamp } from 'firebase/firestore';
import { Pedometer } from 'expo-sensors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '../src/context/AuthContext';
import TrackingMap from '../src/components/TrackingMap';
import Timer from '../src/components/Timer';
import { saveCompletedRoute, updateUsersCompletedRoutes } from '../src/services/firestoreService';
import { TrackingScreenNavigationProp, TrackingScreenRouteProp } from '../src/types/props';
import RecordWalk from '../src/components/RecordWalk';

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
  const routeDetails = route.params?.routeDetails;
  const routeId = routeDetails?.id;
  const routeName = routeDetails?.name;
  const { user } = useAuth();

  const [startTime, setStartTime] = useState<number | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [stepCount, setStepCount] = useState(0);
  const [isTracking, setIsTracking] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [savedRouteId, setSavedRouteId] = useState(-1);
  const [distanceWalked, setDistanceWalked] = useState(0);

  useEffect(() => {
    const subscription = Pedometer.watchStepCount((result) => {
      const stepLength = 0.762; // Average step length in meters
      const distanceFromSteps = result.steps * stepLength;
      setStepCount(result.steps);
      setDistanceWalked((prevDistance) =>
        Math.max(prevDistance, convertDistance(distanceFromSteps, 'mi'))
      );
    });
    return () => subscription.remove();
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isTracking || isRecording) {
      interval = setInterval(() => setElapsedTime((prev) => prev + 1), 1000);
    } else if (interval) {
      clearInterval(interval);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTracking, isRecording]);

  const loadTimer = async () => {
    const savedStartTime = await AsyncStorage.getItem('startTime');
    if (savedStartTime) {
      const elapsed = Math.floor((Date.now() - parseInt(savedStartTime, 10)) / 1000);
      setStartTime(parseInt(savedStartTime, 10));
      setElapsedTime(elapsed);
    }
  };

  useEffect(() => {
    loadTrackingData();
    const appStateListener = AppState.addEventListener('change', handleAppStateChange);
    return () => {
      saveTrackingData();
      appStateListener.remove();
    };
  }, []);

  const handleAppStateChange = async (nextAppState: any) => {
    if (nextAppState === 'background' && isTracking) await saveTrackingData();
    if (nextAppState === 'active') {
      loadTimer();
    }
  };

  const saveTrackingData = async () => {
    try {
      const trackingData = { startTime, elapsedTime, isTracking, distanceWalked, savedRouteId };
      await AsyncStorage.setItem('trackingData', JSON.stringify(trackingData));
    } catch (error) {
      console.error('Error saving tracking data:', error);
    }
  };

  const loadTrackingData = async () => {
    try {
      const savedData = await AsyncStorage.getItem('trackingData');
      if (savedData) {
        const parsedData = JSON.parse(savedData);
        if (parsedData.routeId === routeId) {
          setStartTime(parsedData.startTime);
          setIsTracking(parsedData.isTracking);
          setElapsedTime(parsedData.elapsedTime);
          setDistanceWalked(parsedData.distanceWalked);
        }
        else {
          setSavedRouteId(parsedData.routeId);
          startTracking();
        }
      }
    } catch (error) {
      console.error('Error loading tracking data:', error);
    }
  };

  const handleEndWalk = async () => {
    const routeData = {
      routeId: routeId,
      routeName: routeDetails.name,
      distanceWalked: distanceWalked,
      stepsWalked: stepCount,
      timeTaken: elapsedTime,
      timestamp: Timestamp.now(),
    };

    try {
      const completedRouteId = await saveCompletedRoute(routeData) || "";
      await updateUsersCompletedRoutes(completedRouteId, user?.uid);
    } catch (error) {
      console.error('Error saving completed route:', error);
    }

    setIsTracking(false);
    await AsyncStorage.removeItem('trackingData');
    navigation.navigate('Feedback', { routeId, routeName });
  };


  const startTracking = async () => {
    const now = Date.now();
    setStartTime(now);
    setElapsedTime(0);
    await AsyncStorage.setItem('startTime', now.toString());
    setIsTracking(true);
  };

  const updateDistanceWalked = (distance: number) => {
    setDistanceWalked((prevDistance) => prevDistance + distance);
  };

  const handleStartRecording = async () => {
    const now = Date.now();
    setStartTime(now);
    setElapsedTime(0);
    await AsyncStorage.setItem('startTime', now.toString());
    setIsRecording(true);
  };

  const handleEndRecording = (routeWaypoints: { latitude: number, longitude: number }[]) => {

    setIsRecording(false);
    console.log("Recording ended!");
    // console.log("Recorded route: ", route);
    navigation.navigate('SaveRoute', { routeWaypoints, distanceWalked, estimatedTime: elapsedTime });
  };

  if (!isTracking && !isRecording) {
    return (
      <View style={styles.noWalkContainer}>
        <Text style={styles.noWalkText}>No ongoing walk</Text>
        {!isRecording && user?.uid &&
          <TouchableOpacity style={styles.startWalkButton} onPress={handleStartRecording}>
            <Text style={styles.startWalkButtonText}>Start Recording Walk</Text>
          </TouchableOpacity>}
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Friends List (Horizontal Scroll) */}
        {/* <View>
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
        </View> */}
        <View style={styles.walkDetails}>
          <View style={styles.detailContainer}>
            <Text style={styles.detailLabel}>Time Elapsed</Text>
            <Timer seconds={elapsedTime} />
          </View>
          <View style={styles.detailContainer}>
            <Text style={styles.detailLabel}>Distance Walked</Text>
            <Text style={styles.detailValue}>{convertDistance(distanceWalked, 'mi').toFixed(2)} miles</Text>
          </View>
          <View style={styles.detailContainer}>
            <Text style={styles.detailLabel}>Step Count</Text>
            <Text style={styles.detailValue}>{stepCount}</Text>
          </View>
        </View>

        <View style={styles.mapContainer}>
          {isTracking ?
            <TrackingMap updateDistanceWalked={updateDistanceWalked} waypoints={routeDetails.details.waypoints} />
            : <RecordWalk updateDistanceWalked={updateDistanceWalked} onEndWalk={handleEndRecording} />}
        </View>
      </ScrollView>
      {isTracking && <TouchableOpacity style={styles.endWalkButton} onPress={handleEndWalk}>
        <Text style={styles.endWalkButtonText}>End Walk</Text>
      </TouchableOpacity>}
    </SafeAreaView>
  );
};

export default TrackingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f8fa',
  },
  scrollContainer: {
    paddingVertical: 20,
  },
  walkDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 12,
    marginHorizontal: 15,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  noWalkContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noWalkText: {
    fontSize: 18,
    color: '#555',
  },
  startWalkButton: {
    marginTop: 20,
    backgroundColor: '#4CAF50',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  startWalkButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  detailContainer: {
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 14,
    color: '#888',
    fontWeight: '600',
    marginBottom: 5,
  },
  detailValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  mapContainer: {
    height: 500,
    margin: 10,
    borderRadius: 10,
    overflow: 'hidden',
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
});
