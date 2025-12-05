import React, { useState } from 'react';
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
import { Card, CardHeader, CardTitle, CardDescription } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Dialog } from '../components/ui/Dialog';
import { Input } from '../components/ui/Input';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { toast } from '../utils/toast';
import { responsive, getResponsiveFontSize, getResponsivePadding, getResponsiveMargin } from '../utils/responsive';

export const UserCirclesScreen: React.FC = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { customCircles, addCircle, deleteCircle, isLoading } = useScribela();
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [circleName, setCircleName] = useState('');
  const [circleDescription, setCircleDescription] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCreateCircle = async () => {
    if (!circleName.trim()) {
      toast.error('Le nom du cercle est requis');
      return;
    }

    setLoading(true);
    try {
      await addCircle({
        name: circleName.trim(),
        description: circleDescription.trim() || '',
      });
      toast.success('Cercle créé avec succès !');
      setCreateDialogOpen(false);
      setCircleName('');
      setCircleDescription('');
    } catch (error) {
      console.error('Erreur lors de la création:', error);
      toast.error('Erreur lors de la création du cercle');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCircle = async (circleId: string) => {
    try {
      await deleteCircle(circleId);
      toast.success('Cercle supprimé');
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      toast.error('Erreur lors de la suppression');
    }
  };

  const renderCircle = ({ item }: { item: any }) => (
    <Card>
      <CardHeader>
        <View style={styles.circleHeader}>
          <View style={styles.circleInfo}>
            <CardTitle>{item.name}</CardTitle>
            {item.description && (
              <CardDescription>{item.description}</CardDescription>
            )}
            {item.memberCount !== undefined && (
              <Badge variant="outline" style={styles.badge}>
                {item.memberCount} membre{item.memberCount > 1 ? 's' : ''}
              </Badge>
            )}
          </View>
        </View>
      </CardHeader>
      <View style={styles.actions}>
        <Button
          onPress={() => {
            (navigation as any).navigate('CircleDiscussion', {
              circleId: item.id,
              circleName: item.name,
            });
          }}
          style={styles.actionButton}
        >
          Ouvrir
        </Button>
        <Button
          variant="destructive"
          onPress={() => handleDeleteCircle(item.id)}
          style={styles.actionButton}
        >
          Supprimer
        </Button>
      </View>
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
          Mes cercles
        </Text>
        <Button
          onPress={() => setCreateDialogOpen(true)}
          style={styles.createButton}
          size="sm"
        >
          + Nouveau cercle
        </Button>
      </View>

      <FlatList
        data={customCircles}
        keyExtractor={(item) => item.id}
        renderItem={renderCircle}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={() => {}}
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
              Aucun cercle pour le moment
            </Text>
            <Text
              style={[
                styles.emptySubtext,
                { fontFamily: typography.fonts.lora },
              ]}
            >
              Créez votre premier cercle pour commencer !
            </Text>
          </View>
        }
      />

      <Dialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        title="Créer un cercle"
        footer={
          <View style={styles.dialogFooter}>
            <Button
              variant="outline"
              onPress={() => setCreateDialogOpen(false)}
              style={styles.dialogButton}
            >
              Annuler
            </Button>
            <Button
              onPress={handleCreateCircle}
              loading={loading}
              disabled={!circleName.trim()}
              style={styles.dialogButton}
            >
              Créer
            </Button>
          </View>
        }
      >
        <Input
          label="Nom du cercle"
          value={circleName}
          onChangeText={setCircleName}
          placeholder="Ex: Amis poètes"
        />
        <Input
          label="Description (optionnel)"
          value={circleDescription}
          onChangeText={setCircleDescription}
          placeholder="Description du cercle"
          multiline
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
    minWidth: responsive.isSmallDevice ? '100%' : undefined,
  },
  createButton: {
    minWidth: responsive.isSmallDevice ? '100%' : responsive.width(140),
    maxWidth: responsive.isSmallDevice ? '100%' : undefined,
  },
  list: {
    padding: getResponsivePadding(16),
    paddingBottom: responsive.height(80), // Space for tab bar
  },
  circleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  circleInfo: {
    flex: 1,
  },
  badge: {
    marginTop: 8,
    alignSelf: 'flex-start',
  },
  actions: {
    flexDirection: 'row',
    gap: getResponsiveMargin(12),
    marginTop: getResponsiveMargin(12),
    flexWrap: responsive.isSmallDevice ? 'wrap' : 'nowrap',
  },
  actionButton: {
    flex: responsive.isSmallDevice ? 1 : undefined,
    minWidth: responsive.isSmallDevice ? '48%' : responsive.width(100),
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
    fontFamily: typography.fonts.lora,
  },
  emptySubtext: {
    fontSize: getResponsiveFontSize(14),
    color: colors.mutedForeground,
    textAlign: 'center',
    fontFamily: typography.fonts.lora,
  },
  dialogFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
    marginTop: 16,
  },
  dialogButton: {
    minWidth: 100,
  },
});

