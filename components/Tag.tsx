import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';

interface Props {
    icon: string,
    text: string,
}

const Tag: React.FC<Props> = ({ icon, text }) => (
  <View style={styles.tag}>
    <FontAwesome6 name={icon} size={14} style={styles.icon} />
    <Text style={styles.text}>{text}</Text>
  </View>
);

const styles = StyleSheet.create({
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#DCB7D9',
    borderRadius: 6,
    marginRight: 5,
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  icon: {
    marginRight: 4,
    color: '#000'
  },
  text: {
    fontSize: 12,
    color: '#101010',
    fontWeight: '500'
  },
});

export default Tag;
