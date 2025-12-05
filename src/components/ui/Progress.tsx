import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { colors } from '../../theme/colors';

interface ProgressProps {
  value: number; // 0-100
  style?: ViewStyle;
}

export const Progress: React.FC<ProgressProps> = ({ value, style }) => {
  const clampedValue = Math.min(Math.max(value, 0), 100);

  return (
    <View style={[styles.container, style]}>
      <View
        style={[
          styles.progress,
          {
            width: `${clampedValue}%`,
          },
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 8,
    backgroundColor: colors.muted,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progress: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 4,
  },
});


