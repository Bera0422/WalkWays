// import React from 'react';
// import { View, Text, Button, StyleSheet } from 'react-native';
// import { StackNavigationProp } from '@react-navigation/stack';
// import { RootStackParamList } from '../App';

// type RouteDetailsScreenNavigationProp = StackNavigationProp<RootStackParamList, 'RouteDetails'>;

// type Props = {
//   navigation: RouteDetailsScreenNavigationProp;
// };

// const RouteDetailsScreen: React.FC<Props> = ({ navigation }) => {
//   return (
//     <View style={styles.container}>
//       <Text>Route Details Screen</Text>
//       <Button title="Start Walk" onPress={() => navigation.navigate('Tracking')} />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
// });

// export default RouteDetailsScreen;

import React from 'react';
import { View, Text, Image, Button, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { RouteDetailsScreenRouteProp, RouteDetailsScreenNavigationProp } from '../src/types/types';

type RouteDetail = {
  name: string;
  distance: string;
  time: string;
  elevation: string;
  tags: string[];
  image: any; // Use actual image types for assets in a real project
  feedback: string[];
};

// Sample data for a selected route
const routeDetail: RouteDetail = {
  name: 'Manhattan Walk',
  distance: '3.2 miles',
  time: '1 hour',
  elevation: 'Mostly Flat',
  tags: ['City Skyline', 'Family-Friendly', 'Scenic'],
  image: require('../assets/manhattan.jpg'), // Placeholder image
  feedback: [
    'Loved the scenic views!',
    'Perfect for a family walk!',
    'A bit crowded on weekends.'
  ],
};

 interface Props {
  route: RouteDetailsScreenRouteProp;
  navigation: RouteDetailsScreenNavigationProp;
}

const RouteDetailsScreen: React.FC<Props> = ({ route, navigation }) => {
  console.log(route.params);
  return (
    <View style={styles.container}>
      {/* Route Image */}
      <Image source={routeDetail.image} style={styles.image} />

      {/* Route Information */}
      <View style={styles.detailsContainer}>
        <Text style={styles.routeName}>{routeDetail.name}</Text>
        <Text style={styles.routeInfo}>{`${routeDetail.distance} • ${routeDetail.time} • ${routeDetail.elevation}`}</Text>
        
        {/* Tags */}
        <View style={styles.tagsContainer}>
          {routeDetail.tags.map((tag, index) => (
            <Text key={index} style={styles.tag}>
              {tag}
            </Text>
          ))}
        </View>
      </View>

      {/* Start Walk Button */}
      <TouchableOpacity
        style={styles.startWalkButton}
        onPress={() => navigation.navigate('TrackingStack')}
      >
        <Text style={styles.startWalkText}>Start Walk</Text>
      </TouchableOpacity>

      {/* Community Feedback */}
      <View style={styles.feedbackContainer}>
        <Text style={styles.feedbackTitle}>Community Feedback</Text>
        <FlatList
          data={routeDetail.feedback}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => <Text style={styles.feedbackText}>• {item}</Text>}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  image: {
    width: '100%',
    height: 200,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  detailsContainer: {
    padding: 20,
  },
  routeName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  routeInfo: {
    fontSize: 16,
    color: '#555',
    marginVertical: 5,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginVertical: 10,
  },
  tag: {
    backgroundColor: '#e0e0e0',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 15,
    fontSize: 12,
    color: '#333',
    marginRight: 5,
    marginBottom: 5,
  },
  startWalkButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 15,
    marginHorizontal: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  startWalkText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  feedbackContainer: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  feedbackTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  feedbackText: {
    fontSize: 14,
    color: '#555',
    marginBottom: 5,
  },
});

export default RouteDetailsScreen;
