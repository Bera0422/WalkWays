import { Timestamp } from 'firebase/firestore';
import { convertDistance } from 'geolib';
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface Props {
    routeName: string, 
    distanceWalked: number,
    timeTaken: number,
    timestamp: Timestamp,
}

const WalkHistoryItem: React.FC<Props> = ({ routeName, distanceWalked, timeTaken, timestamp }) => {

    const formatDate = (seconds: number) => new Date(seconds * 1000).toLocaleDateString();

    return (
        <View style={styles.container}>
            <Text style={styles.routeName}>{routeName}</Text>
            <Text style={styles.details}>
                {convertDistance(distanceWalked, 'mi').toFixed(1)} miles - {Math.floor(timeTaken / 60)} mins
            </Text>
            <Text style={styles.timestamp}>Completed: {formatDate(timestamp.seconds)}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#f9f9f9',
        borderRadius: 8,
        padding: 10,
        marginBottom: 10,
        elevation: 2,
    },
    routeName: { fontSize: 16, fontWeight: 'bold', color: '#333' },
    details: { fontSize: 14, color: '#555', marginVertical: 5 },
    timestamp: { fontSize: 12, color: '#888' },
});

export default WalkHistoryItem;
