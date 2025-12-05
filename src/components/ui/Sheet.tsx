import React from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  ScrollView,
  Animated,
} from 'react-native';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';

interface SheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
  side?: 'top' | 'right' | 'bottom' | 'left';
  title?: string;
}

export const Sheet: React.FC<SheetProps> = ({
  open,
  onOpenChange,
  children,
  side = 'bottom',
  title,
}) => {
  const slideAnim = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    if (open) {
      Animated.spring(slideAnim, {
        toValue: 1,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  }, [open, slideAnim]);

  if (!open) return null;

  const getSlideStyle = () => {
    const translateValue = slideAnim.interpolate({
      inputRange: [0, 1],
      outputRange: side === 'bottom' ? [300, 0] : side === 'top' ? [-300, 0] : side === 'right' ? [300, 0] : [-300, 0],
    });

    const baseStyle: any = {
      transform: side === 'bottom' || side === 'top' 
        ? [{ translateY: translateValue }] 
        : [{ translateX: translateValue }],
      position: 'absolute' as const,
    };

    if (side === 'bottom' || side === 'top') {
      baseStyle[side] = 0;
      baseStyle.left = 0;
      baseStyle.right = 0;
      baseStyle.borderTopLeftRadius = side === 'bottom' ? 20 : 0;
      baseStyle.borderTopRightRadius = side === 'bottom' ? 20 : 0;
      baseStyle.borderBottomLeftRadius = side === 'top' ? 20 : 0;
      baseStyle.borderBottomRightRadius = side === 'top' ? 20 : 0;
    } else {
      baseStyle[side] = 0;
      baseStyle.top = 0;
      baseStyle.bottom = 0;
      baseStyle.width = '75%';
      baseStyle.borderTopLeftRadius = side === 'right' ? 0 : 20;
      baseStyle.borderBottomLeftRadius = side === 'right' ? 0 : 20;
      baseStyle.borderTopRightRadius = side === 'left' ? 0 : 20;
      baseStyle.borderBottomRightRadius = side === 'left' ? 0 : 20;
    }

    return baseStyle;
  };

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
            <Animated.View style={[styles.sheet, getSlideStyle()]}>
              {title && (
                <View style={styles.header}>
                  <Text
                    style={[
                      styles.title,
                      { fontFamily: typography.fonts.dancingScript },
                    ]}
                  >
                    {title}
                  </Text>
                  <TouchableOpacity
                    onPress={() => onOpenChange(false)}
                    style={styles.closeButton}
                  >
                    <Text style={styles.closeText}>✕</Text>
                  </TouchableOpacity>
                </View>
              )}
              <ScrollView style={styles.content}>{children}</ScrollView>
            </Animated.View>
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
  },
  sheet: {
    backgroundColor: colors.card,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    maxHeight: '80%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.foreground,
  },
  closeButton: {
    padding: 4,
  },
  closeText: {
    fontSize: 24,
    color: colors.mutedForeground,
  },
  content: {
    padding: 16,
  },
});

