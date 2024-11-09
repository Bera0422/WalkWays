import { db } from './firebaseConfig';
import { collection, doc, getDocs, getDoc, DocumentData, DocumentReference, query, where } from 'firebase/firestore';
import { IReview, Route } from './src/types/types';


export const fetchRoutes = async () => {
    const routesCollection = collection(db, 'routes');
    const routesSnapshot = await getDocs(routesCollection);

    const routes = await Promise.all(routesSnapshot.docs.map(async (routeDoc) => {
        const routeData = routeDoc.data();
        const tagDocIDs = routeData.tagIDs || [];
        const tagPromises = tagDocIDs.map((tagDoc: any) => getDoc(tagDoc));
        const tagDocs = await Promise.all(tagPromises);
        const tags = tagDocs.map(tagDoc => { return { id: tagDoc.id, ...tagDoc.data() } });

        const { tagIDs, ...routes } = routeData;
        return {
            id: routeDoc.id,
            ...routes,
            tags
        } as Route;

    }));

    return routes;
};

export const fetchRouteDetails = async (routeId: string) => {
    const routeReference = doc(db, 'routes', routeId);
    const routeSnapshot = await getDoc(routeReference);

    if (routeSnapshot.exists()) {
        const routeData = routeSnapshot.data();
        const tagDocIDs = routeData?.tagIDs || [];
        const tagPromises = tagDocIDs.map((tagDoc: any) => getDoc(tagDoc));
        const tagDocs = await Promise.all(tagPromises);
        const tags = tagDocs.map(tagDoc => { return { id: tagDoc.id, ...tagDoc.data() } });
        const { tagIDs, ...routes } = routeData;
        return {
            id: routeSnapshot.id,
            ...routes,
            tags
        } as Route;
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
            return {
                id: reviewDoc.id,
                ...reviews,
                tags,
                name: userData.name,
                avatar: userData.profilePhoto
            } as IReview;
        }

        return {} as IReview;
    }));

    return reviews;
};

export const fetchFilters = async () => {
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