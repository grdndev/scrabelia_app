import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { useScribela } from '../contexts/ScribelaContext';
import { RootStackParamList } from '../navigation/AppNavigator';
import { Textarea } from '../components/ui/Textarea';
import { Button } from '../components/ui/Button';
import { AlertDialog } from '../components/ui/AlertDialog';
import { ReportDialog } from '../components/ReportDialog';
import { ArrowLeft, Leaf, Trash2, Flag } from '../components/icons/Icons';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { getRelativeTime } from '../utils/relativeTime';
import { toast } from '../utils/toast';
import { responsive, getResponsiveFontSize, getResponsivePadding, getResponsiveMargin } from '../utils/responsive';

type GardenScreenRouteProp = RouteProp<RootStackParamList, 'Garden'>;

export const GardenScreen: React.FC = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const route = useRoute<GardenScreenRouteProp>();
  const { textId, textTitle, textContent, textAuthor } = route.params;
  const {
    gardenComments,
    addGardenComment,
    deleteGardenComment,
    currentUser,
    markAsRead,
  } = useScribela();

  const [newComment, setNewComment] = useState('');
  const [deleteCommentId, setDeleteCommentId] = useState<string | null>(null);
  const [reportingCommentId, setReportingCommentId] = useState<string | null>(null);

  const comments = gardenComments[textId] || [];

  // Trier les commentaires du plus récent au plus ancien (par ID décroissant)
  const sortedComments = [...comments].sort((a, b) => {
    return Number(b.id) - Number(a.id);
  });

  // Marquer comme lu au montage
  useEffect(() => {
    markAsRead(textId, 'garden');
  }, [textId, markAsRead]);

  const handleSubmitComment = async () => {
    if (newComment.trim()) {
      try {
        await addGardenComment(textId, {
          user: { name: currentUser, avatar: '' },
          content: newComment,
          date: 'à l\'instant',
        });
        setNewComment('');
        await markAsRead(textId, 'garden');
        toast.success('Commentaire ajouté !');
      } catch (error) {
        console.error("Erreur lors de l'ajout du commentaire:", error);
        toast.error("Erreur lors de l'ajout du commentaire");
      }
    }
  };

  const handleConfirmDeleteComment = async () => {
    if (deleteCommentId) {
      try {
        await deleteGardenComment(textId, deleteCommentId);
        setDeleteCommentId(null);
        toast.success('Commentaire supprimé');
      } catch (error) {
        console.error('Erreur lors de la suppression du commentaire:', error);
        toast.error('Erreur lors de la suppression du commentaire');
      }
    }
  };

  const handleAuthorClick = () => {
    (navigation as any).navigate('AuthorCarnet', { authorName: textAuthor.name });
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      {/* Header minimal */}
      <View style={[styles.header, { paddingTop: Math.max(insets.top, getResponsivePadding(16)) }]}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <ArrowLeft size={16} color={colors.secondary} />
          <Text style={styles.backText}>Retour</Text>
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <View style={styles.iconContainer}>
            <Leaf size={20} color={colors.secondary} />
          </View>
          <Text
            style={[
              styles.headerTitle,
              { fontFamily: typography.fonts.dancingScript },
            ]}
          >
            Jardin
          </Text>
        </View>
      </View>

      {/* Zone du texte - scrollable */}
      <ScrollView
        style={styles.textScrollView}
        contentContainerStyle={styles.textScrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.textCard}>
          <Text style={styles.textLabel}>Texte de</Text>
          <TouchableOpacity onPress={handleAuthorClick}>
            <Text
              style={[
                styles.authorName,
                { fontFamily: typography.fonts.dancingScript },
              ]}
            >
              {textAuthor.name}
            </Text>
          </TouchableOpacity>
          {textTitle && (
            <Text
              style={[
                styles.textTitle,
                { fontFamily: typography.fonts.dancingScript },
              ]}
            >
              {textTitle}
            </Text>
          )}
          <Text
            style={[
              styles.textContent,
              { fontFamily: typography.fonts.lora },
            ]}
          >
            {textContent}
          </Text>
        </View>
      </ScrollView>

      {/* Discussion - scrollable */}
      <View style={styles.discussionContainer}>
        <ScrollView
          style={styles.discussionScrollView}
          contentContainerStyle={styles.discussionScrollContent}
          keyboardShouldPersistTaps="handled"
        >
          {/* Zone de saisie de commentaire */}
          <View style={styles.commentInputCard}>
            <Textarea
              placeholder="Ajouter un commentaire dans le jardin..."
              value={newComment}
              onChangeText={setNewComment}
              style={styles.textarea}
              multiline
            />
            <View style={styles.submitButtonContainer}>
              <Button
                onPress={handleSubmitComment}
                disabled={!newComment.trim()}
                style={styles.submitButton}
              >
                Publier
              </Button>
            </View>
          </View>

          {/* Liste des commentaires */}
          <View style={styles.commentsList}>
            {sortedComments.length === 0 ? (
              <View style={styles.emptyComments}>
                <Text style={styles.emptyIcon}>🌿</Text>
                <Text
                  style={[
                    styles.emptyText,
                    { fontFamily: typography.fonts.lora },
                  ]}
                >
                  Aucun commentaire pour le moment.
                </Text>
                <Text
                  style={[
                    styles.emptySubtext,
                    { fontFamily: typography.fonts.lora },
                  ]}
                >
                  Soyez le premier à partager vos pensées !
                </Text>
              </View>
            ) : (
              sortedComments.map((comment) => (
                <View key={comment.id} style={styles.commentCard}>
                  <View style={styles.commentContent}>
                    <View style={styles.commentHeader}>
                      <TouchableOpacity
                        onPress={() => {
                          (navigation as any).navigate('AuthorCarnet', {
                            authorName: comment.user.name,
                          });
                        }}
                      >
                        <Text
                          style={[
                            styles.commentAuthorName,
                            { fontFamily: typography.fonts.dancingScript },
                          ]}
                        >
                          {comment.user.name}
                        </Text>
                      </TouchableOpacity>
                      <Text style={styles.commentDate}>
                        · {comment.timestamp ? getRelativeTime(comment.timestamp) : comment.date}
                      </Text>
                    </View>
                    <Text
                      style={[
                        styles.commentText,
                        { fontFamily: typography.fonts.lora },
                      ]}
                    >
                      {comment.content}
                    </Text>
                  </View>
                  <View style={styles.commentActions}>
                    {comment.user.name === currentUser && (
                      <TouchableOpacity
                        onPress={() => setDeleteCommentId(comment.id)}
                        style={styles.actionButton}
                      >
                        <Trash2 size={16} color={colors.mutedForeground} />
                      </TouchableOpacity>
                    )}
                    <TouchableOpacity
                      onPress={() => setReportingCommentId(comment.id)}
                      style={styles.actionButton}
                    >
                      <Flag size={16} color={colors.mutedForeground} />
                    </TouchableOpacity>
                  </View>
                </View>
              ))
            )}
          </View>
        </ScrollView>
      </View>

      {/* Delete Comment Dialog */}
      <AlertDialog
        open={deleteCommentId !== null}
        onOpenChange={(open) => !open && setDeleteCommentId(null)}
        title="Supprimer ce commentaire"
        description="Êtes-vous sûr de vouloir supprimer ce commentaire ? Cette action est irréversible."
        actionLabel="Supprimer"
        cancelLabel="Annuler"
        onAction={handleConfirmDeleteComment}
        variant="destructive"
      />

      {/* Report Dialog */}
      {reportingCommentId && (
        <ReportDialog
          open={reportingCommentId !== null}
          onOpenChange={(open) => !open && setReportingCommentId(null)}
          contentType="comment"
          contentId={reportingCommentId}
          textId={textId}
          reportedBy={currentUser}
          onReported={() => {
            toast.success('Contenu signalé');
            setReportingCommentId(null);
          }}
        />
      )}
    </KeyboardAvoidingView>
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
    gap: 8,
    marginBottom: 12,
  },
  backText: {
    fontSize: 14,
    color: colors.secondary,
    fontFamily: typography.fonts.lora,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconContainer: {
    width: responsive.width(40),
    height: responsive.height(40),
    borderRadius: responsive.radius(20),
    backgroundColor: `${colors.secondary}33`, // 20% opacity
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: getResponsiveFontSize(24),
    color: colors.foreground,
    flex: 1,
  },
  textScrollView: {
    maxHeight: responsive.screenHeight * 0.45, // 45vh
  },
  textScrollContent: {
    padding: getResponsivePadding(16),
  },
  textCard: {
    backgroundColor: colors.inputBackground,
    borderRadius: responsive.radius(8),
    padding: getResponsivePadding(16),
    borderWidth: 1,
    borderColor: 'rgba(59, 47, 47, 0.1)',
  },
  textLabel: {
    fontSize: getResponsiveFontSize(14),
    color: colors.mutedForeground,
    marginBottom: getResponsiveMargin(8),
    fontFamily: typography.fonts.lora,
  },
  authorName: {
    fontSize: getResponsiveFontSize(20),
    color: colors.foreground,
    marginBottom: getResponsiveMargin(8),
  },
  textTitle: {
    fontSize: getResponsiveFontSize(22),
    color: colors.foreground,
    marginTop: getResponsiveMargin(8),
    marginBottom: getResponsiveMargin(8),
  },
  textContent: {
    fontSize: getResponsiveFontSize(16),
    color: colors.foreground,
    marginTop: getResponsiveMargin(12),
    lineHeight: responsive.height(24),
    textAlign: 'justify',
  },
  discussionContainer: {
    flex: 1,
    borderTopWidth: 1,
    borderTopColor: 'rgba(59, 47, 47, 0.1)',
  },
  discussionScrollView: {
    flex: 1,
  },
  discussionScrollContent: {
    padding: getResponsivePadding(16),
    gap: getResponsiveMargin(16),
    paddingBottom: responsive.height(100), // Space for input container
  },
  commentInputCard: {
    backgroundColor: colors.card,
    borderRadius: responsive.radius(8),
    padding: getResponsivePadding(16),
    borderWidth: 1,
    borderColor: colors.border,
  },
  textarea: {
    minHeight: responsive.height(80),
    backgroundColor: colors.inputBackground,
    borderColor: colors.border,
  },
  submitButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: getResponsiveMargin(8),
  },
  submitButton: {
    backgroundColor: colors.secondary,
  },
  commentsList: {
    gap: getResponsiveMargin(12),
  },
  commentCard: {
    backgroundColor: colors.card,
    borderRadius: responsive.radius(8),
    padding: getResponsivePadding(16),
    borderWidth: 1,
    borderColor: colors.border,
    flexDirection: 'row',
    gap: getResponsiveMargin(12),
    flexWrap: responsive.isSmallDevice ? 'wrap' : 'nowrap',
  },
  commentContent: {
    flex: 1,
    minWidth: 0,
  },
  commentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 4,
  },
  commentAuthorName: {
    fontSize: getResponsiveFontSize(20),
    color: colors.foreground,
  },
  commentDate: {
    fontSize: getResponsiveFontSize(12),
    color: colors.mutedForeground,
    fontFamily: typography.fonts.lora,
  },
  commentText: {
    fontSize: getResponsiveFontSize(16),
    color: colors.foreground,
    textAlign: 'justify',
    lineHeight: responsive.height(24),
  },
  commentActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  actionButton: {
    padding: 4,
  },
  emptyComments: {
    alignItems: 'center',
    paddingVertical: responsive.height(32),
    paddingHorizontal: getResponsivePadding(16),
    backgroundColor: colors.card,
    borderRadius: responsive.radius(8),
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: colors.border,
  },
  emptyIcon: {
    fontSize: getResponsiveFontSize(48),
    marginBottom: getResponsiveMargin(12),
    opacity: 0.3,
  },
  emptyText: {
    fontSize: getResponsiveFontSize(16),
    color: colors.mutedForeground,
    marginBottom: getResponsiveMargin(4),
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: getResponsiveFontSize(14),
    color: colors.mutedForeground,
    textAlign: 'center',
  },
});
