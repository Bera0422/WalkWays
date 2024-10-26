// TrackingScreen.tsx
import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, Button, TouchableOpacity, FlatList } from 'react-native';
import MapView, { Polyline } from 'react-native-maps';
import { TrackingScreenNavigationProp } from '../src/types/types';

const avatars = [
  { avatarId: '1', uri: require('../assets/avatars/1.jpg')},
  { avatarId: '2', uri: require('../assets/avatars/72.jpg')},
  { avatarId: '3', uri: require('../assets/avatars/5.jpg')},
  { avatarId: '4', uri: require('../assets/avatars/8.jpg')},
  { avatarId: '5', uri: require('../assets/avatars/14.jpg')},
  { avatarId: '6', uri: require('../assets/avatars/26.jpg')},
  { avatarId: '7', uri: require('../assets/avatars/27.jpg')},
  { avatarId: '8', uri: require('../assets/avatars/35.jpg')},
  { avatarId: '9', uri: require('../assets/avatars/42.jpg')},
 
]

interface Props {
  navigation: TrackingScreenNavigationProp
}

const TrackingScreen: React.FC<Props> = ({ navigation }) => {  
  return (
    <View style={styles.container}>
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
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: 37.78825,
          longitude: -122.4324,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
        {/* Placeholder Polyline Route */}
        <Polyline
          coordinates={[
            { latitude: 37.78825, longitude: -122.4324 },
            { latitude: 37.78525, longitude: -122.4324 },
          ]}
          strokeColor="#0000FF"
          strokeWidth={3}
        />
      </MapView>

      {/* Walk Details */}
      <View style={styles.walkDetails}>
        <View style={styles.detailContainer}>
          <Text style={styles.detailLabel}>Time Elapsed</Text>
          <Text style={styles.detailValue}>25 min</Text>
        </View>
        <View style={styles.detailContainer}>
          <Text style={styles.detailLabel}>Distance Walked</Text>
          <Text style={styles.detailValue}>1.2 miles</Text>
        </View>
        <View style={styles.detailContainer}>
          <Text style={styles.detailLabel}>Step Count</Text>
          <Text style={styles.detailValue}>4300</Text>
        </View>
      </View>

      {/* End Walk Button */}
      <TouchableOpacity style={styles.endWalkButton} onPress={() => { navigation.navigate('Feedback')}}>
        <Text style={styles.endWalkButtonText}>End Walk</Text>
      </TouchableOpacity>
      
    </View>
  );
};

export default TrackingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#fff',
  },
  friendsText:{
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
    marginHorizontal:10
  },
  map: {
    height: 500,
    marginVertical: 10,
    borderRadius: 10,
  },
  walkDetails: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 20,
  },
  detailContainer: {
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 14,
    color: '#333',
  },
  detailValue: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  endWalkButton: {
    backgroundColor: 'red',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  endWalkButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
