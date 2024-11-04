import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface TimerProps {
  initialTime: number;
  isActive: boolean;
  onComplete: () => void;
}

const Timer: React.FC<TimerProps> = ({ initialTime, isActive, onComplete }) => {
  const [seconds, setSeconds] = useState(initialTime);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isActive) {
      interval = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      if (interval) {
        clearInterval(interval);
      }
      if (seconds > 0) {
        onComplete(); // Call onComplete if the timer stops after some time
      }
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isActive, seconds, onComplete]);

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
