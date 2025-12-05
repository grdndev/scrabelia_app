import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  Image,
  TouchableOpacity,
} from 'react-native';
import { useScribela } from '../contexts/ScribelaContext';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Dialog } from '../components/ui/Dialog';
import { Input } from '../components/ui/Input';
import { Textarea } from '../components/ui/Textarea';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { toast } from '../utils/toast';
import * as api from '../utils/supabase/api';

interface Sponsorship {
  id: string;
  brand: string;
  category: string;
  title: string;
  description: string;
  imageUrl: string;
  ctaText: string;
  ctaUrl: string;
  createdAt?: number;
}

export const AdminSponsorshipsScreen: React.FC = () => {
  const { accessToken, sponsorships, reloadSponsorships } = useScribela();
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editingSponsorship, setEditingSponsorship] = useState<Sponsorship | null>(null);
  const [formData, setFormData] = useState({
    brand: '',
    category: '',
    title: '',
    description: '',
    imageUrl: '',
    ctaText: '',
    ctaUrl: '',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    reloadSponsorships();
  }, []);

  const handleSave = async () => {
    if (!accessToken) return;

    setLoading(true);
    try {
      if (editingSponsorship) {
        await api.updateSponsorship(editingSponsorship.id, formData, accessToken);
        toast.success('Sponsoring mis à jour');
      } else {
        await api.createSponsorship(formData, accessToken);
        toast.success('Sponsoring créé');
      }
      setCreateDialogOpen(false);
      setEditingSponsorship(null);
      resetForm();
      await reloadSponsorships();
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
      await api.deleteSponsorship(id, accessToken);
      toast.success('Sponsoring supprimé');
      await reloadSponsorships();
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Erreur lors de la suppression');
    }
  };

  const resetForm = () => {
    setFormData({
      brand: '',
      category: '',
      title: '',
      description: '',
      imageUrl: '',
      ctaText: '',
      ctaUrl: '',
    });
  };

  const renderSponsorship = ({ item }: { item: Sponsorship }) => (
    <Card>
      <CardHeader>
        <View style={styles.sponsorshipHeader}>
          <CardTitle>{item.brand}</CardTitle>
          <View style={styles.actions}>
            <Button
              variant="outline"
              size="sm"
              onPress={() => {
                setEditingSponsorship(item);
                setFormData({
                  brand: item.brand,
                  category: item.category,
                  title: item.title,
                  description: item.description,
                  imageUrl: item.imageUrl,
                  ctaText: item.ctaText,
                  ctaUrl: item.ctaUrl,
                });
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
        {item.imageUrl && (
          <Image source={{ uri: item.imageUrl }} style={styles.image} />
        )}
        <Text
          style={[
            styles.title,
            { fontFamily: typography.fonts.lora },
          ]}
        >
          {item.title}
        </Text>
        <Text
          style={[
            styles.description,
            { fontFamily: typography.fonts.lora },
          ]}
        >
          {item.description}
        </Text>
        <Badge variant="outline" style={styles.categoryBadge}>
          {item.category}
        </Badge>
      </CardContent>
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
          Gestion des sponsorings
        </Text>
        <Button
          onPress={() => {
            setEditingSponsorship(null);
            resetForm();
            setCreateDialogOpen(true);
          }}
        >
          + Nouveau sponsoring
        </Button>
      </View>

      <FlatList
        data={sponsorships}
        keyExtractor={(item) => item.id}
        renderItem={renderSponsorship}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={reloadSponsorships}
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
              Aucun sponsoring pour le moment
            </Text>
          </View>
        }
      />

      <Dialog
        open={createDialogOpen}
        onOpenChange={(open) => {
          setCreateDialogOpen(open);
          if (!open) {
            setEditingSponsorship(null);
            resetForm();
          }
        }}
        title={editingSponsorship ? 'Modifier le sponsoring' : 'Nouveau sponsoring'}
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
              disabled={!formData.brand || !formData.title}
            >
              {editingSponsorship ? 'Modifier' : 'Créer'}
            </Button>
          </View>
        }
      >
        <Input
          label="Marque"
          value={formData.brand}
          onChangeText={(text) => setFormData({ ...formData, brand: text })}
          placeholder="Nom de la marque"
        />
        <Input
          label="Catégorie"
          value={formData.category}
          onChangeText={(text) => setFormData({ ...formData, category: text })}
          placeholder="Ex: Littérature, Édition..."
        />
        <Input
          label="Titre"
          value={formData.title}
          onChangeText={(text) => setFormData({ ...formData, title: text })}
          placeholder="Titre du sponsoring"
        />
        <Textarea
          label="Description"
          value={formData.description}
          onChangeText={(text) => setFormData({ ...formData, description: text })}
          placeholder="Description..."
          style={styles.textarea}
        />
        <Input
          label="URL de l'image"
          value={formData.imageUrl}
          onChangeText={(text) => setFormData({ ...formData, imageUrl: text })}
          placeholder="https://..."
        />
        <Input
          label="Texte du bouton"
          value={formData.ctaText}
          onChangeText={(text) => setFormData({ ...formData, ctaText: text })}
          placeholder="En savoir plus"
        />
        <Input
          label="URL du bouton"
          value={formData.ctaUrl}
          onChangeText={(text) => setFormData({ ...formData, ctaUrl: text })}
          placeholder="https://..."
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
  sponsorshipHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 12,
    backgroundColor: colors.muted,
  },
  title: {
    fontSize: 18, // text-lg
    fontWeight: typography.weights.medium,
    color: colors.foreground,
    marginBottom: 8, // mb-2
    lineHeight: 27, // line-height: 1.5
  },
  description: {
    fontSize: 14,
    color: colors.mutedForeground,
    marginBottom: 8, // mb-2
    lineHeight: 21,
  },
  categoryBadge: {
    alignSelf: 'flex-start',
  },
  emptyContainer: {
    paddingVertical: 60,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: colors.mutedForeground,
  },
  dialogFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
    marginTop: 16,
  },
  textarea: {
    minHeight: 100,
  },
});

