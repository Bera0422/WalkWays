import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth } from '../../firebaseConfig';
import { createUserProfile } from './firestoreService';
import { Timestamp } from 'firebase/firestore';

export const signUp = async (name: string, email: string, password: string) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    try {
      const userData = {
        completedRoutes: [],
        createdAt: Timestamp.now(),
        email: email,
        favorites: [],
        lastLogin: Timestamp.now(),
        name: name,
        preferences: {
          language: "en",
          notificationSettings: {
            email: true,
            push: true,
          },
          theme: "light"
        },
        profilePhoto: "avatars/mbD9wmGK0fqGH62vxrxV/1.jpg",
      }
      await createUserProfile(userCredential.user.uid, userData);
      console.log('user saved:', userData);
    } catch (error) {
      console.error('error saving user:', error);
    }
    return userCredential.user;
  } catch (error: any) {
    throw error.message;
  }
};

export const logIn = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error: any) {
    throw error.message;
  }
};

export const logOut = async () => {
  try {
    await signOut(auth);
  } catch (error: any) {
    throw error.message;
  }
};

export const listenToAuthState = (callback: any) => {
  onAuthStateChanged(auth, (user) => {
    callback(user);
  });
};
