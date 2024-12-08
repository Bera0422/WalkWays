import React from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Props {
  placeholder: string;
  value: string; // to control the input value
  onChangeText: (text: string) => void; // callback to handle input change
}

const SearchBar: React.FC<Props> = ({ placeholder, value, onChangeText }) => {
  const textInputRef = React.useRef<TextInput>(null);

  const focusSearchInput = () => {
    textInputRef.current?.focus();
  };

  return (
    <TouchableOpacity style={styles.searchContainer} onPress={focusSearchInput}>
      <Ionicons name="search" size={20} color="gray" style={styles.icon} />
      <TextInput
        ref={textInputRef}
        style={styles.searchBar}
        placeholder={placeholder}
        placeholderTextColor="#B8B8B8"
        value={value}
        onChangeText={onChangeText} // Call the parent function on text change
        multiline={false}
        numberOfLines={1}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  searchBar: {
    marginVertical: 1,
    padding: 10,
    borderColor: '#ddd',
    borderRadius: 8,
    fontSize: 18,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F3FE', // Adjust to fit your color scheme
    borderRadius: 25, // Rounds the edges
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  icon: {
    marginRight: 8,
    color: '#B8B8B8',
  },
});

export default SearchBar;
