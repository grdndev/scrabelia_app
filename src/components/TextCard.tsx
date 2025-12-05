import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Card, CardHeader, CardTitle, CardContent } from './ui/Card';
import { Avatar } from './ui/Avatar';
import { Badge } from './ui/Badge';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { getRelativeTime } from '../utils/relativeTime';

interface TextCardProps {
  text: {
    id: string;
    author: { name: string; avatar: string };
    title: string;
    content: string;
    category: string;
    date: string;
    publishedAt: Date;
    subscribersOnly?: boolean;
    hasAudioRecording?: boolean;
    isEchoed?: boolean;
    isSaved?: boolean;
  };
  onPress?: () => void;
  onAuthorPress?: () => void;
  showFullContent?: boolean;
}

export const TextCard: React.FC<TextCardProps> = ({
  text,
  onPress,
  onAuthorPress,
  showFullContent = false,
}) => {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
      <Card>
        <CardHeader>
          <TouchableOpacity
            onPress={onAuthorPress}
            style={styles.authorRow}
            activeOpacity={0.7}
          >
            <Avatar name={text.author.name} avatar={text.author.avatar} size={32} />
            <View style={styles.authorInfo}>
              <Text
                style={[
                  styles.authorName,
                  { fontFamily: typography.fonts.lora },
                ]}
              >
                {text.author.name}
              </Text>
              <Text
                style={[
                  styles.date,
                  { fontFamily: typography.fonts.lora },
                ]}
              >
                {getRelativeTime(text.publishedAt)}
              </Text>
            </View>
          </TouchableOpacity>
          <CardTitle>{text.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <Text
            style={[
              styles.content,
              { fontFamily: typography.fonts.lora },
            ]}
            numberOfLines={showFullContent ? undefined : 3}
          >
            {text.content}
          </Text>
          <View style={styles.footerRow}>
            <Badge variant="outline">{text.category}</Badge>
            {text.subscribersOnly && (
              <Badge variant="secondary" style={styles.badge}>
                Abonnés
              </Badge>
            )}
            {text.hasAudioRecording && (
              <Badge variant="default" style={styles.badge}>
                Audio
              </Badge>
            )}
          </View>
        </CardContent>
      </Card>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  authorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6, // gap-1.5
  },
  authorInfo: {
    marginLeft: 12,
    flex: 1,
  },
  authorName: {
    fontSize: 14,
    fontWeight: typography.weights.semibold,
    color: colors.foreground,
    lineHeight: 21,
  },
  date: {
    fontSize: 12,
    color: colors.mutedForeground,
    marginTop: 4,
    lineHeight: 18,
  },
  content: {
    fontSize: 16, // text-base
    color: colors.foreground,
    lineHeight: 24, // line-height: 1.5
    marginTop: 6, // gap-1.5
    marginBottom: 0,
    fontWeight: typography.weights.normal,
  },
  footerRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 16, // gap-4
    gap: 8,
  },
  badge: {
    marginRight: 8,
  },
});

