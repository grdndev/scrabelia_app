import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { AlertDialog } from './ui/AlertDialog';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import * as api from '../utils/supabase/api';

interface ReportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  contentType: 'comment' | 'circle_message' | 'duo_message';
  contentId: string;
  textId?: string;
  circleId?: string;
  duoName?: string;
  reportedBy?: string;
  onReported?: () => void;
}

const REPORT_REASONS = [
  'Contenu inapproprié',
  'Harcèlement',
  'Spam',
  'Contenu offensant',
  'Autre',
];

export const ReportDialog: React.FC<ReportDialogProps> = ({
  open,
  onOpenChange,
  contentType,
  contentId,
  textId,
  circleId,
  duoName,
  reportedBy,
  onReported,
}) => {
  const [selectedReason, setSelectedReason] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleReport = async () => {
    if (!selectedReason) return;

    setIsSubmitting(true);
    try {
      await api.createContentReport({
        contentType,
        contentId,
        textId,
        circleId,
        duoName,
        reason: selectedReason,
        reportedBy,
      });
      onReported?.();
      onOpenChange(false);
      setSelectedReason(null);
    } catch (error) {
      console.error('Erreur lors du signalement:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AlertDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Signaler ce contenu"
      description="Pourquoi signalez-vous ce contenu ?"
      actionLabel="Signaler"
      cancelLabel="Annuler"
      onAction={handleReport}
      variant="destructive"
    >
      <ScrollView style={styles.reasonsList}>
        {REPORT_REASONS.map((reason) => (
          <TouchableOpacity
            key={reason}
            style={[
              styles.reasonItem,
              selectedReason === reason && styles.reasonItemSelected,
            ]}
            onPress={() => setSelectedReason(reason)}
          >
            <Text
              style={[
                styles.reasonText,
                { fontFamily: typography.fonts.lora },
                selectedReason === reason && styles.reasonTextSelected,
              ]}
            >
              {reason}
            </Text>
            {selectedReason === reason && (
              <Text style={styles.checkmark}>✓</Text>
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>
    </AlertDialog>
  );
};

const styles = StyleSheet.create({
  reasonsList: {
    maxHeight: 200,
    marginBottom: 16,
  },
  reasonItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12, // p-3
    borderRadius: 6, // rounded-md
    marginBottom: 8, // mb-2
    backgroundColor: colors.inputBackground,
    borderWidth: 1,
    borderColor: colors.border,
  },
  reasonItemSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  reasonText: {
    fontSize: 16, // text-base
    color: colors.foreground,
    flex: 1,
    lineHeight: 24,
    fontWeight: typography.weights.normal,
  },
  reasonTextSelected: {
    color: colors.primaryForeground,
    fontWeight: typography.weights.semibold,
  },
  checkmark: {
    fontSize: 18,
    color: colors.primaryForeground,
    fontWeight: 'bold',
  },
});

