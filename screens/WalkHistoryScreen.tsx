import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';
import { useAuth } from '../src/context/AuthContext';
import { fetchUserWalkHistory } from '../src/services/firestoreService';
import WalkHistoryItem from '../src/components/WalkHistoryItem';


const AllRoutesScreen: React.FC = () => {
    const { user, loading: authLoading } = useAuth(); // Access user from context
    const [walkHistory, setWalkHistory] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        const fetchData = async () => {
            try {
                if (user) {
                    const [history] = await Promise.all([
                        fetchUserWalkHistory(user.uid),
                    ]);
                    setWalkHistory(history);
                }
            } catch (error) {
                console.error('Failed to fetch profile data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [user]);

    if (authLoading || loading) {
        return <ActivityIndicator size="large" color="#007BFF" style={{ flex: 1, justifyContent: 'center' }} />;
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>All Walk Histories</Text>
            <FlatList
                data={walkHistory}
                renderItem={({ item }) => (
                    <WalkHistoryItem
                        routeName={item.routeName}
                        distanceWalked={item.distanceWalked}
                        timeTaken={item.timeTaken}
                        timestamp={item.timestamp}
                    />
                )}
                keyExtractor={(item, index) => index.toString()}
                contentContainerStyle={styles.listContainer}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff', padding: 15 },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 10,
        textAlign: 'center',
    },
    listContainer: {
        paddingBottom: 20,
    },
});

export default AllRoutesScreen;
