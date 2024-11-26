import { StackNavigationProp } from "@react-navigation/stack";
import { RouteProp } from "@react-navigation/native";
import { Route } from "./types";

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
    routeDetails: Route;
  };
  Feedback: {
    routeId: string;
    routeName: string;
  };
  SaveRoute: {
    routeWaypoints: { latitude: number, longitude: number }[];
    distanceWalked: number;
    estimatedTime: number;
  };
  CommunityStack: {
    screen: string;
  }
  Community: undefined;
  ProfileStack: {
    screen: string;
  }
  Profile: undefined;
  SignUp: undefined;
  Login: undefined;
  PasswordReset: undefined;
};

export type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

export type RouteDetailsScreenRouteProp = RouteProp<RootStackParamList, 'RouteDetails'>;
export type RouteDetailsScreenNavigationProp = StackNavigationProp<RootStackParamList, 'RouteDetails'>;

export type TrackingScreenRouteProp = RouteProp<RootStackParamList, 'Tracking'>;
export type TrackingScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Tracking'>;

export type FeedbackScreenRouteProp = RouteProp<RootStackParamList, 'Feedback'>;
export type FeedbackScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Feedback'>;

export type SaveRouteScreenRouteProp = RouteProp<RootStackParamList, 'SaveRoute'>;
export type SaveRouteScreenNavigationProp = StackNavigationProp<RootStackParamList, 'SaveRoute'>;

export type SignUpScreenRouteProp = RouteProp<RootStackParamList, 'SignUp'>;
export type SignUpScreenNavigationProp = StackNavigationProp<RootStackParamList, 'SignUp'>;

export type LoginScreenRouteProp = RouteProp<RootStackParamList, 'Login'>;
export type LoginScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Login'>;

export type ProfileScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Profile'>;

export type PasswordResetScreenNavigationProp = StackNavigationProp<RootStackParamList, 'PasswordReset'>;
