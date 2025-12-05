import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { responsive, getResponsiveFontSize, getResponsivePadding, getResponsiveMargin } from '../../utils/responsive';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

export const Card: React.FC<CardProps> = ({ children, style }) => {
  return <View style={[styles.card, style]}>{children}</View>;
};

export const CardHeader: React.FC<CardProps> = ({ children, style }) => {
  return <View style={[styles.header, style]}>{children}</View>;
};

export const CardTitle: React.FC<CardProps> = ({ children, style }) => {
  return (
    <Text
      style={[
        styles.title,
        { fontFamily: typography.fonts.dancingScript },
        style,
      ]}
    >
      {children}
    </Text>
  );
};

export const CardDescription: React.FC<CardProps> = ({ children, style }) => {
  return (
    <Text
      style={[
        styles.description,
        { fontFamily: typography.fonts.lora },
        style,
      ]}
    >
      {children}
    </Text>
  );
};

export const CardContent: React.FC<CardProps> = ({ children, style }) => {
  return <View style={[styles.content, style]}>{children}</View>;
};

export const CardFooter: React.FC<CardProps> = ({ children, style }) => {
  return <View style={[styles.footer, style]}>{children}</View>;
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: responsive.radius(12),
    borderWidth: 1,
    borderColor: colors.border,
    marginVertical: getResponsiveMargin(8),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    paddingHorizontal: getResponsivePadding(24),
    paddingTop: getResponsivePadding(24),
    paddingBottom: 0,
  },
  title: {
    fontSize: getResponsiveFontSize(16),
    fontWeight: typography.weights.medium,
    color: colors.cardForeground,
    lineHeight: responsive.height(24),
    marginTop: getResponsiveMargin(6),
  },
  description: {
    fontSize: getResponsiveFontSize(14),
    color: colors.mutedForeground,
    lineHeight: responsive.height(21),
    marginTop: getResponsiveMargin(6),
  },
  content: {
    paddingHorizontal: getResponsivePadding(24),
    paddingTop: 0,
    paddingBottom: 0,
  },
  footer: {
    paddingHorizontal: getResponsivePadding(24),
    paddingTop: getResponsivePadding(24),
    paddingBottom: getResponsivePadding(24),
    flexDirection: 'row',
    justifyContent: 'flex-end',
    flexWrap: 'wrap',
    gap: getResponsiveMargin(8),
  },
});

