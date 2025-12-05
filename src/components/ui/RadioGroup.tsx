import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';

interface RadioOption {
  label: string;
  value: string;
}

interface RadioGroupProps {
  options: RadioOption[];
  value?: string;
  onValueChange: (value: string) => void;
  label?: string;
}

export const RadioGroup: React.FC<RadioGroupProps> = ({
  options,
  value,
  onValueChange,
  label,
}) => {
  return (
    <View style={styles.container}>
      {label && (
        <Text
          style={[
            styles.label,
            { fontFamily: typography.fonts.lora },
          ]}
        >
          {label}
        </Text>
      )}
      <View style={styles.options}>
        {options.map((option) => (
          <TouchableOpacity
            key={option.value}
            onPress={() => onValueChange(option.value)}
            style={styles.option}
            activeOpacity={0.7}
          >
            <View
              style={[
                styles.radio,
                value === option.value && styles.radioSelected,
              ]}
            >
              {value === option.value && <View style={styles.radioInner} />}
            </View>
            <Text
              style={[
                styles.optionLabel,
                { fontFamily: typography.fonts.lora },
                value === option.value && styles.optionLabelSelected,
              ]}
            >
              {option.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.foreground,
    marginBottom: 12,
  },
  options: {
    gap: 12,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.border,
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioSelected: {
    borderColor: colors.primary,
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.primary,
  },
  optionLabel: {
    fontSize: 16,
    color: colors.foreground,
    flex: 1,
  },
  optionLabelSelected: {
    fontWeight: '600',
  },
});


