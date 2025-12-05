import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Dialog } from './ui/Dialog';
import { Input } from './ui/Input';
import { Button } from './ui/Button';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { useScribela } from '../contexts/ScribelaContext';
import { toast } from '../utils/toast';

interface SubscriptionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  authorName: string;
  currentPrice?: number;
}

export const SubscriptionDialog: React.FC<SubscriptionDialogProps> = ({
  open,
  onOpenChange,
  authorName,
  currentPrice,
}) => {
  const { addSubscription, subscribedAuthors } = useScribela();
  const [price, setPrice] = useState(currentPrice?.toString() || '3.99');
  const [loading, setLoading] = useState(false);

  const isSubscribed = subscribedAuthors.some(
    (sub) => sub.authorName === authorName
  );

  const handleSubscribe = async () => {
    const priceNum = parseFloat(price);
    if (isNaN(priceNum) || priceNum <= 0) {
      toast.error('Prix invalide');
      return;
    }

    setLoading(true);
    try {
      await addSubscription(authorName, priceNum);
      toast.success(`Abonnement à ${authorName} activé !`);
      onOpenChange(false);
      setPrice('3.99');
    } catch (error) {
      console.error('Erreur lors de l\'abonnement:', error);
      toast.error('Erreur lors de l\'abonnement');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
      title={isSubscribed ? 'Déjà abonné' : `S'abonner à ${authorName}`}
      description={
        isSubscribed
          ? `Vous êtes déjà abonné à ${authorName}.`
          : `Choisissez le montant de votre abonnement mensuel à ${authorName}.`
      }
      footer={
        !isSubscribed && (
          <View style={styles.footer}>
            <Input
              label="Prix mensuel (€)"
              value={price}
              onChangeText={setPrice}
              keyboardType="decimal-pad"
              style={styles.priceInput}
            />
            <Button
              onPress={handleSubscribe}
              loading={loading}
              style={styles.subscribeButton}
            >
              S'abonner
            </Button>
          </View>
        )
      }
    />
  );
};

const styles = StyleSheet.create({
  footer: {
    width: '100%',
  },
  priceInput: {
    marginBottom: 16,
  },
  subscribeButton: {
    alignSelf: 'flex-end',
  },
});


