import { db } from './firebaseConfig.js'; // Adjust the path according to your file structure
import { collection, addDoc, Timestamp, GeoPoint, getDocs, updateDoc, doc} from 'firebase/firestore';
const _routes = [
  {
    id: '1',
    name: 'Manhattan Walk',
    distance: '3.2 miles',
    estimatedTime: '1 hour',
    rating: 4.5,
    tagIDs: [
      { id: '1', name: 'City Skyline', icon: 'city' },
      { id: '2', name: 'Best for Tourists', icon: 'suitcase' },
    ],
    timestamp: Timestamp.now(),
  },
  {
    id: '2',
    name: 'Rome Historic Walk',
    distance: '4 miles',
    estimatedTime: '1 hour 20 min',
    rating: 5.0,
    tagIDs: [
      { id: '1', name: 'Ancient Ruins', icon: '' },
      { id: '2', name: 'Cobblestone Streets', icon: '' },
    ],
    timestamp: Timestamp.now(),
  },
  {
    id: '3',
    name: 'Istanbul Walk',
    distance: '4 miles',
    estimatedTime: '1 hour 20 mins',
    rating: 4.7,
    tagIDs: [
      { id: '1', name: 'Waterfront', icon: 'water' },
      { id: '2', name: 'Historic Landmarks', icon: 'landmark' },
      { id: '3', name: 'Markets', icon: 'bag-shopping' },
    ],
    timestamp: Timestamp.now(),
  },
  {
    id: '4',
    name: 'Golden Gate Stroll',
    distance: '2.8 miles',
    estimatedTime: '50 mins',
    rating: 4.8,
    tagIDs: [
      { id: '1', name: 'Scenic', icon: 'image' },
      { id: '2', name: 'Iconic', icon: 'grin-stars' },
    ],
    timestamp: Timestamp.now(),
  },
  {
    id: '5',
    name: 'Paris Riverside Walk',
    distance: '2.5 miles',
    estimatedTime: '45 mins',
    rating: 4.7,
    tagIDs: [
      { id: '1', name: 'Romantic', icon: 'heart' },
      { id: '2', name: 'Historic Bridges', icon: 'bridge' },
    ],
    timestamp: Timestamp.now(),
  },
  {
    id: '6',
    name: 'Kyoto Temple Trail',
    distance: '3 miles',
    estimatedTime: '1 hour 15 mins',
    rating: 5.0,
    tagIDs: [
      { id: '1', name: 'Cultural', icon: '' },
      { id: '2', name: 'Nature', icon: 'leaf' },
    ],
    timestamp: Timestamp.now(),
  },
  {
    id: '7',
    name: 'Sydney Harbour Loop',
    distance: '3.8 miles',
    estimatedTime: '1 hour 10 mins',
    rating: 4.6,
    tagIDs: [
      { id: '1', name: 'Waterfront', icon: 'water' },
      { id: '2', name: 'Scenic Views', icon: 'camera' },
    ],
    timestamp: Timestamp.now(),
  },
  {
    id: '8',
    name: 'London Royal Parks',
    distance: '5 miles',
    estimatedTime: '1 hour 30 mins',
    rating: 4.9,
    tagIDs: [
      { id: '1', name: 'Gardens', icon: 'seedling' },
      { id: '2', name: 'Landmarks', icon: 'landmark' },
    ],
    timestamp: Timestamp.now(),
  },
  {
    id: '9',
    name: 'Barcelona Gaudí Tour',
    distance: '2 miles',
    estimatedTime: '40 mins',
    rating: 4.8,
    tagIDs: [
      { id: '1', name: 'Architecture', icon: 'building' },
      { id: '2', name: 'Artistic', icon: 'palette' },
    ],
    timestamp: Timestamp.now(),
  },
];

const routeDetails = {
  '1': {
    name: 'Manhattan Walk',
    distance: '3.2 miles',
    time: '1 hour',
    elevation: 'Mostly Flat',
    tags: ['City Skyline', 'Family-Friendly', 'Scenic'],
    // images: [
    //   require('./assets/manhattan.jpg'),
    //   require('./assets/manhattan2.jpg'),
    // ],
    description: 'Experience the best views of the city skyline on this scenic route, perfect for families and tourists alike.',
    rating: 4.5,
    latitude: 40.758896,
    longitude: -73.98513,
  },
  '2': {
      name: 'Rome Historic Walk',
      distance: '4 miles',
      time: '1 hour 20 min',
      elevation: 'Slightly Hilly',
      tags: ['Ancient Ruins', 'Cobblestone Streets', 'Historic'],
      // images: [
      //     require('../assets/rome.jpg'),
      //     require('../assets/rome2.jpg'),
      // ],
      description: 'A walk through the heart of ancient Rome, featuring cobblestone streets and iconic ruins at every turn.',
      rating: 5.0,
      latitude: 41.902782,
      longitude: 12.496366,
  },
  '3': {
      name: 'Istanbul Bosphorus Walk',
      distance: '4 miles',
      time: '1 hour 20 mins',
      elevation: 'Moderate Hills',
      tags: ['Waterfront', 'Historic Landmarks', 'Markets'],
      // images: [
      //     require('../assets/istanbul.jpg'),
      //     require('../assets/istanbul2.jpg'),
      //     require('../assets/istanbul3.jpg'),
      // ],
      description: 'Discover Istanbul’s unique blend of cultures on this walk along the Bosphorus, passing historic mosques, bustling markets, and scenic waterfront views.',
      rating: 4.7,
      latitude: 41.0082,
      longitude: 28.9784,
  },
  '4': {
      name: 'Golden Gate Stroll',
      distance: '2.8 miles',
      time: '50 mins',
      elevation: 'Mostly Flat',
      tags: ['Scenic', 'Iconic', 'Bridge Views'],
      // images: [
      //     require('../assets/golden_gate.jpg'),
      //     require('../assets/golden_gate2.jpg'),
      // ],
      description: 'A scenic walk offering views of the Golden Gate Bridge, ideal for a quick but memorable stroll.',
      rating: 4.8,
      latitude: 37.8199,
      longitude: -122.4783,
  },
  '5': {
      name: 'Paris Riverside Walk',
      distance: '3 miles',
      time: '1 hour',
      elevation: 'Flat',
      tags: ['Riverfront', 'Historic Sites', 'Romantic'],
      // images: [
      //     require('../assets/paris.jpg'),
      //     require('../assets/paris2.jpg'),
      // ],
      description: 'Stroll along the Seine River, enjoying the romantic ambiance and views of historic Parisian landmarks.',
      rating: 4.7,
      latitude: 48.8566,
      longitude: 2.3522,
  },
  '6': {
      name: 'Kyoto Temple Trail',
      distance: '3.5 miles',
      time: '1 hour 30 mins',
      elevation: 'Moderate Hills',
      tags: ['Temple Views', 'Nature', 'Cultural'],
      // images: [
      //     require('../assets/kyoto.jpg'),
      //     require('../assets/kyoto2.jpg'),
      // ],
      description: 'A peaceful route through Kyoto’s famous temples and nature trails, offering a blend of culture and serenity.',
      rating: 4.9,
      latitude: 35.0116,
      longitude: 135.7681,
  },
  '7': {
      name: 'Sydney Harbour Loop',
      distance: '5 miles',
      time: '1 hour 45 mins',
      elevation: 'Varied',
      tags: ['Ocean Views', 'Cliffs', 'Adventure'],
      // images: [
      //     require('../assets/sydney.jpg'),
      //     require('../assets/sydney2.jpg'),
      // ],
      description: 'A coastal adventure along Sydney’s beaches and cliffs, with panoramic views of the ocean.',
      rating: 4.6,
      latitude: -33.8688,
      longitude: 151.2093,
  },
  '8': {
      name: 'London Royal Parks',
      distance: '3.6 miles',
      time: '1 hour 10 mins',
      elevation: 'Mostly Flat',
      tags: ['Riverside', 'Landmarks', 'Historic'],
      // images: [
      //     require('../assets/london.jpg'),
      //     require('../assets/london2.jpg'),
      // ],
      description: 'A scenic walk along the Thames, with views of iconic landmarks like the Tower Bridge and the Houses of Parliament.',
      rating: 4.8,
      latitude: 51.5074,
      longitude: -0.1278,
  },
  '9': {
      name: 'Barcelona Gaudí Tour',
      distance: '2.5 miles',
      time: '1 hour 15 mins',
      elevation: 'Slightly Hilly',
      tags: ['Artistic', 'Architectural', 'City Walk'],
      // images: [
      //     require('../assets/gaudi.jpg'),
      //     require('../assets/gaudi2.jpg'),
      // ],
      description: 'Explore the vibrant architecture of Gaudí in Barcelona, including the famous Sagrada Familia and other landmarks.',
      rating: 4.9,
      latitude: 41.3851,
      longitude: 2.1734,
  },
};

const seedRoutes = async () => {
  try {
    const routesCollection = collection(db, 'routes');

    for (const route of _routes) {
      // Here, you can adjust the data structure if needed
      const { id, ...dataWithoutId } = route; // Remove id if you want Firestore to generate its own
      await addDoc(routesCollection, { ...dataWithoutId }); // Add the route to Firestore
      console.log(`Route ${route.name} added to Firestore!`);
    }

    console.log('All routes have been added successfully!');
  } catch (error) {
    console.error("Error adding routes: ", error);
  }
};

const seedTags = async () => {
  try {
    const tagsCollection = collection(db, 'tags');

    for (const route of _routes) {
      // Here, you can adjust the data structure if needed
      const tags = route.tags;
      for (const tag of tags) {
        const { id, ...dataWithoutId } = tag;
        await addDoc(tagsCollection, { ...dataWithoutId }); // Add the route to Firestore
        console.log(`Tag ${tag.name} added to Firestore!`);
      }
    }

    console.log('All tags have been added successfully!');
  } catch (error) {
    console.error("Error adding tags: ", error);
  }
};

const updateRoutesByName = async () => {
  try {
    const routesCollection = collection(db, 'routes');
    const routesSnapshot = await getDocs(routesCollection);

    // Iterate over each document in Firestore
    routesSnapshot.forEach(async (routeDoc) => {
      const firestoreData = routeDoc.data();
      const routeId = routeDoc.id;

      // Find matching route in your data by name
      const matchingRoute = Object.values(routeDetails).find(route => route.name === firestoreData.name);

      // If a match is found, update Firestore document
      if (matchingRoute) {
        const routeRef = doc(db, 'routes', routeId);

        await updateDoc(routeRef, {
          elevation: matchingRoute.elevation,
          details: {
            description: matchingRoute.description,
            images: [''],
            location: new GeoPoint(matchingRoute.latitude, matchingRoute.longitude)
          }
        });

        console.log(`Route ${firestoreData.name} updated successfully!`);
      }
    });

    console.log('All matching routes have been updated!');
  } catch (error) {
    console.error("Error updating routes: ", error);
  }
};

// seedRoutes();

// seedTags();

// updateRoutesByName();
