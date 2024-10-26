// // App.tsx
// import React from 'react';
// import { NavigationContainer } from '@react-navigation/native';
// import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// import { createStackNavigator } from '@react-navigation/stack';
// import HomeScreen from './screens/HomeScreen';
// import RouteDetailsScreen from './screens/RouteDetailsScreen';
// // import CommunityScreen from './screens/CommunityScreen';
// import TrackingScreen from './screens/TrackingScreen';
// import FeedbackScreen from './screens/FeedbackScreen';

// const Stack = createStackNavigator();
// const Tab = createBottomTabNavigator();

// function MainTabs() {
//     return (
//         <Tab.Navigator>
//             <Tab.Screen name="Home" component={HomeScreen} />
//             {/* <Tab.Screen name="Community" component={CommunityScreen} /> */}
//             <Tab.Screen name="Tracking" component={TrackingScreen} />
//             <Tab.Screen name="Feedback" component={FeedbackScreen} />
//         </Tab.Navigator>
//     );
// }

// export default function App() {
//     return (
//         <NavigationContainer>
//             <Stack.Navigator>
//                 <Stack.Screen name="Main" component={MainTabs} options={{ headerShown: false }} />
//                 <Stack.Screen name="RouteDetails" component={RouteDetailsScreen} />
//                 <Stack.Screen name="Feedback" component={FeedbackScreen} />
//             </Stack.Navigator>
//         </NavigationContainer>
//     );
// }

// App.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import Navigation from './AppNavigator';

export default function App() {
  return (
    <NavigationContainer>
      <Navigation />
    </NavigationContainer>
  );
}

