import { Timestamp, GeoPoint } from "firebase/firestore";

export interface Route  {
    id: string;
    image: string;
    name: string;
    distance: string;
    estimatedTime: string;
    elevation: string;
    tags: { id: string; name: string; icon: string }[];
    details: {
      images: string[];
      description: string;
      location: GeoPoint;
    }
    rating: number;
    timestamp: Timestamp;
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
