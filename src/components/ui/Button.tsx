import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
} from 'react-native';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { responsive, getResponsiveFontSize } from '../../utils/responsive';

type ButtonVariant = 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost';
type ButtonSize = 'default' | 'sm' | 'lg' | 'icon';

interface ButtonProps {
  children: React.ReactNode;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
}

const buttonStyles: Record<
  ButtonVariant,
  { bg: string; text: string; border?: string }
> = {
  default: { bg: colors.primary, text: colors.primaryForeground },
  destructive: {
    bg: colors.destructive,
    text: colors.destructiveForeground,
  },
  outline: { bg: 'transparent', text: colors.primary, border: colors.primary },
  secondary: { bg: colors.secondary, text: colors.secondaryForeground },
  ghost: { bg: 'transparent', text: colors.primary },
};

const getSizeStyles = (size: ButtonSize) => {
  const baseStyles = {
    sm: { height: 32, paddingH: 12, fontSize: 14, borderRadius: 6 },
    default: { height: 36, paddingH: 16, fontSize: 16, borderRadius: 6 },
    lg: { height: 40, paddingH: 24, fontSize: 18, borderRadius: 6 },
    icon: { height: 36, paddingH: 0, fontSize: 16, borderRadius: 6 },
  };
  
  const base = baseStyles[size];
  return {
    height: responsive.height(base.height),
    paddingH: responsive.width(base.paddingH),
    fontSize: getResponsiveFontSize(base.fontSize),
    borderRadius: responsive.radius(base.borderRadius),
  };
};

export const Button: React.FC<ButtonProps> = ({
  children,
  onPress,
  variant = 'default',
  size = 'default',
  disabled = false,
  loading = false,
  style,
}) => {
  const variantStyle = buttonStyles[variant];
  const sizeStyle = getSizeStyles(size);

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      style={[
        styles.button,
        {
          backgroundColor: variantStyle.bg,
          borderWidth: variant === 'outline' ? 1 : 0,
          borderColor: variantStyle.border,
          opacity: disabled ? 0.5 : 1,
          height: sizeStyle.height,
          paddingHorizontal: sizeStyle.paddingH,
          borderRadius: sizeStyle.borderRadius,
          minWidth: size === 'icon' ? sizeStyle.height : undefined,
        },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={variantStyle.text} />
      ) : (
        <Text
          style={[
            styles.text,
            {
              color: variantStyle.text,
              fontSize: sizeStyle.fontSize,
              fontFamily: typography.fonts.lora,
              fontWeight: typography.weights.medium,
            },
          ]}
        >
          {children}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  text: {
    lineHeight: 24,
  },
});

