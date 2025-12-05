import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle } from 'react-native';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';

interface ToggleProps {
  pressed: boolean;
  onPress: () => void;
  children: React.ReactNode;
  variant?: 'default' | 'outline';
  size?: 'default' | 'sm' | 'lg';
  style?: ViewStyle;
}

export const Toggle: React.FC<ToggleProps> = ({
  pressed,
  onPress,
  children,
  variant = 'default',
  size = 'default',
  style,
}) => {
  const sizeStyles = {
    sm: { paddingV: 6, paddingH: 12, fontSize: 14 },
    default: { paddingV: 8, paddingH: 16, fontSize: 16 },
    lg: { paddingV: 10, paddingH: 20, fontSize: 18 },
  };

  const sizeStyle = sizeStyles[size];

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.toggle,
        {
          backgroundColor: pressed
            ? colors.accent
            : variant === 'outline'
            ? 'transparent'
            : colors.muted,
          borderWidth: variant === 'outline' ? 1 : 0,
          borderColor: pressed ? colors.accent : colors.border,
          paddingVertical: sizeStyle.paddingV,
          paddingHorizontal: sizeStyle.paddingH,
        },
        style,
      ]}
      activeOpacity={0.7}
    >
      <Text
        style={[
          styles.text,
          {
            fontSize: sizeStyle.fontSize,
            fontFamily: typography.fonts.lora,
            color: pressed ? colors.accentForeground : colors.foreground,
            fontWeight: pressed ? '600' : '500',
          },
        ]}
      >
        {children}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  toggle: {
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    textAlign: 'center',
  },
});


