import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Dialog } from './ui/Dialog';
import { Input } from './ui/Input';
import { Button } from './ui/Button';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { toast } from '../utils/toast';
import { supabase } from '../utils/supabase/client';

interface ForgotPasswordDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ForgotPasswordDialog: React.FC<ForgotPasswordDialogProps> = ({
  open,
  onOpenChange,
}) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleResetPassword = async () => {
    if (!email.trim()) {
      toast.error('Veuillez entrer votre email');
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: 'scrabelia://reset-password',
      });

      if (error) throw error;

      toast.success('Email de réinitialisation envoyé !');
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
      title="Mot de passe oublié"
      description="Entrez votre email pour recevoir un lien de réinitialisation"
      footer={
        <View style={styles.footer}>
          <Button variant="outline" onPress={() => onOpenChange(false)}>
            Annuler
          </Button>
          <Button
            onPress={handleResetPassword}
            loading={loading}
            disabled={!email.trim()}
          >
            Envoyer
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


