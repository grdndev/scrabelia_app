import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useScribela } from '../contexts/ScribelaContext';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Avatar } from '../components/ui/Avatar';
import { Badge } from '../components/ui/Badge';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { toast } from '../utils/toast';
import * as api from '../utils/supabase/api';
import { responsive, getResponsiveFontSize, getResponsivePadding, getResponsiveMargin } from '../utils/responsive';

interface Resonance {
  userId: string;
  commonEchoes: number;
  lastCommonTextId: string;
}

export const ResonancesScreen: React.FC = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { currentUser, texts } = useScribela();
  const [resonances, setResonances] = useState<Resonance[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadResonances();
  }, [currentUser]);

  const loadResonances = async () => {
    if (!currentUser) return;
    setLoading(true);
    try {
      const result = await api.getResonances(currentUser);
      setResonances(result.resonances || []);
    } catch (error) {
      console.error('Erreur lors du chargement des résonances:', error);
      toast.error('Erreur lors du chargement');
    } finally {
      setLoading(false);
    }
  };

  const getAuthorName = (userId: string) => {
    // Essayer de trouver le nom d'auteur depuis les textes
    const authorText = texts.find((text) => text.author.name === userId);
    return authorText?.author.name || userId;
  };

  const renderResonance = ({ item }: { item: Resonance }) => {
    const authorName = getAuthorName(item.userId);

    return (
      <TouchableOpacity
        onPress={() => {
          (navigation as any).navigate('AuthorCarnet', {
            authorName,
          });
        }}
        activeOpacity={0.7}
      >
        <Card>
          <CardHeader>
            <View style={styles.resonanceHeader}>
              <Avatar name={authorName} size={48} />
              <View style={styles.resonanceInfo}>
                <CardTitle>{authorName}</CardTitle>
                <Badge variant="default" style={styles.badge}>
                  {item.commonEchoes} écho{item.commonEchoes > 1 ? 's' : ''} en commun
                </Badge>
              </View>
            </View>
          </CardHeader>
        </Card>
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text
          style={[
            styles.headerTitle,
            { fontFamily: typography.fonts.dancingScript },
          ]}
        >
          Résonances
        </Text>
        <Text
          style={[
            styles.headerSubtitle,
            { fontFamily: typography.fonts.lora },
          ]}
        >
          Auteurs avec qui vous partagez des goûts
        </Text>
      </View>

      <FlatList
        data={resonances}
        keyExtractor={(item) => item.userId}
        renderItem={renderResonance}
        contentContainerStyle={[
          styles.list,
          { paddingBottom: responsive.height(80) }, // Space for tab bar
        ]}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={loadResonances}
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
              Aucune résonance pour le moment
            </Text>
            <Text
              style={[
                styles.emptySubtext,
                { fontFamily: typography.fonts.lora },
              ]}
            >
              Écho des textes pour découvrir des auteurs similaires
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
  resonanceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: getResponsiveMargin(16),
  },
  resonanceInfo: {
    flex: 1,
  },
  badge: {
    marginTop: getResponsiveMargin(8),
    alignSelf: 'flex-start',
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
    marginBottom: getResponsiveMargin(8),
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: getResponsiveFontSize(14),
    color: colors.mutedForeground,
    textAlign: 'center',
  },
});

