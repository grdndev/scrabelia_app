import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Dialog } from './ui/Dialog';
import { Input } from './ui/Input';
import { Textarea } from './ui/Textarea';
import { Button } from './ui/Button';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { useScribela } from '../contexts/ScribelaContext';
import { toast } from '../utils/toast';

interface DonationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  authorName: string;
}

export const DonationDialog: React.FC<DonationDialogProps> = ({
  open,
  onOpenChange,
  authorName,
}) => {
  const { addDonation, currentUser } = useScribela();
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleDonate = async () => {
    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      toast.error('Montant invalide');
      return;
    }

    setLoading(true);
    try {
      await addDonation({
        name: currentUser,
        amount: amountNum,
        message: message.trim() || undefined,
        donatedAt: new Date(),
      });
      toast.success(`Don de ${amountNum}€ envoyé à ${authorName} !`);
      onOpenChange(false);
      setAmount('');
      setMessage('');
    } catch (error) {
      console.error('Erreur lors du don:', error);
      toast.error('Erreur lors du don');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
      title={`Faire un don à ${authorName}`}
      description="Montrez votre soutien avec un don. Votre message sera visible par l'auteur."
      footer={
        <View style={styles.footer}>
          <Input
            label="Montant (€)"
            value={amount}
            onChangeText={setAmount}
            keyboardType="decimal-pad"
            placeholder="10.00"
            style={styles.amountInput}
          />
          <Textarea
            label="Message (optionnel)"
            value={message}
            onChangeText={setMessage}
            placeholder="Votre message de soutien..."
            style={styles.messageInput}
          />
          <Button
            onPress={handleDonate}
            loading={loading}
            disabled={!amount}
            style={styles.donateButton}
          >
            Faire un don
          </Button>
        </View>
      }
    />
  );
};

const styles = StyleSheet.create({
  footer: {
    width: '100%',
  },
  amountInput: {
    marginBottom: 16,
  },
  messageInput: {
    marginBottom: 16,
    minHeight: 80,
  },
  donateButton: {
    alignSelf: 'flex-end',
  },
});


