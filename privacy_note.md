## Notes for Privacy/Security Measures

I've already added a [Privacy Policy](PrivacyPolicy.md) outlining how WalkWays respects user privacy. Additionally, here are the key privacy and security mechanisms implemented in the application:

**Authentication and Password Security:** The application uses Firebase Authentication for handling user sign-ins, which provides secure password storage using hashed passwords. Firebase ensures that passwords are not stored in plaintext, minimizing the risk of unauthorized access.

**Anonymous Data Handling:**  For route tracking and completed routes, I ensure that no personally identifiable information (PII) is stored. Route data, including GPS coordinates, is used temporarily during walks to create waypoints and provide directions, but this data is not stored in the database permanently, unless anonymized. When users clear their walking history, only the association between users and their route data is deleted. This allows us to retain route information for improving the app’s features while protecting user anonymity.

**Permissions and Location Data:** The app asks for explicit user consent before accessing location services. This ensures that users are aware of the data being collected and can control it. The location data is only used for route tracking and providing directions, and no long-term location storage is done. Additionally, location data is only stored temporarily for the duration of the user's session.

**Data Encryption and Secure Storage:** Firebase securely encrypts all data in transit using SSL encryption by default. This ensures that any data exchanged between the app and Firebase servers is protected from interception. Additionally, I implemented security rules for Firebase Firestore to ensure that users can only access their own data (e.g., names, route history, feedback). This access control minimizes the risk of unauthorized data access.

**Media Uploads:** Uploaded photos and media are stored securely in Firebase Storage. The app does not store any private images beyond the user’s own profile and feedback.

**Data Minimization:** The app collects only the necessary data to provide its core functionality, such as route details, feedback, and user authentication. Any collected data, such as user names and emails, is stored securely, and Firebase provides automatic security measures for these data types.

**User Data Control:** Users can delete their walking history at any time, ensuring they have control over the data associated with their activity. The system only retains anonymized data after such deletions, so personal details are never tied back to their walking history.

