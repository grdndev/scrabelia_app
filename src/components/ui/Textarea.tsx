import React from 'react';
import { TextInput, StyleSheet, TextInputProps, View, Text } from 'react-native';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';

interface TextareaProps extends TextInputProps {
  label?: string;
  error?: string;
  containerStyle?: any;
}

export const Textarea: React.FC<TextareaProps> = ({
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
          styles.textarea,
          error ? styles.inputError : null,
          { fontFamily: typography.fonts.lora },
          style,
        ]}
        placeholderTextColor={colors.mutedForeground}
        multiline
        textAlignVertical="top"
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
    marginVertical: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: typography.weights.medium,
    color: colors.mutedForeground,
    marginBottom: 8,
    lineHeight: 21,
  },
  textarea: {
    minHeight: 100,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 6, // rounded-md
    paddingHorizontal: 12, // px-3
    paddingVertical: 4, // py-1
    fontSize: 16, // text-base
    backgroundColor: colors.inputBackground,
    color: colors.foreground,
    lineHeight: 24,
    fontFamily: typography.fonts.lora,
  },
  inputError: {
    borderColor: colors.destructive,
  },
  errorText: {
    color: colors.destructive,
    fontSize: 12,
    marginTop: 4,
  },
});

