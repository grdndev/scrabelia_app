import React from 'react';
import { Text, StyleSheet, ViewStyle } from 'react-native';
import { colors } from '../../theme/colors';

interface IconProps {
  size?: number;
  color?: string;
  style?: ViewStyle;
}

// Icônes simples utilisant des emojis/symboles Unicode
// Pour des icônes plus avancées, installez react-native-vector-icons

export const ArrowLeft: React.FC<IconProps> = ({
  size = 24,
  color = colors.foreground,
  style,
}) => {
  return (
    <Text style={[styles.icon, { fontSize: size, color }, style]}>
      ←
    </Text>
  );
};

export const Leaf: React.FC<IconProps> = ({
  size = 24,
  color = colors.foreground,
  style,
}) => {
  return (
    <Text style={[styles.icon, { fontSize: size, color }, style]}>
      🍃
    </Text>
  );
};

export const Trash2: React.FC<IconProps> = ({
  size = 24,
  color = colors.foreground,
  style,
}) => {
  return (
    <Text style={[styles.icon, { fontSize: size, color }, style]}>
      🗑️
    </Text>
  );
};

export const Flag: React.FC<IconProps> = ({
  size = 24,
  color = colors.foreground,
  style,
}) => {
  return (
    <Text style={[styles.icon, { fontSize: size, color }, style]}>
      🚩
    </Text>
  );
};

export const X: React.FC<IconProps> = ({
  size = 24,
  color = colors.foreground,
  style,
}) => {
  return (
    <Text style={[styles.icon, { fontSize: size, color }, style]}>
      ✕
    </Text>
  );
};

export const Mic: React.FC<IconProps> = ({
  size = 24,
  color = colors.foreground,
  style,
}) => {
  return (
    <Text style={[styles.icon, { fontSize: size, color }, style]}>
      🎤
    </Text>
  );
};

export const Square: React.FC<IconProps> = ({
  size = 24,
  color = colors.foreground,
  style,
}) => {
  return (
    <Text style={[styles.icon, { fontSize: size, color }, style]}>
      ⏹
    </Text>
  );
};

export const Play: React.FC<IconProps> = ({
  size = 24,
  color = colors.foreground,
  style,
}) => {
  return (
    <Text style={[styles.icon, { fontSize: size, color }, style]}>
      ▶
    </Text>
  );
};

export const MapPin: React.FC<IconProps> = ({
  size = 24,
  color = colors.foreground,
  style,
}) => {
  return (
    <Text style={[styles.icon, { fontSize: size, color }, style]}>
      📍
    </Text>
  );
};

export const UserCircle: React.FC<IconProps> = ({
  size = 24,
  color = colors.foreground,
  style,
}) => {
  return (
    <Text style={[styles.icon, { fontSize: size, color }, style]}>
      👤
    </Text>
  );
};

export const UserPlus: React.FC<IconProps> = ({
  size = 24,
  color = colors.foreground,
  style,
}) => {
  return (
    <Text style={[styles.icon, { fontSize: size, color }, style]}>
      ➕
    </Text>
  );
};

export const Heart: React.FC<IconProps> = ({
  size = 24,
  color = colors.foreground,
  style,
}) => {
  return (
    <Text style={[styles.icon, { fontSize: size, color }, style]}>
      ❤️
    </Text>
  );
};

export const Check: React.FC<IconProps> = ({
  size = 24,
  color = colors.foreground,
  style,
}) => {
  return (
    <Text style={[styles.icon, { fontSize: size, color }, style]}>
      ✓
    </Text>
  );
};

export const Edit2: React.FC<IconProps> = ({
  size = 24,
  color = colors.foreground,
  style,
}) => {
  return (
    <Text style={[styles.icon, { fontSize: size, color }, style]}>
      ✏️
    </Text>
  );
};

const styles = StyleSheet.create({
  icon: {
    textAlign: 'center',
  },
});

