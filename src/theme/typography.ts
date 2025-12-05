import { Platform } from 'react-native';

export const typography = {
  fonts: {
    dancingScript: Platform.select({
      ios: 'Dancing Script',
      android: 'DancingScript-Regular',
    }) || 'serif',
    lora: Platform.select({
      ios: 'Lora',
      android: 'Lora-Regular',
    }) || 'serif',
    inter: Platform.select({
      ios: 'Inter',
      android: 'Inter-Regular',
    }) || 'sans-serif',
    georgia: Platform.select({
      ios: 'Georgia',
      android: 'serif',
    }) || 'serif',
  },
  sizes: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 28,
    '4xl': 48,
  },
  weights: {
    normal: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
  },
} as const;

