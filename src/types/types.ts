import { StackNavigationProp } from "@react-navigation/stack";
import { RouteProp } from "@react-navigation/native";

export type RootStackParamList = {
  HomeStack: {
    screen: string;
  };
  Home: undefined;
  RouteDetails: {
    routeItem: {
      id: string;
      name: string;
      distance: string;
      time: string;
      tags: string[];
      image: any;
    };
  };
  TrackingStack: {
    screen: string;
    params: any
  };
  Tracking: {
    routeId: string
  };
  Feedback: {
    routeId: string;
  };
  CommunityStack: {
    screen: string;
  }
  Community: undefined;
};

export type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

export type RouteDetailsScreenRouteProp = RouteProp<RootStackParamList, 'RouteDetails'>;
export type RouteDetailsScreenNavigationProp = StackNavigationProp<RootStackParamList, 'RouteDetails'>;

export type TrackingScreenRouteProp = RouteProp<RootStackParamList, 'Tracking'>;
export type TrackingScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Tracking'>;

export type FeedbackScreenRouteProp = RouteProp<RootStackParamList, 'Feedback'>;
export type FeedbackScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Feedback'>;
