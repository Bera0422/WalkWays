type RouteDetailType = {
    name: string;
    distance: string;
    time: string;
    elevation: string;
    tags: string[];
    images: any[];
    description: string;
    rating: number;
};
const routeDetails: Record<string, RouteDetailType & { latitude: number; longitude: number }> = {
    '1': {
        name: 'Manhattan Walk',
        distance: '3.2 miles',
        time: '1 hour',
        elevation: 'Mostly Flat',
        tags: ['City Skyline', 'Family-Friendly', 'Scenic'],
        images: [
            require('../assets/manhattan.jpg'),
            require('../assets/manhattan2.jpg'),
        ],
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
        images: [
            require('../assets/rome.jpg'),
            require('../assets/rome2.jpg'),
        ],
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
        images: [
            require('../assets/istanbul.jpg'),
            require('../assets/istanbul2.jpg'),
            require('../assets/istanbul3.jpg'),
        ],
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
        images: [
            require('../assets/golden_gate.jpg'),
            require('../assets/golden_gate2.jpg'),
        ],
        description: 'A scenic walk offering views of the Golden Gate Bridge, ideal for a quick but memorable stroll.',
        rating: 4.8,
        latitude: 37.8199,
        longitude: -122.4783,
    },
    '5': {
        name: 'Paris River Walk',
        distance: '3 miles',
        time: '1 hour',
        elevation: 'Flat',
        tags: ['Riverfront', 'Historic Sites', 'Romantic'],
        images: [
            require('../assets/paris.jpg'),
            require('../assets/paris2.jpg'),
        ],
        description: 'Stroll along the Seine River, enjoying the romantic ambiance and views of historic Parisian landmarks.',
        rating: 4.7,
        latitude: 48.8566,
        longitude: 2.3522,
    },
    '6': {
        name: 'Kyoto Temple Path',
        distance: '3.5 miles',
        time: '1 hour 30 mins',
        elevation: 'Moderate Hills',
        tags: ['Temple Views', 'Nature', 'Cultural'],
        images: [
            require('../assets/kyoto.jpg'),
            require('../assets/kyoto2.jpg'),
        ],
        description: 'A peaceful route through Kyoto’s famous temples and nature trails, offering a blend of culture and serenity.',
        rating: 4.9,
        latitude: 35.0116,
        longitude: 135.7681,
    },
    '7': {
        name: 'Sydney Coastal Walk',
        distance: '5 miles',
        time: '1 hour 45 mins',
        elevation: 'Varied',
        tags: ['Ocean Views', 'Cliffs', 'Adventure'],
        images: [
            require('../assets/sydney.jpg'),
            require('../assets/sydney2.jpg'),
        ],
        description: 'A coastal adventure along Sydney’s beaches and cliffs, with panoramic views of the ocean.',
        rating: 4.6,
        latitude: -33.8688,
        longitude: 151.2093,
    },
    '8': {
        name: 'London Thames Path',
        distance: '3.6 miles',
        time: '1 hour 10 mins',
        elevation: 'Mostly Flat',
        tags: ['Riverside', 'Landmarks', 'Historic'],
        images: [
            require('../assets/london.jpg'),
            require('../assets/london2.jpg'),
        ],
        description: 'A scenic walk along the Thames, with views of iconic landmarks like the Tower Bridge and the Houses of Parliament.',
        rating: 4.8,
        latitude: 51.5074,
        longitude: -0.1278,
    },
    '9': {
        name: 'Barcelona Gaudi Trail',
        distance: '2.5 miles',
        time: '1 hour 15 mins',
        elevation: 'Slightly Hilly',
        tags: ['Artistic', 'Architectural', 'City Walk'],
        images: [
            require('../assets/gaudi.jpg'),
            require('../assets/gaudi2.jpg'),
        ],
        description: 'Explore the vibrant architecture of Gaudí in Barcelona, including the famous Sagrada Familia and other landmarks.',
        rating: 4.9,
        latitude: 41.3851,
        longitude: 2.1734,
    },
};

export default routeDetails;
