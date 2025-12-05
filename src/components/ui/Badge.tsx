import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';

type BadgeVariant = 'default' | 'secondary' | 'destructive' | 'outline';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  style?: ViewStyle;
}

const badgeStyles: Record<BadgeVariant, { bg: string; text: string; border?: string }> = {
  default: { bg: colors.primary, text: colors.primaryForeground },
  secondary: { bg: colors.secondary, text: colors.secondaryForeground },
  destructive: { bg: colors.destructive, text: colors.destructiveForeground },
  outline: { bg: 'transparent', text: colors.foreground, border: colors.border },
};

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  style,
}) => {
  const variantStyle = badgeStyles[variant];

  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: variantStyle.bg,
          borderWidth: variant === 'outline' ? 1 : 0,
          borderColor: variantStyle.border,
        },
        style,
      ]}
    >
      <Text
        style={[
          styles.text,
          {
            color: variantStyle.text,
            fontFamily: typography.fonts.lora,
          },
        ]}
      >
        {children}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6, // rounded-md
    alignSelf: 'flex-start',
  },
  text: {
    fontSize: 12,
    fontWeight: typography.weights.medium,
    lineHeight: 18,
  },
});

