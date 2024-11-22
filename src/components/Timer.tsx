import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface TimerProps {
  seconds: number;
}

const Timer: React.FC<TimerProps> = ({seconds}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.timerText}>{`${Math.floor(seconds / 60)
        .toString()
        .padStart(2, '0')}:${(seconds % 60).toString().padStart(2, '0')}`}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  timerText: {
    fontSize: 32,
    fontWeight: 'bold',
  },
});

export default Timer;
