import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Dialog } from './ui/Dialog';
import { Button } from './ui/Button';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';

interface PrivacyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const PrivacyDialog: React.FC<PrivacyDialogProps> = ({
  open,
  onOpenChange,
}) => {
  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
      title="Politique de confidentialité"
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
          <Text style={styles.sectionTitle}>1. Collecte des données{'\n\n'}</Text>
          Scrabelia collecte uniquement les données nécessaires au fonctionnement
          de l'application : nom d'auteur, email, et contenus publiés.
        </Text>

        <Text
          style={[
            styles.section,
            { fontFamily: typography.fonts.lora },
          ]}
        >
          <Text style={styles.sectionTitle}>2. Utilisation des données{'\n\n'}</Text>
          Vos données sont utilisées uniquement pour vous permettre de publier,
          commenter et interagir avec la communauté Scrabelia.
        </Text>

        <Text
          style={[
            styles.section,
            { fontFamily: typography.fonts.lora },
          ]}
        >
          <Text style={styles.sectionTitle}>3. Partage des données{'\n\n'}</Text>
          Vos données ne sont jamais partagées avec des tiers sans votre
          consentement explicite.
        </Text>

        <Text
          style={[
            styles.section,
            { fontFamily: typography.fonts.lora },
          ]}
        >
          <Text style={styles.sectionTitle}>4. Vos droits{'\n\n'}</Text>
          Vous avez le droit d'accéder, modifier ou supprimer vos données à tout
          moment depuis votre profil.
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

