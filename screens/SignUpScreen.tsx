import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet, Alert } from 'react-native';
import { signUp } from '../src/services/authService';
import { SignUpScreenNavigationProp } from '../src/types/props';

interface Props {
    navigation: SignUpScreenNavigationProp;
}

const SignUpScreen: React.FC<Props> = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleSignUp = async () => {
        if (password !== confirmPassword) {
            Alert.alert("Passwords do not match!");
            return;
        }
        try {
            await signUp(email, password);
            Alert.alert("Account created! Please log in.");
            navigation.navigate("Login");
        } catch (error: any) {
            Alert.alert("Sign Up Failed", error);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Sign Up</Text>
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
            <Button title="Sign Up" onPress={handleSignUp} />
            <Text onPress={() => navigation.navigate("Login")} style={styles.switchText}>
                Already have an account? Log In
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', padding: 20 },
    title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
    input: { borderWidth: 1, padding: 10, marginVertical: 10, borderRadius: 5 },
    switchText: { textAlign: 'center', marginTop: 10, color: 'blue' },
});

export default SignUpScreen;
