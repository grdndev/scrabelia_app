import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Dialog } from './ui/Dialog';
import { Button } from './ui/Button';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';

interface TermsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const TermsDialog: React.FC<TermsDialogProps> = ({
  open,
  onOpenChange,
}) => {
  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
      title="Conditions d'utilisation"
      footer={
        <Button onPress={() => onOpenChange(false)}>Fermer</Button>
      }
    >
      <ScrollView style={styles.content}>
        <Text
          style={[
            styles.section,
            { fontFamily: typography.fonts.lora },
          ]}
        >
          <Text style={styles.sectionTitle}>1. Acceptation des conditions{'\n\n'}</Text>
          En utilisant Scrabelia, vous acceptez ces conditions d'utilisation.
        </Text>

        <Text
          style={[
            styles.section,
            { fontFamily: typography.fonts.lora },
          ]}
        >
          <Text style={styles.sectionTitle}>2. Contenu utilisateur{'\n\n'}</Text>
          Vous êtes responsable du contenu que vous publiez. Scrabelia se réserve
          le droit de modérer ou supprimer tout contenu inapproprié.
        </Text>

        <Text
          style={[
            styles.section,
            { fontFamily: typography.fonts.lora },
          ]}
        >
          <Text style={styles.sectionTitle}>3. Propriété intellectuelle{'\n\n'}</Text>
          Vous conservez tous les droits sur vos créations. En publiant sur
          Scrabelia, vous accordez une licence d'affichage à la plateforme.
        </Text>

        <Text
          style={[
            styles.section,
            { fontFamily: typography.fonts.lora },
          ]}
        >
          <Text style={styles.sectionTitle}>4. Abonnements{'\n\n'}</Text>
          Les abonnements sont mensuels et renouvelables automatiquement. Vous
          pouvez vous désabonner à tout moment.
        </Text>
      </ScrollView>
    </Dialog>
  );
};

const styles = StyleSheet.create({
  content: {
    maxHeight: 400,
  },
  section: {
    fontSize: 16, // text-base
    color: colors.foreground,
    lineHeight: 24, // line-height: 1.5
    marginBottom: 24, // mb-6
    fontWeight: typography.weights.normal,
  },
  sectionTitle: {
    fontSize: 18, // text-lg
    fontWeight: typography.weights.medium,
    color: colors.foreground,
    lineHeight: 27, // line-height: 1.5
  },
});

