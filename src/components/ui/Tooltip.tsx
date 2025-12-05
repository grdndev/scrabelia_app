import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';

interface TooltipProps {
  content: string;
  children: React.ReactNode;
  side?: 'top' | 'right' | 'bottom' | 'left';
}

export const Tooltip: React.FC<TooltipProps> = ({
  content,
  children,
  side = 'top',
}) => {
  const [visible, setVisible] = useState(false);

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPressIn={() => setVisible(true)}
        onPressOut={() => setVisible(false)}
        activeOpacity={1}
      >
        {children}
      </TouchableOpacity>
      {visible && (
        <View style={[
          styles.tooltip,
          side === 'top' && styles.tooltipTop,
          side === 'bottom' && styles.tooltipBottom,
          side === 'left' && styles.tooltipLeft,
          side === 'right' && styles.tooltipRight,
        ]}>
          <Text
            style={[
              styles.tooltipText,
              { fontFamily: typography.fonts.lora },
            ]}
          >
            {content}
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  tooltip: {
    position: 'absolute',
    backgroundColor: colors.foreground,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    zIndex: 1000,
  },
  tooltipTop: {
    bottom: '100%',
    marginBottom: 4,
    alignSelf: 'center',
  },
  tooltipBottom: {
    top: '100%',
    marginTop: 4,
    alignSelf: 'center',
  },
  tooltipLeft: {
    right: '100%',
    marginRight: 4,
    alignSelf: 'center',
  },
  tooltipRight: {
    left: '100%',
    marginLeft: 4,
    alignSelf: 'center',
  },
  tooltipText: {
    color: colors.background,
    fontSize: 12,
  },
});

