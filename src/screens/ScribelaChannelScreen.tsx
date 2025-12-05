import React, { useState, useEffect } from 'react';
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
import { useScribela } from '../contexts/ScribelaContext';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { toast } from '../utils/toast';
import * as api from '../utils/supabase/api';
import { responsive, getResponsiveFontSize, getResponsivePadding, getResponsiveMargin } from '../utils/responsive';

interface Announcement {
  id: string;
  date: string;
  message: string;
  circles?: Array<{
    id: string;
    name: string;
    description: string;
    memberCount: number;
  }>;
  createdAt: number;
}

export const ScribelaChannelScreen: React.FC = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { customCircles, addCircle } = useScribela();
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadAnnouncements();
  }, []);

  const loadAnnouncements = async () => {
    setLoading(true);
    try {
      const result = await api.getAnnouncements();
      setAnnouncements(result.announcements || []);
    } catch (error) {
      console.error('Erreur lors du chargement:', error);
      toast.error('Erreur lors du chargement');
    } finally {
      setLoading(false);
    }
  };

  const handleJoinCircle = async (circle: any) => {
    try {
      await addCircle({
        name: circle.name,
        description: circle.description,
      });
      toast.success(`Vous avez rejoint ${circle.name} !`);
    } catch (error) {
      console.error('Erreur lors de l\'adhésion:', error);
      toast.error('Erreur lors de l\'adhésion');
    }
  };

  const renderAnnouncement = ({ item }: { item: Announcement }) => (
    <Card>
      <CardHeader>
        <View style={styles.announcementHeader}>
          <Badge variant="secondary">Canal Officiel</Badge>
          <Text
            style={[
              styles.date,
              { fontFamily: typography.fonts.lora },
            ]}
          >
            {item.date}
          </Text>
        </View>
      </CardHeader>
      <CardContent>
        <Text
          style={[
            styles.message,
            { fontFamily: typography.fonts.lora },
          ]}
        >
          {item.message}
        </Text>
        {item.circles && item.circles.length > 0 && (
          <View style={styles.circlesSection}>
            <Text
              style={[
                styles.circlesTitle,
                { fontFamily: typography.fonts.lora },
              ]}
            >
              Cercles du moment :
            </Text>
            {item.circles.map((circle) => (
              <TouchableOpacity
                key={circle.id}
                onPress={() => handleJoinCircle(circle)}
                style={styles.circleCard}
                activeOpacity={0.7}
              >
                <View style={styles.circleInfo}>
                  <Text
                    style={[
                      styles.circleName,
                      { fontFamily: typography.fonts.lora },
                    ]}
                  >
                    {circle.name}
                  </Text>
                  <Text
                    style={[
                      styles.circleDescription,
                      { fontFamily: typography.fonts.lora },
                    ]}
                  >
                    {circle.description}
                  </Text>
                  <Badge variant="outline" style={styles.memberBadge}>
                    {circle.memberCount} membre{circle.memberCount > 1 ? 's' : ''}
                  </Badge>
                </View>
                <Text style={styles.joinButton}>+</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </CardContent>
    </Card>
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text
          style={[
            styles.headerTitle,
            { fontFamily: typography.fonts.dancingScript },
          ]}
        >
          Canal Officiel Scribela
        </Text>
        <Text
          style={[
            styles.headerSubtitle,
            { fontFamily: typography.fonts.lora },
          ]}
        >
          Annonces et actualités
        </Text>
      </View>

      <FlatList
        data={announcements}
        keyExtractor={(item) => item.id}
        renderItem={renderAnnouncement}
        contentContainerStyle={[
          styles.list,
          { paddingBottom: responsive.height(80) }, // Space for tab bar
        ]}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={loadAnnouncements}
            tintColor={colors.primary}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text
              style={[
                styles.emptyText,
                { fontFamily: typography.fonts.lora },
              ]}
            >
              Aucune annonce pour le moment
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
  header: {
    paddingHorizontal: getResponsivePadding(16),
    paddingVertical: getResponsivePadding(12),
    backgroundColor: colors.card,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTitle: {
    fontSize: getResponsiveFontSize(28),
    fontWeight: typography.weights.medium,
    color: colors.foreground,
    marginBottom: getResponsiveMargin(4),
    fontFamily: typography.fonts.dancingScript,
    lineHeight: responsive.height(42),
  },
  headerSubtitle: {
    fontSize: getResponsiveFontSize(14),
    color: colors.mutedForeground,
  },
  list: {
    padding: getResponsivePadding(16),
  },
  announcementHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: getResponsiveMargin(8),
    flexWrap: 'wrap',
    gap: getResponsiveMargin(8),
  },
  date: {
    fontSize: getResponsiveFontSize(12),
    color: colors.mutedForeground,
  },
  message: {
    fontSize: getResponsiveFontSize(16),
    color: colors.foreground,
    lineHeight: responsive.height(24),
    marginBottom: getResponsiveMargin(16),
    fontWeight: typography.weights.normal,
  },
  circlesSection: {
    marginTop: getResponsiveMargin(16),
  },
  circlesTitle: {
    fontSize: getResponsiveFontSize(16),
    fontWeight: typography.weights.semibold,
    color: colors.foreground,
    marginBottom: getResponsiveMargin(12),
    lineHeight: responsive.height(24),
  },
  circleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: getResponsivePadding(12),
    backgroundColor: colors.inputBackground,
    borderRadius: responsive.radius(6),
    marginBottom: getResponsiveMargin(8),
    borderWidth: 1,
    borderColor: colors.border,
  },
  circleInfo: {
    flex: 1,
    minWidth: responsive.isSmallDevice ? '70%' : undefined,
  },
  circleName: {
    fontSize: getResponsiveFontSize(16),
    fontWeight: typography.weights.semibold,
    color: colors.foreground,
    marginBottom: getResponsiveMargin(4),
    lineHeight: responsive.height(24),
  },
  circleDescription: {
    fontSize: getResponsiveFontSize(14),
    color: colors.mutedForeground,
    marginBottom: getResponsiveMargin(8),
    lineHeight: responsive.height(21),
  },
  memberBadge: {
    alignSelf: 'flex-start',
  },
  joinButton: {
    fontSize: getResponsiveFontSize(24),
    color: colors.primary,
    fontWeight: 'bold',
    paddingHorizontal: getResponsivePadding(12),
  },
  emptyContainer: {
    paddingVertical: responsive.height(60),
    paddingHorizontal: getResponsivePadding(16),
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: responsive.screenHeight * 0.4,
  },
  emptyText: {
    fontSize: getResponsiveFontSize(16),
    color: colors.mutedForeground,
    textAlign: 'center',
  },
});

