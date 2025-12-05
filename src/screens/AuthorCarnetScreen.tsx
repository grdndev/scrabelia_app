import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import { useScribela } from '../contexts/ScribelaContext';
import { TextCard } from '../components/TextCard';
import { DonationDialog } from '../components/DonationDialog';
import { SubscriptionDialog } from '../components/SubscriptionDialog';
import { UnsubscribeDialog } from '../components/UnsubscribeDialog';
import { Dialog } from '../components/ui/Dialog';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Label } from '../components/ui/Label';
import { Textarea } from '../components/ui/Textarea';
import { ArrowLeft, UserCircle, UserPlus, Heart, Check, Edit2 } from '../components/icons/Icons';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { toast } from '../utils/toast';
import { responsive, getResponsiveFontSize, getResponsivePadding, getResponsiveMargin } from '../utils/responsive';

type AuthorCarnetRouteProp = RouteProp<{ AuthorCarnet: { authorName: string } }, 'AuthorCarnet'>;

export const AuthorCarnetScreen: React.FC = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const route = useRoute<AuthorCarnetRouteProp>();
  const { authorName } = route.params;
  const {
    texts,
    subscribedAuthors,
    myDuos,
    currentUser,
    addSubscription,
    removeSubscription,
    updateAuthorBio,
    getAuthorBio,
  } = useScribela();

  const [showSubscriptionDialog, setShowSubscriptionDialog] = useState(false);
  const [showDonationDialog, setShowDonationDialog] = useState(false);
  const [showUnsubscribeDialog, setShowUnsubscribeDialog] = useState(false);
  const [showBioDialog, setShowBioDialog] = useState(false);
  const [subscriptionPrice, setSubscriptionPrice] = useState('4.99');
  const [bio, setBio] = useState('');
  const [bioInput, setBioInput] = useState('');

  // Filtrer les textes de cet auteur
  const authorTexts = texts.filter((text) => text.author.name === authorName);

  // Trier les textes du plus récent au plus ancien
  const sortedTexts = [...authorTexts].sort((a, b) => {
    const dateA = new Date(a.publishedAt).getTime();
    const dateB = new Date(b.publishedAt).getTime();
    return dateB - dateA;
  });

  // Vérifier si on est déjà abonné
  const isSubscribed = subscribedAuthors.some((sub) => sub.authorName === authorName);

  // Vérifier si on a déjà un duo avec cet auteur
  const hasDuo = myDuos.some((duo) => duo.name === authorName);

  // Vérifier si c'est mon propre carnet
  const isOwnCarnet = authorName === currentUser;

  // Charger la bio de l'auteur au montage
  useEffect(() => {
    const loadBio = async () => {
      try {
        const authorBio = await getAuthorBio(authorName);
        setBio(authorBio);
      } catch (error) {
        console.error('Erreur lors du chargement de la bio:', error);
        setBio('');
      }
    };
    loadBio();
  }, [authorName, getAuthorBio]);

  const handleSubscribe = async () => {
    try {
      const price = parseFloat(subscriptionPrice);
      if (isNaN(price) || price <= 0) {
        toast.error('Veuillez entrer un prix valide');
        return;
      }
      await addSubscription(authorName, price);
      setShowSubscriptionDialog(false);
      toast.success(`Vous êtes maintenant abonné à ${authorName}`);
    } catch (error) {
      console.error('Erreur lors de l\'abonnement:', error);
      toast.error('Erreur lors de l\'abonnement');
    }
  };

  const handleCreateDuo = () => {
    (navigation as any).navigate('DuoDiscussion', { authorName });
  };

  const handleOpenDuo = () => {
    (navigation as any).navigate('DuoDiscussion', { authorName });
  };

  const handleUnsubscribe = () => {
    setShowUnsubscribeDialog(true);
  };

  const confirmUnsubscribe = async () => {
    try {
      await removeSubscription(authorName);
      setShowUnsubscribeDialog(false);
      toast.success(`Désabonnement de ${authorName} réussi`);
    } catch (error) {
      console.error('Erreur lors du désabonnement:', error);
      toast.error('Erreur lors du désabonnement');
    }
  };

  const handleEditBio = () => {
    setBioInput(bio);
    setShowBioDialog(true);
  };

  const handleSaveBio = async () => {
    try {
      if (bioInput.length > 300) {
        toast.error('La présentation ne peut pas dépasser 300 caractères');
        return;
      }
      await updateAuthorBio(authorName, bioInput);
      setBio(bioInput);
      setShowBioDialog(false);
      toast.success('Présentation mise à jour');
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la bio:', error);
      toast.error('Erreur lors de la mise à jour');
    }
  };

  const handleGardenClick = (text: any) => {
    (navigation as any).navigate('Garden', {
      textId: text.id,
      textTitle: text.title,
      textContent: text.content,
      textAuthor: text.author,
    });
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <ArrowLeft size={16} color={colors.secondary} />
          <Text style={styles.backText}>Retour</Text>
        </TouchableOpacity>

        <View style={styles.headerContent}>
          <View style={styles.headerTitleRow}>
            <Text
              style={[
                styles.headerTitle,
                { fontFamily: typography.fonts.dancingScript },
              ]}
            >
              {authorName}
            </Text>
            {isOwnCarnet && (
              <TouchableOpacity
                onPress={handleEditBio}
                style={styles.editButton}
              >
                <Edit2 size={16} color={colors.secondary} />
              </TouchableOpacity>
            )}
          </View>
          {bio && (
            <Text
              style={[
                styles.bioPreview,
                { fontFamily: typography.fonts.lora },
              ]}
            >
              {bio}
            </Text>
          )}
        </View>

        {/* Action buttons */}
        <View style={styles.actionsRow}>
          {!isSubscribed && (
            <TouchableOpacity
              onPress={() => setShowSubscriptionDialog(true)}
              style={styles.actionButton}
            >
              <UserPlus size={16} color={colors.card} />
              <Text style={styles.actionButtonText}>M'abonner</Text>
            </TouchableOpacity>
          )}

          {isSubscribed && (
            <TouchableOpacity
              onPress={handleUnsubscribe}
              style={[styles.actionButton, styles.subscribedButton]}
            >
              <Check size={16} color={colors.foreground} />
              <Text style={[styles.actionButtonText, styles.subscribedButtonText]}>
                Abonné
              </Text>
            </TouchableOpacity>
          )}

          {!hasDuo && (
            <TouchableOpacity
              onPress={handleCreateDuo}
              style={[styles.actionButton, styles.duoButton]}
            >
              <UserCircle size={16} color={colors.foreground} />
              <Text style={[styles.actionButtonText, styles.duoButtonText]}>
                Créer un duo
              </Text>
            </TouchableOpacity>
          )}

          {hasDuo && (
            <TouchableOpacity
              onPress={handleOpenDuo}
              style={[styles.actionButton, styles.duoButton]}
            >
              <UserCircle size={16} color={colors.foreground} />
              <Text style={[styles.actionButtonText, styles.duoButtonText]}>
                Duo créé
              </Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            onPress={() => setShowDonationDialog(true)}
            style={[styles.actionButton, styles.donationButton]}
          >
            <Heart size={16} color={colors.foreground} />
            <Text style={[styles.actionButtonText, styles.donationButtonText]}>
              Faire un don
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Content */}
      <ScrollView 
        style={styles.scrollView} 
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: responsive.height(80) }, // Space for tab bar
        ]}
      >
        {sortedTexts.length === 0 ? (
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIconContainer}>
              <UserPlus size={40} color={colors.secondary} />
            </View>
            <Text
              style={[
                styles.emptyTitle,
                { fontFamily: typography.fonts.dancingScript },
              ]}
            >
              Aucun texte publié
            </Text>
            <Text
              style={[
                styles.emptyText,
                { fontFamily: typography.fonts.lora },
              ]}
            >
              {authorName} n'a pas encore publié de texte.
            </Text>
          </View>
        ) : (
          <View style={styles.textsList}>
            {sortedTexts.map((text) => (
              <TextCard
                key={text.id}
                text={text}
                onPress={() => handleGardenClick(text)}
                onAuthorPress={() => {
                  (navigation as any).navigate('AuthorCarnet', {
                    authorName: text.author.name,
                  });
                }}
              />
            ))}
          </View>
        )}
      </ScrollView>

      {/* Subscription Dialog */}
      <Dialog
        open={showSubscriptionDialog}
        onOpenChange={setShowSubscriptionDialog}
        title={`S'abonner à ${authorName}`}
        description="Accédez à tous les textes réservés aux abonnés de cet auteur"
        footer={
          <View style={styles.dialogFooter}>
            <Button
              variant="outline"
              onPress={() => setShowSubscriptionDialog(false)}
            >
              Annuler
            </Button>
            <Button onPress={handleSubscribe} style={styles.subscribeButton}>
              S'abonner
            </Button>
          </View>
        }
      >
        <View style={styles.dialogContent}>
          <View style={styles.priceField}>
            <Label>Tarif mensuel (€)</Label>
            <Input
              keyboardType="decimal-pad"
              value={subscriptionPrice}
              onChangeText={setSubscriptionPrice}
            />
            <Text style={styles.priceNote}>
              L'auteur recevra 80% (Scribela prend 20% de commission)
            </Text>
          </View>

          <View style={styles.benefitsSection}>
            <Text style={styles.benefitsTitle}>Avantages :</Text>
            <View style={styles.benefitItem}>
              <Check size={16} color={colors.secondary} />
              <Text style={styles.benefitText}>
                Accès à tous les textes réservés aux abonnés
              </Text>
            </View>
            <View style={styles.benefitItem}>
              <Check size={16} color={colors.secondary} />
              <Text style={styles.benefitText}>
                Soutenez directement votre auteur préféré
              </Text>
            </View>
            <View style={styles.benefitItem}>
              <Check size={16} color={colors.secondary} />
              <Text style={styles.benefitText}>
                Annulation possible à tout moment
              </Text>
            </View>
          </View>
        </View>
      </Dialog>

      {/* Unsubscribe Confirmation Dialog */}
      <Dialog
        open={showUnsubscribeDialog}
        onOpenChange={setShowUnsubscribeDialog}
        title={`Se désabonner de ${authorName}`}
        description="Êtes-vous sûr de vouloir vous désabonner de cet auteur ?"
        footer={
          <View style={styles.dialogFooter}>
            <Button
              variant="outline"
              onPress={() => setShowUnsubscribeDialog(false)}
            >
              Annuler
            </Button>
            <Button onPress={confirmUnsubscribe} style={styles.subscribeButton}>
              Me désabonner
            </Button>
          </View>
        }
      >
        <Text style={styles.unsubscribeText}>
          Vous perdrez l'accès à tous les textes réservés aux abonnés de {authorName}.
        </Text>
      </Dialog>

      {/* Donation Dialog */}
      <DonationDialog
        open={showDonationDialog}
        onOpenChange={setShowDonationDialog}
        authorName={authorName}
      />

      {/* Bio Edit Dialog */}
      <Dialog
        open={showBioDialog}
        onOpenChange={setShowBioDialog}
        title="Modifier ma présentation"
        description="Ajoutez une courte introduction qui apparaîtra sur votre carnet"
        footer={
          <View style={styles.dialogFooter}>
            <Button
              variant="outline"
              onPress={() => setShowBioDialog(false)}
            >
              Annuler
            </Button>
            <Button onPress={handleSaveBio} style={styles.subscribeButton}>
              Enregistrer
            </Button>
          </View>
        }
      >
        <View style={styles.dialogContent}>
          <View style={styles.bioField}>
            <Label>Présentation</Label>
            <Textarea
              value={bioInput}
              onChangeText={setBioInput}
              placeholder="Quelques mots sur vous et votre écriture..."
              style={styles.bioTextarea}
              maxLength={300}
            />
            <View style={styles.charCountRow}>
              <Text style={styles.charCountText}>
                Maximum 300 caractères
              </Text>
              <Text style={styles.charCountText}>
                {bioInput.length}/300
              </Text>
            </View>
          </View>
        </View>
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
    backgroundColor: colors.card,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingHorizontal: getResponsivePadding(16),
    paddingBottom: getResponsivePadding(16),
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: getResponsiveMargin(8),
    marginBottom: getResponsiveMargin(12),
  },
  backText: {
    fontSize: getResponsiveFontSize(14),
    color: colors.secondary,
    fontFamily: typography.fonts.lora,
  },
  headerContent: {
    marginBottom: getResponsiveMargin(16),
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: getResponsiveMargin(8),
    flexWrap: 'wrap',
  },
  headerTitle: {
    fontSize: getResponsiveFontSize(32),
    color: colors.foreground,
    flex: responsive.isSmallDevice ? 1 : undefined,
    minWidth: responsive.isSmallDevice ? '100%' : undefined,
  },
  editButton: {
    padding: 8,
  },
  bioPreview: {
    fontSize: getResponsiveFontSize(14),
    color: colors.mutedForeground,
    marginTop: getResponsiveMargin(8),
    lineHeight: responsive.height(21),
    fontStyle: 'italic',
  },
  actionsRow: {
    flexDirection: 'row',
    gap: getResponsiveMargin(8),
    flexWrap: 'wrap',
  },
  actionButton: {
    flex: responsive.isSmallDevice ? 1 : undefined,
    minWidth: responsive.isSmallDevice ? '48%' : responsive.width(140),
    maxWidth: responsive.isSmallDevice ? '48%' : undefined,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: getResponsiveMargin(8),
    paddingVertical: getResponsivePadding(10),
    paddingHorizontal: getResponsivePadding(16),
    backgroundColor: colors.secondary,
    borderRadius: responsive.radius(8),
  },
  actionButtonText: {
    color: colors.card,
    fontSize: getResponsiveFontSize(16),
    fontFamily: typography.fonts.lora,
    fontWeight: typography.weights.medium,
  },
  subscribedButton: {
    backgroundColor: `${colors.secondary}33`,
    borderWidth: 1,
    borderColor: `${colors.secondary}4D`,
  },
  subscribedButtonText: {
    color: colors.foreground,
  },
  duoButton: {
    backgroundColor: `${colors.primary}33`,
    borderWidth: 1,
    borderColor: `${colors.primary}4D`,
  },
  duoButtonText: {
    color: colors.foreground,
  },
  donationButton: {
    backgroundColor: `${colors.accent}33`,
    borderWidth: 1,
    borderColor: `${colors.accent}4D`,
  },
  donationButtonText: {
    color: colors.foreground,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: getResponsivePadding(16),
  },
  textsList: {
    gap: getResponsiveMargin(16),
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: responsive.height(60),
    paddingHorizontal: getResponsivePadding(24),
    minHeight: responsive.screenHeight * 0.4,
  },
  emptyIconContainer: {
    width: responsive.width(80),
    height: responsive.height(80),
    borderRadius: responsive.radius(40),
    backgroundColor: `${colors.secondary}33`,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: getResponsiveMargin(16),
  },
  emptyTitle: {
    fontSize: getResponsiveFontSize(22),
    color: colors.foreground,
    marginBottom: getResponsiveMargin(8),
  },
  emptyText: {
    fontSize: getResponsiveFontSize(16),
    color: colors.mutedForeground,
    lineHeight: responsive.height(24),
    textAlign: 'center',
  },
  dialogFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
    marginTop: 16,
  },
  dialogContent: {
    gap: 24,
    paddingVertical: 16,
  },
  priceField: {
    gap: 8,
  },
  priceNote: {
    fontSize: 12,
    color: colors.mutedForeground,
    fontFamily: typography.fonts.lora,
  },
  benefitsSection: {
    gap: 8,
  },
  benefitsTitle: {
    fontSize: 14,
    color: colors.foreground,
    marginBottom: 8,
    fontFamily: typography.fonts.lora,
    fontWeight: typography.weights.medium,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  benefitText: {
    fontSize: 14,
    color: colors.mutedForeground,
    flex: 1,
    fontFamily: typography.fonts.lora,
  },
  unsubscribeText: {
    fontSize: 14,
    color: colors.mutedForeground,
    fontFamily: typography.fonts.lora,
    paddingVertical: 16,
  },
  subscribeButton: {
    backgroundColor: colors.secondary,
  },
  bioField: {
    gap: 8,
  },
  bioTextarea: {
    minHeight: 120,
    fontFamily: typography.fonts.lora,
  },
  charCountRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  charCountText: {
    fontSize: 12,
    color: colors.mutedForeground,
    fontFamily: typography.fonts.lora,
  },
});
