import { collection, doc, getDocs, getDoc, query, where, addDoc, updateDoc } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';
import 'react-native-get-random-values';
import { db, storage } from '../../firebaseConfig';
import { IReview, Route } from '../types/types';

export const fetchRoutes = async () => {
    const routesCollection = collection(db, 'routes');
    const routesSnapshot = await getDocs(routesCollection);

    const routes = await Promise.all(routesSnapshot.docs.map(async (routeDoc) => {
        const routeData = routeDoc.data();
        const tagDocIDs = routeData.tagIDs || [];
        const tagPromises = tagDocIDs.map((tagDoc: any) => getDoc(tagDoc));
        const tagDocs = await Promise.all(tagPromises);
        const tags = tagDocs.map(tagDoc => { return { id: tagDoc.id, ...tagDoc.data() } });
        const imageUrl = routeData.details.images[0] ? await getDownloadURL(ref(storage, routeData.details.images[0])) : '';
        const { tagIDs, ...route } = routeData;

        return {
            id: routeDoc.id,
            ...route,
            tags,
            image: imageUrl,
        } as Route;
    }));

    return routes;
};

export const fetchRouteDetails = async (routeId: string) => {
    try {
        const routeReference = doc(db, 'routes', routeId);
        const routeSnapshot = await getDoc(routeReference);

        if (routeSnapshot.exists()) {
            const routeData = routeSnapshot.data();
            const tagDocIDs = routeData?.tagIDs || [];
            const tagPromises = tagDocIDs.map((tagDoc: any) => getDoc(tagDoc));
            const tagDocs = await Promise.all(tagPromises);
            const tags = tagDocs.map(tagDoc => { return { id: tagDoc.id, ...tagDoc.data() } });

            const imageUrls = routeData.details.images ? await Promise.all(
                routeData.details.images.map((imageRef: string) => getDownloadURL(ref(storage, imageRef)))) : [];

            const { tagIDs, ...route } = routeData;
            return {
                id: routeSnapshot.id,
                ...route,
                tags,
                details: {
                    ...route.details,
                    images: imageUrls,
                }
            } as Route;
        }
    } catch (error) {
        console.error("Error fetching route details:", error);
    }
    throw new Error("Route not found!");
};

export const fetchRouteReviews = async (routeId: string) => {
    const reviewsRef = collection(db, 'reviews');
    const q = query(reviewsRef, where("routeId", "==", doc(db, 'routes', routeId)));

    const querySnapshot = await getDocs(q);
    const reviews = await Promise.all(querySnapshot.docs.map(async (reviewDoc) => {
        const reviewData = reviewDoc.data();
        const tagDocIDs = reviewData?.tags || [];
        const tagPromises = tagDocIDs.map((tagDoc: any) => getDoc(tagDoc));
        const tagDocs = await Promise.all(tagPromises);
        const tags = tagDocs.map(tagDoc => { return { id: tagDoc.id, ...tagDoc.data() } });
        const { tagIDs, ...reviews } = reviewData;

        const userRef = reviewData.userId;
        const userSnapshot = await getDoc(userRef);

        if (userSnapshot.exists()) {
            const userData: any = userSnapshot.data();
            const avatarUrl = userData.profilePhoto ? await getDownloadURL(ref(storage, userData.profilePhoto)) : '';
            return {
                id: reviewDoc.id,
                ...reviews,
                tags,
                name: userData.name,
                avatar: avatarUrl
            } as IReview;
        }

        return {} as IReview;
    }));

    return reviews;
};

export const fetchTags = async () => {
    const tagsCollection = collection(db, 'tags');
    const tagsSnapshot = await getDocs(tagsCollection);

    const tags = await Promise.all(tagsSnapshot.docs.map(async (tagDoc) => {
        const tagData = tagDoc.data();
        return {
            id: tagDoc.id,
            ...tagData
        }
    }));

    return tags;
};

export const saveReview = async (reviewData: any) => {
    const routeRef = doc(db, 'routes', reviewData.routeId);
    const review = {
        ...reviewData,
        userId: doc(db, 'users', 'mbD9wmGK0fqGH62vxrxV'),
        routeId: routeRef,
        tags: reviewData.tags.map((tagId: string) => doc(db, 'tags', tagId))
    }
    try {
        const docRef = await addDoc(collection(db, 'reviews'), review);

        const routeSnap = await getDoc(routeRef);
        if (routeSnap.exists()) {
            const routeData = routeSnap.data();
            const reviewCount = routeData.reviewCount || 0;
            const updatedRating = (routeData.rating * reviewCount + reviewData.rating) / (reviewCount + 1);
            await updateDoc(routeRef, { rating: updatedRating, reviewCount: reviewCount + 1 })

            console.log("Review saved with ID:", docRef.id);
            return docRef.id;
        }
    } catch (error) {
        console.error("Error saving review:", error);
    }
}

export const saveCommunityPost = async (data: any) => {
    const post = {
        userId: doc(db, 'users', 'mbD9wmGK0fqGH62vxrxV'),
        tags: data.tags.map((tagId: string) => doc(db, 'tags', tagId)),
        images: [data.media],
        text: data.text,
        timestamp: data.timestamp
    }
    try {
        const docRef = await addDoc(collection(db, 'communityPosts'), post);
        console.log("Community Post saved with ID:", docRef.id);
        return docRef.id;
    } catch (error) {
        console.error("Error saving community post:", error);
    }
}

export const fetchCommunityPosts = async () => {
    const postsRef = collection(db, 'communityPosts');
    const postsSnapshot = await getDocs(postsRef);

    const posts = await Promise.all(postsSnapshot.docs.map(async (postDoc) => {
        const postData = postDoc.data();
        const tagDocIDs = postData?.tags || [];
        const tagPromises = tagDocIDs.map((tagDoc: any) => getDoc(tagDoc));
        const tagDocs = await Promise.all(tagPromises);
        const tags = tagDocs.map(tagDoc => { return { id: tagDoc.id, ...tagDoc.data() } });
        const { tagIDs, ...posts } = postData;
        const imageUrl = postData.images[0] ? await getDownloadURL(ref(storage, postData.images[0])) : '';

        const userRef = postData.userId;
        const userSnapshot = await getDoc(userRef);

        if (userSnapshot.exists()) {
            const userData: any = userSnapshot.data();
            const avatarUrl = userData.profilePhoto ? await getDownloadURL(ref(storage, userData.profilePhoto)) : '';
            return {
                id: postDoc.id,
                ...posts,
                tags,
                name: userData.name,
                avatar: avatarUrl,
                postImage: imageUrl,
                date: postData.timestamp.toDate().toLocaleDateString(),
            };
        }

        return {};
    }));

    return posts;
};

export const uploadImage = async (uri: string, folderName: string = 'images') => {
    // Generate a unique filename
    const filename = `${folderName}/${uuidv4()}.jpg`;
    const storageRef = ref(storage, filename);

    // Fetch the image URI as a blob
    const response = await fetch(uri);
    const blob = await response.blob();

    console.log("uploading image");
    return new Promise((resolve, reject) => {
        const uploadTask = uploadBytesResumable(storageRef, blob);

        uploadTask.on(
            'state_changed',
            (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                console.log('Upload is ' + progress + '% done');
            },
            (error) => {
                console.error("Upload error:", error);
                reject(error);
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL: string) => {
                    console.log('File available at', downloadURL);
                    resolve(downloadURL);
                }).catch(reject);
            }
        );
    });
};

export const saveCompletedRoute = async (routeData: any) => {
    try {
        const docRef = await addDoc(collection(db, 'completedRoutes'), routeData);
        console.log("completed route saved with ID:", docRef.id);
        return docRef.id;
    } catch (error) {
        console.error("error saving completed route:", error);
    }
}

export const updateUsersCompletedRoutes = async (routeId: string, userId: string = "mbD9wmGK0fqGH62vxrxV") => {
    try {
        const routeRef = doc(db, 'completedRoutes', routeId)

        const userRef = doc(db, 'users', userId);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
            const userData = userSnap.data();
            const completedRoutes = userData.completedRoutes;
            await updateDoc(userRef, { completedRoutes: {...completedRoutes, routeRef }});
            console.log("User updated with route ID:", routeRef.id);
            return userRef.id
        }
        return null;
    } catch (error) {
        console.error("error saving completed route:", error);
    }
}

