import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet, Alert } from 'react-native';
import { logIn } from '../src/services/authService';
import { LoginScreenNavigationProp } from '../src/types/props';

interface Props {
    navigation: LoginScreenNavigationProp;
}

const LoginScreen: React.FC<Props> = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogIn = async () => {
        try {
            await logIn(email, password);
            Alert.alert("Logged in successfully!");
            navigation.navigate("Profile");
        } catch (error: any) {
            Alert.alert("Login Failed", error);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Log In</Text>
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
            <Button title="Log In" onPress={handleLogIn} />
            <Text onPress={() => navigation.navigate("SignUp")} style={styles.switchText}>
                Don't have an account? Sign Up
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

export default LoginScreen;
