import React from 'react';
import { TextInput, StyleSheet, TextInputProps, View, Text } from 'react-native';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { responsive, getResponsiveFontSize, getResponsivePadding, getResponsiveMargin } from '../../utils/responsive';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  containerStyle?: any;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  containerStyle,
  style,
  ...props
}) => {
  return (
    <View style={[styles.container, containerStyle]}>
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
      <TextInput
        style={[
          styles.input,
          error ? styles.inputError : null,
          { fontFamily: typography.fonts.lora },
          style,
        ]}
        placeholderTextColor={colors.mutedForeground}
        {...props}
      />
      {error && (
        <Text
          style={[
            styles.errorText,
            { fontFamily: typography.fonts.lora },
          ]}
        >
          {error}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: getResponsiveMargin(8),
  },
  label: {
    fontSize: getResponsiveFontSize(14),
    fontWeight: typography.weights.medium,
    color: colors.mutedForeground,
    marginBottom: getResponsiveMargin(8),
    lineHeight: responsive.height(21),
  },
  input: {
    height: responsive.height(36),
    minHeight: responsive.isSmallDevice ? 40 : responsive.height(36),
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: responsive.radius(6),
    paddingHorizontal: getResponsivePadding(12),
    paddingVertical: getResponsivePadding(4),
    fontSize: getResponsiveFontSize(16),
    backgroundColor: colors.inputBackground,
    color: colors.foreground,
    lineHeight: responsive.height(24),
  },
  inputError: {
    borderColor: colors.destructive,
  },
  errorText: {
    color: colors.destructive,
    fontSize: getResponsiveFontSize(12),
    marginTop: getResponsiveMargin(4),
  },
});

