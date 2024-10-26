import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';

interface Props {
    icon: string,
    text: string,
}

const Tag: React.FC<Props> = ({ icon, text }) => (
  <View style={styles.tag}>
    <FontAwesome6 name={icon} size={14} color="#555" style={styles.icon} />
    <Text style={styles.text}>{text}</Text>
  </View>
);

const styles = StyleSheet.create({
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#eee',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    marginRight: 5,
  },
  icon: {
    marginRight: 4,
  },
  text: {
    fontSize: 12,
    color: '#333',
  },
});

export default Tag;
