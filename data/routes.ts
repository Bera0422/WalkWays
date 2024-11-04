const routes = [
    {
      id: '1',
      name: 'Manhattan Walk',
      distance: '3.2 miles',
      time: '1 hour',
      rating: 4.5,
      tags: [
        { id: '1', name: 'City Skyline', icon: 'city' },
        { id: '2', name: 'Best for Tourists', icon: 'suitcase' },
      ],
      image: require('../assets/manhattan.jpg'), 
    },
    {
      id: '2',
      name: 'Rome Historic Walk',
      distance: '4 miles',
      time: '1 hour 20 min',
      rating: 5.0,
      tags: [
        { id: '1', name: 'Ancient Ruins', icon: '' },
        { id: '2', name: 'Cobblestone Streets', icon: '' },
      ],
      image: require('../assets/rome.jpg'),
    },
    {
      id: '3',
      name: 'Istanbul Walk',
      distance: '4 miles',
      time: '1 hour 20 mins',
      rating: 4.7,
      tags: [
        { id: '1', name: 'Waterfront', icon: 'water' },
        { id: '2', name: 'Historic Landmarks', icon: 'landmark' },
        { id: '3', name: 'Markets', icon: 'bag-shopping' },
      ],
      image: require('../assets/istanbul.jpg'),
    },
    {
      id: '4',
      name: 'Golden Gate Stroll',
      distance: '2.8 miles',
      time: '50 mins',
      rating: 4.8,
      tags: [
        { id: '1', name: 'Scenic', icon: 'image' },
        { id: '2', name: 'Iconic', icon: 'grin-stars' },
      ],
      image: require('../assets/golden_gate.jpg'),
    },
    {
      id: '5',
      name: 'Paris Riverside Walk',
      distance: '2.5 miles',
      time: '45 mins',
      rating: 4.7,
      tags: [
        { id: '1', name: 'Romantic', icon: 'heart' },
        { id: '2', name: 'Historic Bridges', icon: 'bridge' },
      ],
      image: require('../assets/paris.jpg'),
    },
    {
      id: '6',
      name: 'Kyoto Temple Trail',
      distance: '3 miles',
      time: '1 hour 15 mins',
      rating: 5.0,
      tags: [
        { id: '1', name: 'Cultural', icon: '' },
        { id: '2', name: 'Nature', icon: 'leaf' },
      ],
      image: require('../assets/kyoto.jpg'),
    },
    {
      id: '7',
      name: 'Sydney Harbour Loop',
      distance: '3.8 miles',
      time: '1 hour 10 mins',
      rating: 4.6,
      tags: [
        { id: '1', name: 'Waterfront', icon: 'water' },
        { id: '2', name: 'Scenic Views', icon: 'camera' },
      ],
      image: require('../assets/sydney.jpg'),
    },
    {
      id: '8',
      name: 'London Royal Parks',
      distance: '5 miles',
      time: '1 hour 30 mins',
      rating: 4.9,
      tags: [
        { id: '1', name: 'Gardens', icon: 'seedling' },
        { id: '2', name: 'Landmarks', icon: 'landmark' },
      ],
      image: require('../assets/london.jpg'),
    },
    {
      id: '9',
      name: 'Barcelona Gaudí Tour',
      distance: '2 miles',
      time: '40 mins',
      rating: 4.8,
      tags: [
        { id: '1', name: 'Architecture', icon: 'building' },
        { id: '2', name: 'Artistic', icon: 'palette' },
      ],
      image: require('../assets/gaudi.jpg'),
    },
  ];

export default routes;