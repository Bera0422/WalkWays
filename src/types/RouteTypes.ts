export interface Route {
    id: string;
    name: string;
    distance: string;
    time: string;
    rating: number;
    tags: { id: string; name: string; icon: string }[];
    image: any; // or ImageSourcePropType if using only local images
  }
  