import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useAuth } from '../src/context/AuthContext';
import { deleteWalkingHistory, fetchUserWalkHistory } from '../src/services/firestoreService';
import WalkHistoryItem from '../src/components/WalkHistoryItem';


const AllRoutesScreen: React.FC = () => {
    const { user, loading: authLoading } = useAuth(); // Access user from context
    const [walkHistory, setWalkHistory] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

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

    useEffect(() => {


        fetchData();
    }, [user]);

    const handleDeleteHistory = () => {
        Alert.alert(
            "Delete History",
            "Are you sure you want to delete your walking history?",
            [
                {
                    text: "Cancel",
                    onPress: () => console.log("Cancel Pressed"),
                    style: "cancel"
                },
                {
                    text: "Delete",
                    onPress: async () => {
                        if (user) {
                            await deleteWalkingHistory(user.uid);
                        }
                        Alert.alert("Success", "Your walking history has been deleted.");
                        fetchData();
                    }
                }
            ],
            { cancelable: false }
        );
    };

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
            <TouchableOpacity style={styles.deleteButton} onPress={handleDeleteHistory}>
                <Text style={styles.deleteButtonText}>Delete Walking History</Text>
            </TouchableOpacity>
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
    deleteButton: {
        backgroundColor: '#FF3B30',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 15,
    },
    deleteButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default AllRoutesScreen;