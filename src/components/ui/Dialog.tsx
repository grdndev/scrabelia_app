import React from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  ScrollView,
} from 'react-native';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';

interface DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  description?: string;
  children?: React.ReactNode;
  footer?: React.ReactNode;
}

export const Dialog: React.FC<DialogProps> = ({
  open,
  onOpenChange,
  title,
  description,
  children,
  footer,
}) => {
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
              {children && (
                <ScrollView style={styles.children}>{children}</ScrollView>
              )}
              {footer && <View style={styles.footer}>{footer}</View>}
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
    maxWidth: 500,
    maxHeight: '80%',
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
    lineHeight: 27, // line-height: 1.5
    fontFamily: typography.fonts.dancingScript,
  },
  description: {
    fontSize: 16, // text-base
    color: colors.mutedForeground,
    marginBottom: 16,
    lineHeight: 24, // line-height: 1.5
  },
  children: {
    maxHeight: 400,
  },
  footer: {
    marginTop: 24,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
  },
});

