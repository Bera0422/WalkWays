// import React, { useState } from 'react';
// import { View, TextInput, Button, Text, StyleSheet, Alert, TouchableOpacity, Keyboard, TouchableWithoutFeedback } from 'react-native';
// import { signUp } from '../src/services/authService';
// import { SignUpScreenNavigationProp } from '../src/types/props';

// interface Props {
//     navigation: SignUpScreenNavigationProp;
// }

// const SignUpScreen: React.FC<Props> = ({ navigation }) => {
//     const [email, setEmail] = useState('');
//     const [password, setPassword] = useState('');
//     const [confirmPassword, setConfirmPassword] = useState('');

//     const handleSignUp = async () => {
//         if (password !== confirmPassword) {
//             Alert.alert("Passwords do not match!");
//             return;
//         }
//         try {
//             await signUp(email, password);
//             Alert.alert("Account created! Please log in.");
//             navigation.navigate("Login");
//         } catch (error: any) {
//             Alert.alert("Sign Up Failed", error);
//         }
//     };

//     return (
//         <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>

//         <View style={styles.container}>
//             <Text style={styles.title}>Sign Up</Text>
//             <TextInput
//                 placeholder="Email"
//                 style={styles.input}
//                 value={email}
//                 onChangeText={setEmail}
//             />
//             <TextInput
//                 placeholder="Password"
//                 style={styles.input}
//                 secureTextEntry
//                 value={password}
//                 onChangeText={setPassword}
//             />
//             <TextInput
//                 placeholder="Confirm Password"
//                 style={styles.input}
//                 secureTextEntry
//                 value={confirmPassword}
//                 onChangeText={setConfirmPassword}
//             />
//             <TouchableOpacity style={styles.signupButton} onPress={handleSignUp}>
//                 <Text style={styles.signupButtonText}>Sign Up</Text>
//             </TouchableOpacity>
//             <Text onPress={() => navigation.navigate("Login")} style={styles.switchText}>
//                 Already have an account? Log In
//             </Text>
//         </View>
//         </TouchableWithoutFeedback>
//     );
// };

// const styles = StyleSheet.create({
//     container: { flex: 1, justifyContent: 'center', padding: 20 },
//     title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
//     input: { borderWidth: 1, padding: 10, marginVertical: 10, borderRadius: 5 },
//     switchText: { textAlign: 'center', marginTop: 10, color: 'blue' },
//     signupButton: {
//         backgroundColor: '#2196f3', // Blue background for signup
//         paddingVertical: 12,
//         paddingHorizontal: 20,
//         borderRadius: 8,
//         alignItems: 'center',
//         justifyContent: 'center',
//         shadowColor: '#000',
//         shadowOffset: { width: 0, height: 2 },
//         shadowOpacity: 0.2,
//         shadowRadius: 4,
//         marginVertical: 10,
//         width: '50%',
//         alignSelf: 'center',
//     },
//     signupButtonText: {
//         color: '#fff',
//         fontSize: 16,
//         fontWeight: 'bold',
//     },
// });

// export default SignUpScreen;

import React, { useState } from 'react';
import {
    View,
    TextInput,
    Button,
    Text,
    StyleSheet,
    Alert,
    TouchableOpacity,
    Keyboard,
    TouchableWithoutFeedback,
} from 'react-native';
import { signUp } from '../src/services/authService';
import { createUserProfile } from '../src/services/firestoreService'; // Firestore helper
import { SignUpScreenNavigationProp } from '../src/types/props';
import { updateProfile } from 'firebase/auth';

interface Props {
    navigation: SignUpScreenNavigationProp;
}

const SignUpScreen: React.FC<Props> = ({ navigation }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleSignUp = async () => {
        if (!name.trim()) {
            Alert.alert("Name is required!");
            return;
        }

        if (password !== confirmPassword) {
            Alert.alert("Passwords do not match!");
            return;
        }

        try {
            // Call Firebase Auth to create the user
            const user = await signUp(name, email, password);

            if (user) {
                // Update Auth user's display name
                await updateProfile(user, {displayName: name});

                Alert.alert("Account created! Please log in.");
                navigation.navigate("Login");
            }
        } catch (error: any) {
            Alert.alert("Sign Up Failed", error.message || "An error occurred.");
        }
    };

    return (
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
            <View style={styles.container}>
                <Text style={styles.title}>Sign Up</Text>
                <TextInput
                    placeholder="Name"
                    style={styles.input}
                    value={name}
                    onChangeText={setName}
                />
                <TextInput
                    placeholder="Email"
                    style={styles.input}
                    value={email}
                    onChangeText={setEmail}
                />
                <TextInput
                    placeholder="Password"
                    style={styles.input}
                    secureTextEntry
                    value={password}
                    onChangeText={setPassword}
                />
                <TextInput
                    placeholder="Confirm Password"
                    style={styles.input}
                    secureTextEntry
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                />
                <TouchableOpacity style={styles.signupButton} onPress={handleSignUp}>
                    <Text style={styles.signupButtonText}>Sign Up</Text>
                </TouchableOpacity>
                <Text
                    onPress={() => navigation.navigate("Login")}
                    style={styles.switchText}
                >
                    Already have an account? Log In
                </Text>
            </View>
        </TouchableWithoutFeedback>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', padding: 20, backgroundColor: '#f9f9f9' },
    title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
    input: { borderWidth: 1, padding: 10, marginVertical: 10, borderRadius: 5, backgroundColor: '#fff' },
    switchText: { textAlign: 'center', marginTop: 10, color: 'blue' },
    signupButton: {
        backgroundColor: '#2196f3',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 10,
        width: '50%',
        alignSelf: 'center',
    },
    signupButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});

export default SignUpScreen;
