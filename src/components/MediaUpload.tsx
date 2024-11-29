import React, { useState } from 'react';
import { View, Image, TouchableOpacity, Text, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

interface MediaUploadProps {
  onSelectMedia: (uri: string) => void;
}

const MediaUpload: React.FC<MediaUploadProps> = ({ onSelectMedia }) => {
  const [mediaUri, setMediaUri] = useState<string | null>(null);

  const selectImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      alert("Permission to access the gallery is required!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
      base64: true,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const selectedUri = result.assets[0].uri;
      setMediaUri(selectedUri);
      onSelectMedia(selectedUri);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={selectImage}>
        <Text style={styles.buttonText}>Select Photo</Text>
      </TouchableOpacity>
      {mediaUri && <Image source={{ uri: mediaUri }} style={styles.previewImage} />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: 10,
  },
  button: {
    backgroundColor: '#6A1B9A',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
  },
  previewImage: {
    width: 300,
    height: 300,
    marginTop: 10,
    borderRadius: 8,
  },
});

export default MediaUpload;
