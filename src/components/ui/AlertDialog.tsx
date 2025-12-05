import React from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { Button } from './Button';

interface AlertDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  description?: string;
  children?: React.ReactNode;
  actionLabel?: string;
  cancelLabel?: string;
  onAction?: () => void;
  onCancel?: () => void;
  variant?: 'default' | 'destructive';
}

export const AlertDialog: React.FC<AlertDialogProps> = ({
  open,
  onOpenChange,
  title,
  description,
  children,
  actionLabel = 'Confirmer',
  cancelLabel = 'Annuler',
  onAction,
  onCancel,
  variant = 'default',
}) => {
  const handleAction = () => {
    onAction?.();
    onOpenChange(false);
  };

  const handleCancel = () => {
    onCancel?.();
    onOpenChange(false);
  };

  if (!open) return null;

  return (
    <Modal
      visible={open}
      transparent
      animationType="fade"
      onRequestClose={() => onOpenChange(false)}
    >
      <TouchableWithoutFeedback onPress={() => onOpenChange(false)}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={styles.content}>
              {title && (
                <Text
                  style={[
                    styles.title,
                    { fontFamily: typography.fonts.dancingScript },
                  ]}
                >
                  {title}
                </Text>
              )}
              {description && (
                <Text
                  style={[
                    styles.description,
                    { fontFamily: typography.fonts.lora },
                  ]}
                >
                  {description}
                </Text>
              )}
              {children}
              <View style={styles.footer}>
                <Button
                  variant="outline"
                  onPress={handleCancel}
                  style={styles.cancelButton}
                >
                  {cancelLabel}
                </Button>
                <Button
                  variant={variant === 'destructive' ? 'destructive' : 'default'}
                  onPress={handleAction}
                  style={styles.actionButton}
                >
                  {actionLabel}
                </Button>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  content: {
    backgroundColor: colors.card,
    borderRadius: 12, // rounded-xl
    padding: 24, // p-6
    width: '100%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  title: {
    fontSize: 18, // text-lg
    fontWeight: typography.weights.medium,
    color: colors.foreground,
    marginBottom: 12,
    lineHeight: 27,
    fontFamily: typography.fonts.dancingScript,
  },
  description: {
    fontSize: 16, // text-base
    color: colors.mutedForeground,
    marginBottom: 24,
    lineHeight: 24, // line-height: 1.5
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
    marginTop: 8,
  },
  cancelButton: {
    flex: 1,
  },
  actionButton: {
    flex: 1,
  },
});

