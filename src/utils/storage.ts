// src/utils/storage.ts
import AsyncStorage from '@react-native-async-storage/async-storage';

export const saveData = async (key: string, value: any) => {
    try {
        const jsonValue = JSON.stringify(value);
        await AsyncStorage.setItem(key, jsonValue);
    } catch (e) {
        console.error('Error saving data', e);
    }
};

export const getData = async (key: string) => {
    try {
        const jsonValue = await AsyncStorage.getItem(key);
        return jsonValue ? JSON.parse(jsonValue) : null;
    } catch (e) {
        console.error('Error retrieving data', e);
    }
};
