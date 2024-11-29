import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity, Button, ActivityIndicator } from 'react-native';
import { useAuth } from '../src/context/AuthContext';
import { signOut } from 'firebase/auth';
import { auth } from '../firebaseConfig';
import { fetchUserProfile, fetchUserWalkHistory } from '../src/services/firestoreService';
import { Switch } from 'react-native-gesture-handler';
import { Avatar, Icon } from 'react-native-paper';
import { convertDistance } from 'geolib';
import { ProfileScreenNavigationProp } from '../src/types/props';
import WalkHistoryItem from '../src/components/WalkHistoryItem';

const WALK_HISTORY_LIMIT = 3;

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
                        fetchUserWalkHistory(user.uid, WALK_HISTORY_LIMIT),
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
            {/* Hero Section */}
            <View style={styles.heroSection}>
                <Avatar.Text
                    style={styles.avatar}
                    size={100}
                    label={profileData.name.charAt(0).toUpperCase()}
                />
                <Text style={styles.name}>{profileData.name}</Text>
                <Text style={styles.email}>{profileData.email}</Text>
                <Text style={styles.createdAt}>Joined: {new Date(profileData.createdAt?.seconds * 1000).toLocaleDateString()}</Text>
            </View>

            {/* Walk History Section */}
            <View style={styles.card}>
                <Text style={styles.cardTitle}>Walk History</Text>
                {walkHistory.map((walk, index) => (
                    <WalkHistoryItem
                    key={index}
                    routeName={walk.routeName}
                    distanceWalked={walk.distanceWalked}
                    timeTaken={walk.timeTaken}
                    timestamp={walk.timestamp}
                />
                ))}
                <TouchableOpacity
                    style={styles.seeAllButton}
                onPress={() => navigation.navigate('WalkHistory')}
                >
                    <Text style={styles.seeAllText}>See All Walk History</Text>
                </TouchableOpacity>
            </View>

            {/* Preferences Section */}
            <View style={styles.card}>
                <Text style={styles.cardTitle}>Preferences</Text>
                <View style={styles.preferenceItem}>
                    <Text>Notifications</Text>
                    <Switch
                        trackColor={{ true: '#6200ea' }}
                        onValueChange={toggleSwitch}
                        value={isEnabled}
                    />
                </View>
            </View>

            {/* Actions Section */}
            <View style={styles.card}>
                <TouchableOpacity style={styles.actionItem} onPress={() => navigation.navigate('PasswordReset')}>
                    <Icon source="lock" size={24} color="#6200ea" />
                    <Text style={styles.actionText}>Change Password</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionItem} onPress={handleLogout}>
                    <Icon source="logout" size={24} color="red" />
                    <Text style={styles.logoutText}>Logout</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f5f5f5' },
    heroSection: {
        backgroundColor: '#6200ea',
        paddingVertical: 30,
        alignItems: 'center',
    },
    avatar: { backgroundColor: '#fff' },
    name: { fontSize: 22, fontWeight: 'bold', color: '#fff', marginTop: 10 },
    email: { fontSize: 14, color: '#ddd' },
    createdAt: { fontSize: 12, color: '#ddd', marginTop: 10 },
    card: {
        backgroundColor: '#fff',
        marginHorizontal: 15,
        marginVertical: 10,
        borderRadius: 10,
        padding: 15,
        elevation: 3,
    },
    cardTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
    seeAllButton: {
        marginTop: 10,
        padding: 10,
        backgroundColor: '#6200ea',
        borderRadius: 8,
        alignItems: 'center',
    },
    seeAllText: { color: '#fff', fontWeight: 'bold' },
    preferenceItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginVertical: 5,
    },
    actionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    actionText: { marginLeft: 10, fontSize: 16, color: '#6200ea' },
    logoutText: { marginLeft: 10, fontSize: 16, color: 'red' },
});

export default ProfileScreen;
