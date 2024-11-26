import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity, Button, ActivityIndicator } from 'react-native';
import { useAuth } from '../src/context/AuthContext';
import { signOut } from 'firebase/auth';
import { auth } from '../firebaseConfig';
import { fetchUserProfile, fetchUserWalkHistory } from '../src/services/firestoreService';
import { Switch } from 'react-native-gesture-handler';
import { Avatar } from 'react-native-paper';
import { convertDistance } from 'geolib';
import { ProfileScreenNavigationProp } from '../src/types/props';

interface Props {
    navigation: ProfileScreenNavigationProp;
}

const ProfileScreen: React.FC<Props> = ({ navigation }) => {
    const { user, loading: authLoading } = useAuth(); // Access user from context
    const [profileData, setProfileData] = useState<any>(null);
    const [walkHistory, setWalkHistory] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isEnabled, setIsEnabled] = useState(false);
    const toggleSwitch = (value: boolean) => {
        console.log("Notifications Enabled: ", value);
        setIsEnabled(previousState => !previousState)
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (user) {
                    const [profile, history] = await Promise.all([
                        fetchUserProfile(user.uid),
                        fetchUserWalkHistory(user.uid)
                    ]);
                    setProfileData(profile);
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

    const handleLogout = async () => {
        console.log('Logout');
        try {
            await signOut(auth);
            console.log("User signed out");
        } catch (error) {
            console.error("Error signing out: ", error);
        }
    }

    if (authLoading || loading) {
        return <ActivityIndicator size="large" color="#007BFF" style={{ flex: 1, justifyContent: 'center' }} />;
    }

    if (!user || !profileData) {
        return (
            <View style={styles.container}>
                <Text>No user data available. Please log in.</Text>
            </View>
        );
    }

    return (
        <ScrollView style={styles.container}>
            {/* Header Section */}
            <View style={styles.header}>
                <View style={styles.photoContainer}>
                    <Avatar.Text style={styles.avatar} size={95} label={profileData.name.charAt(0).toUpperCase()} />
                    {/* <TouchableOpacity style={styles.editIcon}>
                        <Text style={styles.editText}>Edit</Text>
                    </TouchableOpacity> */}
                </View>
                <Text style={styles.name}>{profileData.name}</Text>
                <Text style={styles.email}>{profileData.email}</Text>
                <Text style={styles.createdAt}>Joined: {new Date(profileData.createdAt?.seconds * 1000).toLocaleDateString()}</Text>

            </View>

            {/* Walk History Section */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Walk History</Text>
                {walkHistory.map((walk, index) => (
                    <View key={index} style={styles.walkHistoryItem}>
                        <Text style={styles.walkHistoryText}>{walk.routeName}</Text>
                        <Text style={styles.walkDetails}>
                            {convertDistance(walk.distanceWalked, 'mi').toFixed(1)} miles - {`${Math.floor(walk.timeTaken / 60).toString()}`} mins
                        </Text>
                        <Text style={styles.walkDate}>Completed: {new Date(walk.timestamp.seconds * 1000).toLocaleDateString()}</Text>
                    </View>
                ))}
                {/* <Button title="View All Walk History" onPress={() => console.log('View All Walk History')} /> */}
            </View>

            {/* Preferences Section */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Preferences</Text>
                <View style={styles.preferenceItem}>
                    <Text>Notifications:</Text>
                    <Switch
                        trackColor={{ true: '#6A2766' }}
                        onValueChange={toggleSwitch}
                        value={isEnabled}
                    />
                </View>
            </View>

            {/* Settings & Actions */}
            <View style={styles.section}>
                {/* <Text style={styles.sectionTitle}>Settings</Text> */}
                {/* <Button title="Edit Profile" onPress={() => console.log('Edit Profile')} /> */}
                <Button title="Change Password" onPress={() => navigation.navigate("PasswordReset")} />
                <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                    <Text style={styles.logoutButtonText}>Logout</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: '#fff' },
    header: { alignItems: 'center', marginBottom: 20 },
    photoContainer: { position: 'relative' },
    profilePhoto: { width: 100, height: 100, borderRadius: 50 },
    avatar: { backgroundColor: '#6200ea' },
    editIcon: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: '#007BFF',
        padding: 5,
        borderRadius: 10,
    },
    editText: { color: '#fff', fontSize: 12 },
    name: { fontSize: 24, fontWeight: 'bold', marginVertical: 5 },
    email: { fontSize: 16, color: '#555' },
    createdAt: { fontSize: 12, color: '#aaa' },
    section: { marginBottom: 20 },
    sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
    walkHistoryItem: { marginBottom: 15, padding: 10, backgroundColor: '#f9f9f9', borderRadius: 5 },
    walkHistoryText: { fontSize: 16, fontWeight: 'bold' },
    walkDetails: { fontSize: 14, color: '#555' },
    walkDate: { fontSize: 12, color: '#888' },
    preferenceItem: { flexDirection: 'row', justifyContent: 'space-between', marginVertical: 5 },
    preferenceValue: { fontWeight: 'bold', color: '#333' },
    // Button container style
    logoutButton: {
        backgroundColor: '#6200ea', // Purple background
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        marginVertical: 10,
        width: '50%',
        alignSelf: 'center'

    },
    logoutButtonText: {
        color: '#fff', // White text color
        fontSize: 16,
        fontWeight: 'bold',
    },

});

export default ProfileScreen;
