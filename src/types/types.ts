import { StackNavigationProp } from "@react-navigation/stack";
import { RouteProp } from "@react-navigation/native";

export type RootStackParamList = {
    HomeStack: undefined;
    RouteDetails: {
      route: {
        id: string;
        name: string;
        distance: string;
        time: string;
        tags: string[];
        image: any;
      };
    };
    TrackingStack: undefined;
    Feedback: undefined;
    Community: undefined;
  };

export type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'HomeStack'>;

export type RouteDetailsScreenRouteProp = RouteProp<RootStackParamList, 'RouteDetails'>;
export type RouteDetailsScreenNavigationProp = StackNavigationProp<RootStackParamList, 'RouteDetails'>;

export type TrackingScreenNavigationProp = StackNavigationProp<RootStackParamList, 'TrackingStack'>;

export type FeedbackScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Feedback'>;
