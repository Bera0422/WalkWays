import { Timestamp, GeoPoint } from "firebase/firestore";

export interface Route {
  id: string;
  image: string;
  name: string;
  distance: string;
  estimatedTime: string;
  elevation: string;
  tags: { id: string; name: string; icon: string }[];
  details: {
    waypoints: GeoPoint[];
    images: string[];
    description: string;
    location: GeoPoint;
  }
  rating: number;
  timestamp: Timestamp;
  displayOnHome: boolean,
  curated: boolean,
}

export interface IReview {
  id: string;
  name: string;
  avatar: string;
  rating: number;
  tags: { id: string; name: string; icon: string }[];
  text: string;
  timestamp: Timestamp;
  media?: any;
};

export interface Post {
  id: string;
  avatar: string;
  name: string;
  date: string;
  tags: { id: string; name: string; icon: string }[];
  text: string;
  images?: string[];
  postImage: string;
  routeName?: string;
  likes: { [userId: string]: boolean };
  comments: { name: string; comment: string; userId: string; timestamp: Timestamp }[];
};