import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useScribela } from '../contexts/ScribelaContext';
import { Card, CardHeader, CardTitle } from './ui/Card';
import { Avatar } from './ui/Avatar';
import { Button } from './ui/Button';
import { Badge } from './ui/Badge';
import { UnsubscribeDialog } from './UnsubscribeDialog';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { toast } from '../utils/toast';

export const SubscriptionManager: React.FC = () => {
  const navigation = useNavigation();
  const {
    subscribedAuthors,
    removeSubscription,
    isLoading,
  } = useScribela();

  const [unsubscribeDialogOpen, setUnsubscribeDialogOpen] = useState(false);
  const [selectedAuthor, setSelectedAuthor] = useState<string | null>(null);

  const handleUnsubscribeClick = (authorName: string) => {
    setSelectedAuthor(authorName);
    setUnsubscribeDialogOpen(true);
  };

  const renderSubscription = ({ item }: { item: any }) => (
    <Card>
      <CardHeader>
        <View style={styles.subscriptionHeader}>
          <TouchableOpacity
            onPress={() => {
              (navigation as any).navigate('AuthorCarnet', {
                authorName: item.authorName,
              });
            }}
            style={styles.authorRow}
            activeOpacity={0.7}
          >
            <Avatar name={item.authorName} size={40} />
            <View style={styles.authorInfo}>
              <CardTitle>{item.authorName}</CardTitle>
              <Badge variant="default" style={styles.priceBadge}>
                {item.price.toFixed(2)}€/mois
              </Badge>
            </View>
          </TouchableOpacity>
          <Button
            variant="outline"
            size="sm"
            onPress={() => handleUnsubscribeClick(item.authorName)}
          >
            Se désabonner
          </Button>
        </View>
      </CardHeader>
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
          Mes abonnements
        </Text>
        <Text
          style={[
            styles.headerSubtitle,
            { fontFamily: typography.fonts.lora },
          ]}
        >
          {subscribedAuthors.length} abonnement{subscribedAuthors.length > 1 ? 's' : ''}
        </Text>
      </View>

      <FlatList
        data={subscribedAuthors}
        keyExtractor={(item) => item.authorName}
        renderItem={renderSubscription}
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
              Aucun abonnement pour le moment
            </Text>
            <Text
              style={[
                styles.emptySubtext,
                { fontFamily: typography.fonts.lora },
              ]}
            >
              Abonnez-vous à vos auteurs préférés pour accéder à leur contenu exclusif
            </Text>
          </View>
        }
      />

      <UnsubscribeDialog
        open={unsubscribeDialogOpen}
        onOpenChange={setUnsubscribeDialogOpen}
        authorName={selectedAuthor || ''}
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
    padding: 16,
    backgroundColor: colors.card,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTitle: {
    fontSize: 28, // text-3xl
    fontWeight: typography.weights.medium,
    color: colors.foreground,
    marginBottom: 4, // mb-1
    fontFamily: typography.fonts.dancingScript,
    lineHeight: 42, // line-height: 1.5
  },
  headerSubtitle: {
    fontSize: 14,
    color: colors.mutedForeground,
  },
  list: {
    padding: 16,
  },
  subscriptionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  authorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  authorInfo: {
    marginLeft: 12,
    flex: 1,
  },
  priceBadge: {
    marginTop: 4,
    alignSelf: 'flex-start',
  },
  emptyContainer: {
    paddingVertical: 60,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: colors.mutedForeground,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: colors.mutedForeground,
    textAlign: 'center',
  },
});

