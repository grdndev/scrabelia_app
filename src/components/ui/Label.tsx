import React from 'react';
import { Text, StyleSheet, TextStyle } from 'react-native';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';

interface LabelProps {
  children: React.ReactNode;
  style?: TextStyle;
  required?: boolean;
}

export const Label: React.FC<LabelProps> = ({
  children,
  style,
  required = false,
}) => {
  return (
    <Text
      style={[
        styles.label,
        { fontFamily: typography.fonts.lora },
        style,
      ]}
    >
      {children}
      {required && <Text style={styles.required}> *</Text>}
    </Text>
  );
};

const styles = StyleSheet.create({
  label: {
    fontSize: 16, // text-base
    fontWeight: typography.weights.medium,
    color: colors.foreground,
    marginBottom: 8,
    lineHeight: 24, // line-height: 1.5
  },
  required: {
    color: colors.destructive,
  },
});

