import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { AlertDialog } from './ui/AlertDialog';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { useScribela } from '../contexts/ScribelaContext';
import { toast } from '../utils/toast';

interface UnsubscribeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  authorName: string;
}

export const UnsubscribeDialog: React.FC<UnsubscribeDialogProps> = ({
  open,
  onOpenChange,
  authorName,
}) => {
  const { removeSubscription } = useScribela();

  const handleUnsubscribe = async () => {
    try {
      await removeSubscription(authorName);
      toast.success(`Désabonnement de ${authorName} réussi`);
      onOpenChange(false);
    } catch (error) {
      console.error('Erreur lors du désabonnement:', error);
      toast.error('Erreur lors du désabonnement');
    }
  };

  return (
    <AlertDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Se désabonner"
      description={`Êtes-vous sûr de vouloir vous désabonner de ${authorName} ? Vous ne pourrez plus accéder à son contenu réservé aux abonnés.`}
      actionLabel="Se désabonner"
      cancelLabel="Annuler"
      onAction={handleUnsubscribe}
      variant="destructive"
    />
  );
};


