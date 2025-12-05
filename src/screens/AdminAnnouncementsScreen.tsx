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
import { useScribela } from '../contexts/ScribelaContext';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Dialog } from '../components/ui/Dialog';
import { Input } from '../components/ui/Input';
import { Textarea } from '../components/ui/Textarea';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { toast } from '../utils/toast';
import * as api from '../utils/supabase/api';
import { responsive, getResponsiveFontSize, getResponsivePadding, getResponsiveMargin } from '../utils/responsive';

interface Announcement {
  id: string;
  date: string;
  message: string;
  circles?: any[];
  createdAt: number;
}

export const AdminAnnouncementsScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const { accessToken } = useScribela();
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState<Announcement | null>(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadAnnouncements();
  }, []);

  const loadAnnouncements = async () => {
    if (!accessToken) return;
    setLoading(true);
    try {
      const result = await api.getAnnouncements();
      setAnnouncements(result.announcements || []);
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Erreur lors du chargement');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!accessToken || !message.trim()) return;

    setLoading(true);
    try {
      if (editingAnnouncement) {
        await api.saveAnnouncement(
          { ...editingAnnouncement, message },
          accessToken
        );
        toast.success('Annonce mise à jour');
      } else {
        await api.saveAnnouncement(
          {
            id: `announcement_${Date.now()}`,
            date: 'Aujourd\'hui',
            message: message.trim(),
            createdAt: Date.now(),
          },
          accessToken
        );
        toast.success('Annonce créée');
      }
      setCreateDialogOpen(false);
      setEditingAnnouncement(null);
      setMessage('');
      await loadAnnouncements();
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Erreur lors de la sauvegarde');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!accessToken) return;
    try {
      await api.deleteAnnouncement(id, accessToken);
      toast.success('Annonce supprimée');
      await loadAnnouncements();
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Erreur lors de la suppression');
    }
  };

  const renderAnnouncement = ({ item }: { item: Announcement }) => (
    <Card>
      <CardHeader>
        <View style={styles.announcementHeader}>
          <CardTitle>{item.date}</CardTitle>
          <View style={styles.actions}>
            <Button
              variant="outline"
              size="sm"
              onPress={() => {
                setEditingAnnouncement(item);
                setMessage(item.message);
                setCreateDialogOpen(true);
              }}
            >
              Modifier
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onPress={() => handleDelete(item.id)}
            >
              Supprimer
            </Button>
          </View>
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
          Gestion des annonces
        </Text>
        <Button
          onPress={() => {
            setEditingAnnouncement(null);
            setMessage('');
            setCreateDialogOpen(true);
          }}
          size="sm"
        >
          + Nouvelle annonce
        </Button>
      </View>

      <FlatList
        data={announcements}
        keyExtractor={(item) => item.id}
        renderItem={renderAnnouncement}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={loadAnnouncements}
            tintColor={colors.primary}
          />
        }
      />

      <Dialog
        open={createDialogOpen}
        onOpenChange={(open) => {
          setCreateDialogOpen(open);
          if (!open) {
            setEditingAnnouncement(null);
            setMessage('');
          }
        }}
        title={editingAnnouncement ? 'Modifier l\'annonce' : 'Nouvelle annonce'}
        footer={
          <View style={styles.dialogFooter}>
            <Button
              variant="outline"
              onPress={() => setCreateDialogOpen(false)}
            >
              Annuler
            </Button>
            <Button
              onPress={handleSave}
              loading={loading}
              disabled={!message.trim()}
            >
              {editingAnnouncement ? 'Modifier' : 'Créer'}
            </Button>
          </View>
        }
      >
        <Textarea
          label="Message"
          value={message}
          onChangeText={setMessage}
          placeholder="Contenu de l'annonce..."
          style={styles.textarea}
        />
      </Dialog>
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
    flexWrap: 'wrap',
    gap: getResponsiveMargin(8),
  },
  headerTitle: {
    fontSize: getResponsiveFontSize(28),
    fontWeight: typography.weights.medium,
    color: colors.foreground,
    fontFamily: typography.fonts.dancingScript,
    flex: responsive.isSmallDevice ? 1 : undefined,
  },
  list: {
    padding: getResponsivePadding(16),
  },
  announcementHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    flexWrap: 'wrap',
    gap: getResponsiveMargin(8),
  },
  actions: {
    flexDirection: 'row',
    gap: getResponsiveMargin(8),
    flexWrap: 'wrap',
  },
  message: {
    fontSize: getResponsiveFontSize(16),
    color: colors.foreground,
    lineHeight: responsive.height(24),
    fontWeight: typography.weights.normal,
  },
  dialogFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: getResponsiveMargin(12),
    marginTop: getResponsiveMargin(16),
    flexWrap: 'wrap',
  },
  textarea: {
    minHeight: responsive.height(150),
  },
});

