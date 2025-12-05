import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Modal,
  TouchableWithoutFeedback,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useScribela } from '../contexts/ScribelaContext';
import { Input } from '../components/ui/Input';
import { Textarea } from '../components/ui/Textarea';
import { Label } from '../components/ui/Label';
import { Switch } from '../components/ui/Switch';
import { Select } from '../components/ui/Select';
import { Button } from '../components/ui/Button';
import { X, Mic, Square, Play, Trash2, MapPin } from '../components/icons/Icons';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { toast } from '../utils/toast';
import { responsive, getResponsiveFontSize, getResponsivePadding, getResponsiveMargin } from '../utils/responsive';

const CATEGORIES = [
  { label: 'Essai', value: 'Essai' },
  { label: 'Journal', value: 'Journal' },
  { label: 'Lettre', value: 'Lettre' },
  { label: 'Méditation', value: 'Méditation' },
  { label: 'Micro nouvelle', value: 'Micro nouvelle' },
  { label: 'Pensées', value: 'Pensées' },
  { label: 'Poème', value: 'Poème' },
  { label: 'Prière', value: 'Prière' },
  { label: 'Réflexions', value: 'Réflexions' },
  { label: 'Témoignage', value: 'Témoignage' },
];

export const CreateTextScreen: React.FC = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { addText, currentUser } = useScribela();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('');
  const [themes, setThemes] = useState('');
  const [location, setLocation] = useState('');
  const [subscribersOnly, setSubscribersOnly] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioURL, setAudioURL] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!content.trim() || !category) {
      toast.error('Veuillez remplir tous les champs obligatoires');
      return;
    }

    setLoading(true);
    try {
      await addText({
        author: { name: currentUser, avatar: '' },
        title: title.trim() || '',
        content: content.trim(),
        category,
        themes: themes.trim() || '',
        location: location.trim() || '',
        date: 'à l\'instant',
        publishedAt: new Date(),
        subscribersOnly,
        hasAudioRecording: !!audioBlob,
        isEchoed: false,
        isSaved: false,
      });

      // Réinitialiser le formulaire
      setTitle('');
      setContent('');
      setCategory('');
      setThemes('');
      setLocation('');
      setSubscribersOnly(false);
      setAudioBlob(null);
      setAudioURL(null);

      toast.success('✨ Texte publié avec succès !');
      navigation.goBack();
    } catch (error) {
      console.error('Erreur lors de la publication:', error);
      toast.error('Erreur lors de la publication du texte');
    } finally {
      setLoading(false);
    }
  };

  const startRecording = async () => {
    // Note: L'enregistrement audio nécessite des permissions et APIs spécifiques
    // Pour l'instant, on simule juste l'état
    toast.info('Fonctionnalité d\'enregistrement audio à venir');
    setIsRecording(true);
  };

  const stopRecording = () => {
    setIsRecording(false);
    // Simuler un blob audio
    setAudioBlob(new Blob());
    setAudioURL('mock-audio-url');
    toast.success('Enregistrement terminé');
  };

  const deleteRecording = () => {
    setAudioBlob(null);
    setAudioURL(null);
    toast.success('Enregistrement supprimé');
  };

  return (
    <Modal
      visible={true}
      transparent
      animationType="slide"
      onRequestClose={() => navigation.goBack()}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.modalContainer}
      >
        <TouchableWithoutFeedback onPress={() => navigation.goBack()}>
          <View style={styles.overlay} />
        </TouchableWithoutFeedback>
        <View style={[styles.modalContent, { paddingTop: Math.max(insets.top, getResponsivePadding(16)) }]}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <Text style={styles.logo}>📝</Text>
              <Text
                style={[
                  styles.headerTitle,
                  { fontFamily: typography.fonts.lora },
                ]}
              >
                Nouvelle publication
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={styles.closeButton}
            >
              <X size={24} color={colors.mutedForeground} />
            </TouchableOpacity>
          </View>

          {/* Form */}
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
          >
            {/* Category */}
            <View style={styles.field}>
              <Label>Catégorie *</Label>
              <Select
                options={CATEGORIES.map((cat) => ({
                  label: cat.label,
                  value: cat.value,
                }))}
                value={category}
                onValueChange={setCategory}
                placeholder="Choisir une catégorie"
              />
            </View>

            {/* Title */}
            <View style={styles.field}>
              <Label>Titre (optionnel)</Label>
              <Input
                value={title}
                onChangeText={setTitle}
                placeholder="Donnez un titre à votre texte..."
              />
            </View>

            {/* Themes */}
            <View style={styles.field}>
              <Label>Thème(s) (optionnel)</Label>
              <Input
                value={themes}
                onChangeText={setThemes}
                placeholder="Ex: amour, nature, solitude..."
              />
            </View>

            {/* Location */}
            <View style={styles.field}>
              <View style={styles.labelRow}>
                <MapPin size={16} color={colors.foreground} />
                <Label>Lieu d'écriture (optionnel)</Label>
              </View>
              <Input
                value={location}
                onChangeText={setLocation}
                placeholder="Ex: Paris, Café du coin, Dans le train..."
              />
            </View>

            {/* Content */}
            <View style={styles.field}>
              <Label>Votre texte *</Label>
              <Textarea
                value={content}
                onChangeText={setContent}
                placeholder="Écrivez votre texte ici..."
                style={styles.contentTextarea}
                multiline
              />
              <Text style={styles.charCount}>
                {content.length} caractères
              </Text>
            </View>

            {/* Subscribers Only Option */}
            <View style={styles.subscribersCard}>
              <View style={styles.subscribersContent}>
                <Label>Réservé aux abonnés</Label>
                <Text style={styles.subscribersDescription}>
                  Ce texte ne sera visible que par vos abonnés
                </Text>
              </View>
              <Switch
                value={subscribersOnly}
                onValueChange={setSubscribersOnly}
              />
            </View>

            {/* Audio Recording */}
            <View style={styles.field}>
              <Label>Lecture audio (optionnel)</Label>
              <View style={styles.audioSection}>
                {!audioBlob && !isRecording && (
                  <Button
                    variant="outline"
                    onPress={startRecording}
                    style={styles.recordButton}
                  >
                    <Mic size={16} color={colors.secondary} />
                    <Text style={styles.recordButtonText}>
                      Enregistrer ma lecture
                    </Text>
                  </Button>
                )}
                {isRecording && (
                  <View style={styles.recordingCard}>
                    <View style={styles.recordingContent}>
                      <View style={styles.recordingIndicator} />
                      <Text style={styles.recordingText}>
                        Enregistrement en cours...
                      </Text>
                    </View>
                    <Button
                      size="sm"
                      onPress={stopRecording}
                      style={styles.stopButton}
                    >
                      <Square size={16} color={colors.card} />
                      <Text style={styles.stopButtonText}>Arrêter</Text>
                    </Button>
                  </View>
                )}
                {audioBlob && audioURL && (
                  <View style={styles.audioCard}>
                    <Play size={16} color={colors.secondary} />
                    <Text style={styles.audioText}>Enregistrement disponible</Text>
                    <TouchableOpacity
                      onPress={deleteRecording}
                      style={styles.deleteAudioButton}
                    >
                      <Trash2 size={16} color={colors.mutedForeground} />
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            </View>
          </ScrollView>

          {/* Footer */}
          <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, getResponsivePadding(16)) }]}>
            <Button
              onPress={handleSubmit}
              loading={loading}
              disabled={!content.trim() || !category}
              style={styles.publishButton}
            >
              Publier
            </Button>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: colors.card,
    borderTopLeftRadius: responsive.radius(16),
    borderTopRightRadius: responsive.radius(16),
    maxHeight: '90%',
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: getResponsivePadding(16),
    paddingVertical: getResponsivePadding(12),
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    flexWrap: 'wrap',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: getResponsiveMargin(8),
    flex: responsive.isSmallDevice ? 1 : undefined,
  },
  logo: {
    fontSize: getResponsiveFontSize(24),
  },
  headerTitle: {
    fontSize: getResponsiveFontSize(16),
    color: colors.foreground,
    fontWeight: typography.weights.medium,
  },
  closeButton: {
    padding: getResponsivePadding(4),
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: getResponsivePadding(16),
    gap: getResponsiveMargin(16),
    paddingBottom: responsive.height(100), // Space for footer
  },
  field: {
    marginBottom: getResponsiveMargin(16),
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: getResponsiveMargin(6),
    marginBottom: getResponsiveMargin(8),
  },
  contentTextarea: {
    minHeight: responsive.height(300),
    fontFamily: typography.fonts.lora,
  },
  charCount: {
    fontSize: getResponsiveFontSize(12),
    color: colors.mutedForeground,
    marginTop: getResponsiveMargin(4),
    fontFamily: typography.fonts.lora,
  },
  subscribersCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: getResponsivePadding(12),
    backgroundColor: colors.inputBackground,
    borderRadius: responsive.radius(8),
    borderWidth: 1,
    borderColor: 'rgba(59, 47, 47, 0.1)',
    flexWrap: responsive.isSmallDevice ? 'wrap' : 'nowrap',
  },
  subscribersContent: {
    flex: 1,
    minWidth: responsive.isSmallDevice ? '100%' : undefined,
  },
  subscribersDescription: {
    fontSize: getResponsiveFontSize(12),
    color: colors.mutedForeground,
    marginTop: getResponsiveMargin(2),
    fontFamily: typography.fonts.lora,
  },
  audioSection: {
    marginTop: getResponsiveMargin(6),
    gap: getResponsiveMargin(12),
  },
  recordButton: {
    width: '100%',
    borderColor: colors.secondary,
  },
  recordButtonText: {
    marginLeft: getResponsiveMargin(8),
    color: colors.secondary,
    fontFamily: typography.fonts.lora,
    fontSize: getResponsiveFontSize(14),
  },
  recordingCard: {
    backgroundColor: colors.inputBackground,
    borderRadius: responsive.radius(8),
    padding: getResponsivePadding(16),
    borderWidth: 1,
    borderColor: colors.accent,
  },
  recordingContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: getResponsiveMargin(8),
    marginBottom: getResponsiveMargin(12),
  },
  recordingIndicator: {
    width: responsive.width(12),
    height: responsive.height(12),
    borderRadius: responsive.radius(6),
    backgroundColor: colors.destructive,
  },
  recordingText: {
    fontSize: getResponsiveFontSize(14),
    color: colors.foreground,
    fontFamily: typography.fonts.lora,
  },
  stopButton: {
    backgroundColor: colors.foreground,
  },
  stopButtonText: {
    marginLeft: getResponsiveMargin(4),
    color: colors.card,
    fontFamily: typography.fonts.lora,
    fontSize: getResponsiveFontSize(14),
  },
  audioCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: getResponsiveMargin(12),
    backgroundColor: colors.inputBackground,
    borderRadius: responsive.radius(8),
    padding: getResponsivePadding(16),
    borderWidth: 1,
    borderColor: colors.secondary,
  },
  audioText: {
    flex: 1,
    fontSize: getResponsiveFontSize(14),
    color: colors.foreground,
    fontFamily: typography.fonts.lora,
  },
  deleteAudioButton: {
    padding: getResponsivePadding(4),
  },
  footer: {
    padding: getResponsivePadding(16),
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  publishButton: {
    width: '100%',
    backgroundColor: colors.secondary,
  },
});
