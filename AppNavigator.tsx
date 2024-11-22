// navigation.tsx
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './screens/HomeScreen';
import RouteDetailsScreen from './screens/RouteDetailsScreen';
import TrackingScreen from './screens/TrackingScreen';
import FeedbackScreen from './screens/FeedbackScreen';
import CommunityScreen from './screens/CommunityScreen';
import { RootStackParamList } from './src/types/props';
import ProfileScreen from './screens/ProfileScreen';
import LoginScreen from './screens/LoginScreen';
import SignUpScreen from './screens/SignUpScreen';
import { useAuth } from './src/context/AuthContext';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator<RootStackParamList>();

function HomeStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={HomeScreen}
        options={{
          title: 'Home',
          headerStyle: { backgroundColor: '#6A2766' },
          headerTintColor: '#fff',
        }} />
      <Stack.Screen name="RouteDetails" component={RouteDetailsScreen}
        options={{
          title: 'Route Details',
          headerStyle: { backgroundColor: '#6A2766' },
          headerTintColor: '#fff',
        }} />
      {/* <Stack.Screen name="Tracking" component={TrackingScreen} /> */}
      {/* <Stack.Screen name="Feedback" component={FeedbackScreen} /> */}
    </Stack.Navigator>
  );
}

function TrackingStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Tracking"
        component={TrackingScreen}
        options={{
          title: 'Tracking Walk',
          headerStyle: { backgroundColor: '#4CAF50' },
          headerTintColor: '#fff',
        }} />
      <Stack.Screen
        name="Feedback"
        component={FeedbackScreen}
        options={{
          title: 'Feedback',
          headerStyle: { backgroundColor: '#6A2766' },
          headerTintColor: '#fff',
        }} />
      {/* <Stack.Screen name="Community" component={CommunityScreen} /> */}
    </Stack.Navigator>
  );
}

function CommunityStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Community"
        component={CommunityScreen}
        options={{
          title: 'Your Community',
          headerStyle: { backgroundColor: '#6A2766' },
          headerTintColor: '#fff',
        }} />
    </Stack.Navigator>
  );
}

function ProfileStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          title: 'Your Profile',
          headerStyle: { backgroundColor: '#6A2766' },
          headerTintColor: '#fff',
        }} />
    </Stack.Navigator>
  );
}

function AuthStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{
          title: 'Login',
          headerStyle: { backgroundColor: '#6A2766' },
          headerTintColor: '#fff',
        }} />
      <Stack.Screen
        name="SignUp"
        component={SignUpScreen}
        options={{
          title: 'Sign Up',
          headerStyle: { backgroundColor: '#6A2766' },
          headerTintColor: '#fff',
        }}
      />
    </Stack.Navigator>
  );
}

export default function Navigation() {
  const user = useAuth();
  console.log(user.user);
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen
        name="HomeStack"
        component={HomeStack}
        options={{
          title: 'Home',
        }}
      />
      <Tab.Screen
        name="TrackingStack"
        component={TrackingStack}
        options={{
          title: 'Track',
        }}
      />
      <Tab.Screen
        name="CommunityStack"
        component={CommunityStack}
        options={{
          title: 'Community',
        }}
      />
      {user.user ? (
        <Tab.Screen
          name="ProfileStack"
          component={ProfileStack}
          options={{
            title: 'Profile',
          }}
        />
      ) : (
        <Tab.Screen
          name="AuthStack"
          component={AuthStack}
          options={{
            title: 'Login'
          }}
        />
      )}
    </Tab.Navigator>
  );
}
