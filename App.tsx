// App.tsx
import React, { useEffect, useRef, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import Navigation from './AppNavigator';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { AppState, AppStateStatus } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function App() {
  const appState = useRef(AppState.currentState);

  const handleAppStateChange = async (nextAppState: AppStateStatus) => {
    if (nextAppState === 'background') {
      await saveAppData();
    } else if (nextAppState === 'active') {
      await loadAppData();
    }

    if (
      appState.current.match(/inactive|background/) &&
      nextAppState === 'active'
    ) {
      console.log('App has come to the foreground!');
    }

    appState.current = nextAppState;
    console.log('AppState', appState.current);
  };

  useEffect(() => {
    const subscription = AppState.addEventListener('change', handleAppStateChange);

    // Load data initially when app starts
    loadAppData();

    return () => {
      subscription.remove()
    };
  }, []);

  const saveAppData = async () => {
    try {
      const trackingData = await AsyncStorage.getItem('trackingData');
      const feedbackData = await AsyncStorage.getItem('unsavedFeedback');
      if (trackingData || feedbackData) {
        console.log('Data saved successfully');
      }
    } catch (error) {
      console.error('Failed to save app data:', error);
    }
  };

  const loadAppData = async () => {
    try {
      const trackingData = await AsyncStorage.getItem('trackingData');
      const feedbackData = await AsyncStorage.getItem('unsavedFeedback');
      if (trackingData) {
        console.log('Tracking data loaded:', trackingData);
      }
      if (feedbackData) {
        console.log('Feedback data loaded:', feedbackData);
      }
    } catch (error) {
      console.error('Failed to load app data:', error);
    }
  };
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
    <NavigationContainer>
      <Navigation />
    </NavigationContainer>
    </GestureHandlerRootView>
  );
}

