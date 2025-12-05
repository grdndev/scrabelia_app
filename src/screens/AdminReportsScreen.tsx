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
import { useScribela } from '../contexts/ScribelaContext';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { AlertDialog } from '../components/ui/AlertDialog';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { toast } from '../utils/toast';
import * as api from '../utils/supabase/api';
import { responsive, getResponsiveFontSize, getResponsivePadding, getResponsiveMargin } from '../utils/responsive';

interface Report {
  id: string;
  textId: string;
  reason: string;
  reportedBy: string;
  createdAt: number;
  text?: any;
}

export const AdminReportsScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const { accessToken } = useScribela();
  const [reports, setReports] = useState<Report[]>([]);
  const [deleteReportId, setDeleteReportId] = useState<string | null>(null);
  const [deleteTextId, setDeleteTextId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    if (!accessToken) return;
    setLoading(true);
    try {
      const result = await api.getReports(accessToken);
      setReports(result.reports || []);
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Erreur lors du chargement');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteReport = async () => {
    if (!accessToken || !deleteReportId) return;
    try {
      await api.deleteReport(deleteReportId, accessToken);
      toast.success('Signalement supprimé');
      setDeleteReportId(null);
      await loadReports();
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Erreur lors de la suppression');
    }
  };

  const handleDeleteText = async () => {
    if (!accessToken || !deleteTextId) return;
    try {
      await api.deleteReportedText(deleteTextId, accessToken);
      toast.success('Texte supprimé');
      setDeleteTextId(null);
      await loadReports();
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Erreur lors de la suppression');
    }
  };

  const renderReport = ({ item }: { item: Report }) => (
    <Card>
      <CardHeader>
        <View style={styles.reportHeader}>
          <View>
            <CardTitle>Signalement #{item.id.slice(-6)}</CardTitle>
            <Badge variant="destructive" style={styles.badge}>
              {item.reason}
            </Badge>
          </View>
          <Text
            style={[
              styles.date,
              { fontFamily: typography.fonts.lora },
            ]}
          >
            Par {item.reportedBy}
          </Text>
        </View>
      </CardHeader>
      {item.text && (
        <CardContent>
          <Text
            style={[
              styles.textTitle,
              { fontFamily: typography.fonts.dancingScript },
            ]}
          >
            {item.text.title}
          </Text>
          <Text
            style={[
              styles.textContent,
              { fontFamily: typography.fonts.lora },
            ]}
            numberOfLines={3}
          >
            {item.text.content}
          </Text>
          <View style={styles.actions}>
            <Button
              variant="destructive"
              size="sm"
              onPress={() => setDeleteTextId(item.textId)}
            >
              Supprimer le texte
            </Button>
            <Button
              variant="outline"
              size="sm"
              onPress={() => setDeleteReportId(item.id)}
            >
              Ignorer le signalement
            </Button>
          </View>
        </CardContent>
      )}
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
          Signalements
        </Text>
        <Badge variant="destructive">
          {reports.length} signalement{reports.length > 1 ? 's' : ''}
        </Badge>
      </View>

      <FlatList
        data={reports}
        keyExtractor={(item) => item.id}
        renderItem={renderReport}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={loadReports}
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
              Aucun signalement pour le moment
            </Text>
          </View>
        }
      />

      <AlertDialog
        open={deleteReportId !== null}
        onOpenChange={(open) => !open && setDeleteReportId(null)}
        title="Ignorer le signalement"
        description="Êtes-vous sûr de vouloir ignorer ce signalement ?"
        actionLabel="Ignorer"
        cancelLabel="Annuler"
        onAction={handleDeleteReport}
      />

      <AlertDialog
        open={deleteTextId !== null}
        onOpenChange={(open) => !open && setDeleteTextId(null)}
        title="Supprimer le texte"
        description="Êtes-vous sûr de vouloir supprimer ce texte signalé ? Cette action est irréversible."
        actionLabel="Supprimer"
        cancelLabel="Annuler"
        onAction={handleDeleteText}
        variant="destructive"
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
    fontFamily: typography.fonts.dancingScript,
  },
  list: {
    padding: getResponsivePadding(16),
  },
  reportHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    flexWrap: 'wrap',
    gap: getResponsiveMargin(8),
  },
  badge: {
    marginTop: getResponsiveMargin(8),
    alignSelf: 'flex-start',
  },
  date: {
    fontSize: getResponsiveFontSize(12),
    color: colors.mutedForeground,
  },
  textTitle: {
    fontSize: getResponsiveFontSize(18),
    fontWeight: typography.weights.medium,
    color: colors.foreground,
    marginBottom: getResponsiveMargin(8),
    lineHeight: responsive.height(27),
  },
  textContent: {
    fontSize: getResponsiveFontSize(14),
    color: colors.mutedForeground,
    marginBottom: getResponsiveMargin(12),
    lineHeight: responsive.height(21),
  },
  actions: {
    flexDirection: 'row',
    gap: getResponsiveMargin(8),
    marginTop: getResponsiveMargin(8),
    flexWrap: 'wrap',
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

