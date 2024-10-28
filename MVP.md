# WalkWays MVP Documentation

## 1.1 List of Features Needed for the MVP

### 1. User Authentication
- 1.1 Implement sign-up and login screens.
- 1.2 Use Firebase for user data.
- 1.3 Allow password recovery/reset options.

### 2. Home Screen with Curated Walking Routes
- 2.1 Create a database of routes with details (name, distance, time, images, tags).
- 2.2 Design the UI with a list of curated walking routes.
- 2.3 Implement search functionality.
- 2.4 Add filter options for routes (e.g., distance, time, tags).
- 2.5 Create cards for each route displaying name, distance, time, rating, and image.
- 2.6 Enable navigation to Route Details from the Home screen.

### 3. Route Details Screen
- 3.1 Display comprehensive information about each route (e.g., description, elevation, tags).
- 3.2 Include an option to start tracking the route from this screen.
- 3.3 Show user reviews and ratings related to the route.
- 3.4 Provide a share option for the route details.

### 4. Tracking Walks
- 4.1 Integrate map functionality to show current location and route path.
- 4.2 Implement timer for walk duration.
- 4.3 Implement step counter.
- 4.4 Display walk details and friends' avatars on the route.
- 4.5 Add an 'End Walk' button that navigates to the Feedback screen.
- 4.6 Implement functionality for recording and creating a new walking route.

### 5. Feedback System
- 5.1 Create the Feedback screen for users to rate routes and leave comments.
- 5.2 Implement functionality to select tags.
- 5.3 Implement functionality to upload photos.
- 5.4 Store feedback in Firebase.
- 5.5 Enable submission of recorded walking routes as feedback.

### 6. Community Interaction
- 6.1 Implement a Community screen to display posts from users.
- 6.2 Create a PostCard component to showcase user posts with images, comments, and likes.
- 6.3 Implement posting functionality for users to share experiences.

### 7. User Profile
- 7.1 Design a Profile screen UI.
- 7.2 Include options to view past walks and feedback given.
- 7.3 Implement user settings for managing name, avatar, and preferences.

---

## 1.2 Breakdown of Tasks

### 1. User Authentication
1.1 Implement sign-up and login screens.
   - Design UI components for sign-up and login forms.
   - Validate user input for both forms.
   - Create authentication API endpoints.
  
1.2 Use Firebase for user data.
   - Set up Firebase or local storage library.
   - Create functions to save and retrieve user data (e.g., username, password).

1.3 Allow password recovery/reset options.
   - Design UI for password recovery.
   - Implement functionality to send recovery emails (if using Firebase).

---

### 2. Home Screen with Curated Walking Routes
2.1 Create a database of routes with details.
   - Define the structure for route data.
   - Populate the database with initial route entries.

2.2 Design the UI with a list of curated walking routes.
   - Create components for displaying route cards.
   - Style the list to ensure a user-friendly layout.

2.3 Implement search functionality.
   - Create a search bar component.
   - Add event listeners to filter displayed routes based on user input.

2.4 Add filter options for routes.
   - Create filter UI components (e.g., dropdowns, checkboxes).
   - Implement logic to filter routes based on selected criteria.

2.5 Create cards for each route displaying relevant information.
   - Ensure cards include name, distance, time, rating, and image.
   - Implement onPress functionality for each card to navigate to Route Details.

2.6 Enable navigation to Route Details from the Home screen.
   - Set up navigation stack using React Navigation.
   - Test navigation flow from Home to Route Details screen.

---

### 3. Route Details Screen
3.1 Display comprehensive information about each route.
   - Design UI to showcase detailed route information, including description, elevation, and tags.
   - Ensure that information is clear and accessible.

3.2 Include an option to start tracking the route.
   - Implement a 'Start Walk' button that navigates to the Tracking screen.
   - Ensure smooth navigation from Route Details to Tracking screen.

3.3 Show user feedback and ratings related to the route.
   - Integrate functionality to display ratings and comments from users.
   - Design UI to present user reviews clearly.

3.4 Provide a share option for the route details.
   - Implement sharing functionality (using share APIs).
   - Design a button for sharing route details easily.

---

### 4. Tracking Walks
4.1 Integrate map functionality.
   - Integrate Google Maps API.
   - Set up the map view to display the user's current location.
   - Set up the map view to display the route.

4.2 Implement timer for walk duration.
   - Create a timer component.
   - Implement start and stop functions to control the timer during walks.

4.3 Implement step counter.
   - Use device sensors (or a library) to track step count.
   - Display the current step count on the Tracking screen.

4.4 Display walk details and friends' avatars on the route.
   - Design the UI to show friends on the map.
   - Integrate data fetching to retrieve friends' locations.

4.5 Add an 'End Walk' button.
   - Create the button component and style it.
   - Implement navigation to the Feedback screen upon button press.

4.6 Implement functionality for recording and creating a new walking route.
   - Design UI to allow users to save a new route.
   - Implement logic to save route data to the database.

---

### 5. Feedback System
5.1 Create the Feedback screen.
   - Design the UI layout for user ratings and comments.
   - Ensure proper validation of user inputs.

5.2 Implement functionality to select tags and upload photos.
   - Implement tag selection functionality.
   - Integrate a file picker for photo uploads.

5.3 Store feedback in Firebase.
   - Define structure for storing feedback data.
   - Implement API calls to save feedback in Firebase.

5.4 Enable submission of recorded walking routes as feedback.
   - Add options for users to submit recorded routes.
   - Integrate data storage for submitted routes.

---

### 6. Community Interaction
6.1 Implement a Community screen.
   - Design UI for displaying user posts and comments.
   - Create a component for loading and displaying posts.

6.2 Create a PostCard component.
   - Design the layout for user posts, including images and comments.
   - Implement functionality to like and comment on posts.

6.3 Implement posting functionality.
   - Create a form for users to submit new posts.
   - Connect the form to Firebase or local storage for saving posts.

---

### 7. User Profile
7.1 Design a Profile screen UI.
   - Create layout for displaying user information.
   - Ensure user-friendly design and accessibility.

7.2 Include options to view past walks and feedback.
   - Implement functionality to fetch and display past walks.
   - Create UI elements for listing feedback given by the user.

7.3 Implement user settings management.
   - Create UI components for updating user details (name, avatar).
   - Ensure data validation and successful updates.

---

## 2. Mapping Between Features and Values Delivered

| Feature                | Value Delivered                                         | Justification                                                                                   |
|------------------------|--------------------------------------------------------|------------------------------------------------------------------------------------------------|
| User Authentication     | Secure access to the app and personal data            | Builds user trust and ensures safe interactions with the app, increasing engagement.          |
| Home Screen            | Easy access to curated walking routes                  | Helps users find and select walking routes that suit their preferences, enhancing user experience. |
| Route Details Screen   | Comprehensive information about each route             | Informs users about route characteristics, encouraging them to choose a route based on their needs. |
| Tracking Screen        | Real-time tracking of walking activity                  | Provides users with location updates and walk duration, ensuring safety and motivation during walks. |
| Feedback System        | Platform for users to share experiences and suggestions | Engages users and allows for community building, improving the app's relevance and user retention.  |
| Community Interaction   | Interaction with other users' posts and feedback       | Fosters a sense of community, encouraging sharing and engagement, which can lead to increased app usage. |
| User Profile           | Personalization of the app experience                   | Allows users to manage their data, view past activities, and contribute to the community, enhancing user satisfaction. |

