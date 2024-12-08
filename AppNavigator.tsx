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
import { MaterialCommunityIcons } from '@expo/vector-icons'; // or your preferred icon library
import SaveRouteScreen from './screens/SaveRouteScreen';
import PasswordResetScreen from './screens/PasswordResetScreen';
import WalkHistoryScreen from './screens/WalkHistoryScreen';

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
          headerStyle: { backgroundColor: '#6A2766' },
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
      <Stack.Screen
        name="SaveRoute"
        component={SaveRouteScreen}
        options={{
          title: 'Save Your Route',
          headerStyle: { backgroundColor: '#6A2766' },
          headerTintColor: '#fff',
        }} />
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
          title: 'Community',
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
      <Stack.Screen
        name="PasswordReset"
        component={PasswordResetScreen}
        options={{
          title: 'Password Reset',
          headerStyle: { backgroundColor: '#6A2766' },
          headerTintColor: '#fff',
        }}
      />
      <Stack.Screen
        name="WalkHistory"
        component={WalkHistoryScreen}
        options={{
          title: 'All Walk History',
          headerStyle: { backgroundColor: '#6A2766' },
          headerTintColor: '#fff',
        }}
      />
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
      <Stack.Screen
        name="PasswordReset"
        component={PasswordResetScreen}
        options={{
          title: 'Password Reset',
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
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#6200ea',
        tabBarInactiveTintColor: '#666',
        tabBarStyle: { backgroundColor: '#fff' },
      }}
    >
      <Tab.Screen
        name="HomeStack"
        component={HomeStack}
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="home" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="TrackingStack"
        component={TrackingStack}
        options={{
          title: 'Track',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="map-marker-path" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="CommunityStack"
        component={CommunityStack}
        options={{
          title: 'Community',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="account-group" color={color} size={size} />
          ),
        }}
      />
      {user.user ? (
        <Tab.Screen
          name="ProfileStack"
          component={ProfileStack}
          options={{
            title: 'Profile',
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="account-circle" color={color} size={size} />
            ),
          }}
        />
      ) : (
        <Tab.Screen
          name="AuthStack"
          component={AuthStack}
          options={{
            title: 'Login',
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="login" color={color} size={size} />
            ),
          }}
        />
      )}
    </Tab.Navigator>
  );
}
