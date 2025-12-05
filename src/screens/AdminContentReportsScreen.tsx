import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
} from 'react-native';
import { useScribela } from '../contexts/ScribelaContext';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { AlertDialog } from '../components/ui/AlertDialog';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { toast } from '../utils/toast';
import * as api from '../utils/supabase/api';

interface ContentReport {
  id: string;
  contentType: 'comment' | 'circle_message' | 'duo_message';
  contentId: string;
  reason: string;
  reportedBy: string;
  createdAt: number;
  content?: any;
}

export const AdminContentReportsScreen: React.FC = () => {
  const { accessToken } = useScribela();
  const [reports, setReports] = useState<ContentReport[]>([]);
  const [deleteReportId, setDeleteReportId] = useState<string | null>(null);
  const [deleteContentData, setDeleteContentData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    if (!accessToken) return;
    setLoading(true);
    try {
      const result = await api.getContentReports(accessToken);
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
      await api.deleteContentReport(deleteReportId, accessToken);
      toast.success('Signalement supprimé');
      setDeleteReportId(null);
      await loadReports();
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Erreur lors de la suppression');
    }
  };

  const handleDeleteContent = async () => {
    if (!accessToken || !deleteContentData) return;
    try {
      await api.deleteReportedContent(deleteContentData, accessToken);
      toast.success('Contenu supprimé');
      setDeleteContentData(null);
      await loadReports();
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Erreur lors de la suppression');
    }
  };

  const getContentTypeLabel = (type: string) => {
    switch (type) {
      case 'comment':
        return 'Commentaire';
      case 'circle_message':
        return 'Message de cercle';
      case 'duo_message':
        return 'Message de duo';
      default:
        return type;
    }
  };

  const renderReport = ({ item }: { item: ContentReport }) => (
    <Card>
      <CardHeader>
        <View style={styles.reportHeader}>
          <View>
            <CardTitle>Signalement #{item.id.slice(-6)}</CardTitle>
            <Badge variant="destructive" style={styles.badge}>
              {item.reason}
            </Badge>
            <Badge variant="outline" style={styles.typeBadge}>
              {getContentTypeLabel(item.contentType)}
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
      {item.content && (
        <CardContent>
          <Text
            style={[
              styles.contentText,
              { fontFamily: typography.fonts.lora },
            ]}
          >
            {item.content.content || item.content.message || 'Contenu non disponible'}
          </Text>
          <View style={styles.actions}>
            <Button
              variant="destructive"
              size="sm"
              onPress={() =>
                setDeleteContentData({
                  contentType: item.contentType,
                  contentId: item.contentId,
                  textId: item.content.textId,
                  circleId: item.content.circleId,
                  duoName: item.content.duoName,
                })
              }
            >
              Supprimer le contenu
            </Button>
            <Button
              variant="outline"
              size="sm"
              onPress={() => setDeleteReportId(item.id)}
            >
              Ignorer
            </Button>
          </View>
        </CardContent>
      )}
    </Card>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text
          style={[
            styles.headerTitle,
            { fontFamily: typography.fonts.dancingScript },
          ]}
        >
          Signalements de contenu
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
        open={deleteContentData !== null}
        onOpenChange={(open) => !open && setDeleteContentData(null)}
        title="Supprimer le contenu"
        description="Êtes-vous sûr de vouloir supprimer ce contenu signalé ? Cette action est irréversible."
        actionLabel="Supprimer"
        cancelLabel="Annuler"
        onAction={handleDeleteContent}
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
    padding: 16,
    backgroundColor: colors.card,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTitle: {
    fontSize: 28, // text-3xl approximatif
    fontWeight: typography.weights.medium,
    color: colors.foreground,
    fontFamily: typography.fonts.dancingScript,
  },
  list: {
    padding: 16,
  },
  reportHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  badge: {
    marginTop: 8,
    marginRight: 8,
    alignSelf: 'flex-start',
  },
  typeBadge: {
    marginTop: 8,
    alignSelf: 'flex-start',
  },
  date: {
    fontSize: 12,
    color: colors.mutedForeground,
  },
  contentText: {
    fontSize: 16, // text-base
    color: colors.foreground,
    marginBottom: 12, // mb-3
    lineHeight: 24, // line-height: 1.5
    fontWeight: typography.weights.normal,
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
  },
  emptyContainer: {
    paddingVertical: 60,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: colors.mutedForeground,
  },
});

