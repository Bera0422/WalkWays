import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity, Button, ActivityIndicator } from 'react-native';
import { useAuth } from '../src/context/AuthContext';
import { signOut } from 'firebase/auth';
import { auth } from '../firebaseConfig';
import { fetchUserProfile, fetchUserWalkHistory } from '../src/services/firestoreService';

const UserProfile = () => {
    const { user, loading: authLoading } = useAuth(); // Access user from context
    const [profileData, setProfileData] = useState<any>(null);
    const [walkHistory, setWalkHistory] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

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
                    <Image source={{ uri: profileData.profilePhoto }} style={styles.profilePhoto} />
                    <TouchableOpacity style={styles.editIcon}>
                        <Text style={styles.editText}>Edit</Text>
                    </TouchableOpacity>
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
                            {walk.distanceWalked} miles - {walk.timeTaken} mins
                        </Text>
                        <Text style={styles.walkDate}>Completed: {new Date(walk.timestamp.seconds * 1000).toLocaleDateString()}</Text>
                    </View>
                ))}
                <Button title="View All Walk History" onPress={() => console.log('View All Walk History')} />
            </View>

            {/* Preferences Section */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Preferences</Text>
                <View style={styles.preferenceItem}>
                    <Text>Preferred Walk Type:</Text>
                    <Text style={styles.preferenceValue}>{profileData.preferredWalkType || 'N/A'}</Text>
                </View>
                <View style={styles.preferenceItem}>
                    <Text>Notifications:</Text>
                    <Text style={styles.preferenceValue}>{profileData.notificationsEnabled ? 'Enabled' : 'Disabled'}</Text>
                </View>
            </View>

            {/* Settings & Actions */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Settings</Text>
                <Button title="Edit Profile" onPress={() => console.log('Edit Profile')} />
                <Button title="Change Password" onPress={() => console.log('Change Password')} />
                <Button title="Logout" onPress={handleLogout} />
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: '#fff' },
    header: { alignItems: 'center', marginBottom: 20 },
    photoContainer: { position: 'relative' },
    profilePhoto: { width: 100, height: 100, borderRadius: 50 },
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
});

export default UserProfile;