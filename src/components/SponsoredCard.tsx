import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Linking } from 'react-native';
import { Card, CardHeader, CardContent } from './ui/Card';
import { Button } from './ui/Button';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';

interface SponsoredCardProps {
  sponsorship: {
    id: string;
    brand: string;
    category: string;
    title: string;
    description: string;
    imageUrl: string;
    ctaText: string;
    ctaUrl: string;
  };
}

export const SponsoredCard: React.FC<SponsoredCardProps> = ({ sponsorship }) => {
  const handlePress = async () => {
    if (sponsorship.ctaUrl) {
      const supported = await Linking.canOpenURL(sponsorship.ctaUrl);
      if (supported) {
        await Linking.openURL(sponsorship.ctaUrl);
      }
    }
  };

  return (
    <Card style={styles.card}>
      <CardHeader>
        <View style={styles.badgeContainer}>
          <Text
            style={[
              styles.sponsoredLabel,
              { fontFamily: typography.fonts.lora },
            ]}
          >
            Sponsorisé • {sponsorship.brand}
          </Text>
        </View>
      </CardHeader>
      <CardContent>
        {sponsorship.imageUrl && (
          <Image
            source={{ uri: sponsorship.imageUrl }}
            style={styles.image}
            resizeMode="cover"
          />
        )}
        <Text
          style={[
            styles.title,
            { fontFamily: typography.fonts.dancingScript },
          ]}
        >
          {sponsorship.title}
        </Text>
        <Text
          style={[
            styles.description,
            { fontFamily: typography.fonts.lora },
          ]}
        >
          {sponsorship.description}
        </Text>
        <Button
          onPress={handlePress}
          variant="outline"
          style={styles.ctaButton}
        >
          {sponsorship.ctaText || 'En savoir plus'}
        </Button>
      </CardContent>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    borderWidth: 2,
    borderColor: colors.accent,
  },
  badgeContainer: {
    marginBottom: 12,
  },
  sponsoredLabel: {
    fontSize: 12,
    color: colors.accent,
    fontWeight: typography.weights.semibold,
    lineHeight: 18,
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 16,
    backgroundColor: colors.muted,
  },
  title: {
    fontSize: 20, // text-xl
    fontWeight: typography.weights.medium,
    color: colors.foreground,
    marginBottom: 8, // mb-2
    lineHeight: 30, // line-height: 1.5
  },
  description: {
    fontSize: 16, // text-base
    color: colors.foreground,
    lineHeight: 24, // line-height: 1.5
    marginBottom: 16, // mb-4
    fontWeight: typography.weights.normal,
  },
  ctaButton: {
    alignSelf: 'flex-start',
  },
});

