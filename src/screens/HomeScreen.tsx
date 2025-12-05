import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useScribela } from '../contexts/ScribelaContext';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Avatar } from '../components/ui/Avatar';
import { Badge } from '../components/ui/Badge';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { getRelativeTime } from '../utils/relativeTime';
import { RootStackParamList } from '../navigation/AppNavigator';
import { responsive, getResponsiveFontSize, getResponsivePadding, getResponsiveMargin } from '../utils/responsive';

type NavigationProp = StackNavigationProp<RootStackParamList>;

export const HomeScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const insets = useSafeAreaInsets();
  const { texts, isLoading, reloadGardenComments } = useScribela();

  const handleTextPress = (text: any) => {
    navigation.navigate('Garden', {
      textId: text.id,
      textTitle: text.title,
      textContent: text.content,
      textAuthor: text.author,
    });
  };

  const renderText = ({ item }: { item: any }) => (
    <TouchableOpacity onPress={() => handleTextPress(item)}>
      <Card>
        <CardHeader>
          <View style={styles.authorRow}>
            <Avatar name={item.author.name} avatar={item.author.avatar} size={32} />
            <View style={styles.authorInfo}>
              <Text
                style={[
                  styles.authorName,
                  { fontFamily: typography.fonts.lora },
                ]}
              >
                {item.author.name}
              </Text>
              <Text
                style={[
                  styles.date,
                  { fontFamily: typography.fonts.lora },
                ]}
              >
                {getRelativeTime(item.publishedAt)}
              </Text>
            </View>
          </View>
          <CardTitle>{item.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <Text
            style={[
              styles.content,
              { fontFamily: typography.fonts.lora },
            ]}
            numberOfLines={3}
          >
            {item.content}
          </Text>
          <View style={styles.footerRow}>
            <Badge variant="outline">{item.category}</Badge>
            {item.subscribersOnly && (
              <Badge variant="secondary" style={styles.badge}>
                Abonnés
              </Badge>
            )}
            {item.hasAudioRecording && (
              <Badge variant="default" style={styles.badge}>
                Audio
              </Badge>
            )}
          </View>
        </CardContent>
      </Card>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <FlatList
        data={texts}
        keyExtractor={(item) => item.id}
        renderItem={renderText}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={reloadGardenComments}
            tintColor={colors.primary}
            colors={[colors.primary]}
          />
        }
        contentContainerStyle={[
          styles.list,
          { paddingBottom: responsive.height(80) }, // Space for tab bar
        ]}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text
              style={[
                styles.emptyText,
                { fontFamily: typography.fonts.lora },
              ]}
            >
              Aucun texte pour le moment
            </Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  list: {
    padding: getResponsivePadding(16),
    gap: getResponsiveMargin(8),
  },
  authorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: getResponsiveMargin(6),
  },
  authorInfo: {
    marginLeft: getResponsiveMargin(12),
    flex: 1,
  },
  authorName: {
    fontSize: getResponsiveFontSize(14),
    fontWeight: typography.weights.semibold,
    color: colors.foreground,
    lineHeight: responsive.height(21),
  },
  date: {
    fontSize: getResponsiveFontSize(12),
    color: colors.mutedForeground,
    marginTop: getResponsiveMargin(4),
    lineHeight: responsive.height(18),
  },
  content: {
    fontSize: getResponsiveFontSize(16),
    color: colors.foreground,
    lineHeight: responsive.height(24),
    marginTop: getResponsiveMargin(6),
    marginBottom: 0,
    fontWeight: typography.weights.normal,
  },
  footerRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: getResponsiveMargin(16),
    gap: getResponsiveMargin(8),
  },
  badge: {
    marginRight: getResponsiveMargin(8),
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: responsive.height(60),
    paddingHorizontal: getResponsivePadding(16),
    minHeight: responsive.screenHeight * 0.4,
  },
  emptyText: {
    fontSize: getResponsiveFontSize(16),
    color: colors.mutedForeground,
    textAlign: 'center',
  },
});
