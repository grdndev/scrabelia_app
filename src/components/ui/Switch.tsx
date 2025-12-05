import React from 'react';
import { Switch as RNSwitch, StyleSheet, View, Text } from 'react-native';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';

interface SwitchProps {
  value: boolean;
  onValueChange: (value: boolean) => void;
  label?: string;
  disabled?: boolean;
}

export const Switch: React.FC<SwitchProps> = ({
  value,
  onValueChange,
  label,
  disabled = false,
}) => {
  return (
    <View style={styles.container}>
      {label && (
        <Text
          style={[
            styles.label,
            { fontFamily: typography.fonts.lora },
            disabled && styles.labelDisabled,
          ]}
        >
          {label}
        </Text>
      )}
      <RNSwitch
        value={value}
        onValueChange={onValueChange}
        disabled={disabled}
        trackColor={{
          false: colors.muted,
          true: '#A8B5A2', // switch-background selon globals.css
        }}
        thumbColor={value ? colors.card : colors.card}
        ios_backgroundColor={colors.muted}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 8,
  },
  label: {
    fontSize: 16, // text-base
    color: colors.foreground,
    flex: 1,
    marginRight: 12,
    lineHeight: 24,
    fontWeight: typography.weights.normal,
  },
  labelDisabled: {
    opacity: 0.5,
  },
});

