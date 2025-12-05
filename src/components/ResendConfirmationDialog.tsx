import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Dialog } from './ui/Dialog';
import { Input } from './ui/Input';
import { Button } from './ui/Button';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { toast } from '../utils/toast';
import * as api from '../utils/supabase/api';

interface ResendConfirmationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ResendConfirmationDialog: React.FC<ResendConfirmationDialogProps> = ({
  open,
  onOpenChange,
}) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleResend = async () => {
    if (!email.trim()) {
      toast.error('Veuillez entrer votre email');
      return;
    }

    setLoading(true);
    try {
      await api.resendConfirmationEmail(email);
      toast.success('Email de confirmation renvoyé !');
      onOpenChange(false);
      setEmail('');
    } catch (error: any) {
      console.error('Erreur:', error);
      toast.error(error.message || 'Erreur lors de l\'envoi');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
      title="Renvoyer l'email de confirmation"
      description="Entrez votre email pour recevoir à nouveau l'email de confirmation"
      footer={
        <View style={styles.footer}>
          <Button variant="outline" onPress={() => onOpenChange(false)}>
            Annuler
          </Button>
          <Button
            onPress={handleResend}
            loading={loading}
            disabled={!email.trim()}
          >
            Renvoyer
          </Button>
        </View>
      }
    >
      <Input
        label="Email"
        value={email}
        onChangeText={setEmail}
        placeholder="email@example.com"
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
      />
    </Dialog>
  );
};

const styles = StyleSheet.create({
  footer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
    marginTop: 16,
  },
});


