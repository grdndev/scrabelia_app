import { Dimensions, Platform, PixelRatio } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Base dimensions (iPhone 14 Pro - 393x852)
const BASE_WIDTH = 393;
const BASE_HEIGHT = 852;

// Scale factor based on screen width
const scale = SCREEN_WIDTH / BASE_WIDTH;
const verticalScale = SCREEN_HEIGHT / BASE_HEIGHT;

// Moderate scale for better control
const moderateScale = (size: number, factor: number = 0.5) => {
  return size + (scale - 1) * size * factor;
};

// Responsive dimensions
export const responsive = {
  // Width scaling
  width: (size: number) => {
    return size * scale;
  },
  
  // Height scaling
  height: (size: number) => {
    return size * verticalScale;
  },
  
  // Font scaling with moderate factor
  fontSize: (size: number, factor: number = 0.3) => {
    return moderateScale(size, factor);
  },
  
  // Padding/Margin scaling
  spacing: (size: number) => {
    return moderateScale(size, 0.5);
  },
  
  // Border radius scaling
  radius: (size: number) => {
    return moderateScale(size, 0.3);
  },
  
  // Screen dimensions
  screenWidth: SCREEN_WIDTH,
  screenHeight: SCREEN_HEIGHT,
  
  // Check if device is small
  isSmallDevice: SCREEN_WIDTH < 375,
  
  // Check if device is tablet
  isTablet: SCREEN_WIDTH >= 768,
  
  // Check if device is large phone
  isLargeDevice: SCREEN_WIDTH >= 414,
  
  // Platform
  isIOS: Platform.OS === 'ios',
  isAndroid: Platform.OS === 'android',
};

// Helper to get responsive font size based on screen size
export const getResponsiveFontSize = (baseSize: number): number => {
  if (responsive.isTablet) {
    return baseSize * 1.2;
  }
  if (responsive.isSmallDevice) {
    return baseSize * 0.9;
  }
  return baseSize;
};

// Helper to get responsive padding
export const getResponsivePadding = (basePadding: number): number => {
  if (responsive.isTablet) {
    return basePadding * 1.5;
  }
  if (responsive.isSmallDevice) {
    return basePadding * 0.85;
  }
  return basePadding;
};

// Helper to get responsive margin
export const getResponsiveMargin = (baseMargin: number): number => {
  if (responsive.isTablet) {
    return baseMargin * 1.5;
  }
  if (responsive.isSmallDevice) {
    return baseMargin * 0.85;
  }
  return baseMargin;
};

