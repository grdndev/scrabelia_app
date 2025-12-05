import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';

interface NavItem {
  label: string;
  icon: string;
  route: string;
}

const navItems: NavItem[] = [
  { label: 'Accueil', icon: '🏠', route: 'Home' },
  { label: 'Canal', icon: '📢', route: 'ScribelaChannel' },
  { label: 'Cercles', icon: '👥', route: 'UserCircles' },
  { label: 'Résonances', icon: '✨', route: 'Resonances' },
  { label: 'Profil', icon: '👤', route: 'Profile' },
];

export const MobileNav: React.FC = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      {navItems.map((item) => (
        <TouchableOpacity
          key={item.route}
          onPress={() => {
            (navigation as any).navigate(item.route);
          }}
          style={styles.navItem}
          activeOpacity={0.7}
        >
          <Text style={styles.icon}>{item.icon}</Text>
          <Text
            style={[
              styles.label,
              { fontFamily: typography.fonts.lora },
            ]}
          >
            {item.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    backgroundColor: colors.card,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  navItem: {
    alignItems: 'center',
    flex: 1,
    paddingVertical: 4,
  },
  icon: {
    fontSize: 24,
    marginBottom: 4,
  },
  label: {
    fontSize: 12,
    color: colors.foreground,
  },
});


