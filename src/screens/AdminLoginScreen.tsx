import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { toast } from '../utils/toast';
import * as api from '../utils/supabase/api';
import { responsive, getResponsiveFontSize, getResponsivePadding, getResponsiveMargin } from '../utils/responsive';

export const AdminLoginScreen: React.FC = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      toast.error('Veuillez remplir tous les champs');
      return;
    }

    setLoading(true);
    try {
      const result = await api.login(email, password);
      if (result.success && result.session) {
        const adminStatus = await api.checkAdminStatus(result.session.access_token);
        if (adminStatus.isAdmin) {
          toast.success('Connexion admin réussie');
          (navigation as any).navigate('AdminDashboard');
        } else {
          toast.error('Accès admin refusé');
        }
      }
    } catch (error: any) {
      console.error('Erreur:', error);
      toast.error(error.message || 'Erreur de connexion');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: Math.max(insets.top, getResponsivePadding(20)) },
        ]}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.content}>
          <Text
            style={[
              styles.title,
              { fontFamily: typography.fonts.dancingScript },
            ]}
          >
            Admin Scrabelia
          </Text>
          <Text
            style={[
              styles.subtitle,
              { fontFamily: typography.fonts.lora },
            ]}
          >
            Connexion administrateur
          </Text>

          <Input
            label="Email"
            value={email}
            onChangeText={setEmail}
            placeholder="admin@scrabelia.com"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />

          <Input
            label="Mot de passe"
            value={password}
            onChangeText={setPassword}
            placeholder="••••••••"
            secureTextEntry
          />

          <Button onPress={handleLogin} loading={loading} style={styles.button}>
            Se connecter
          </Button>

          <Button
            variant="ghost"
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            Retour
          </Button>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: getResponsivePadding(20),
    paddingBottom: getResponsivePadding(20),
  },
  content: {
    width: '100%',
    maxWidth: responsive.isTablet ? 500 : 400,
    alignSelf: 'center',
  },
  title: {
    fontSize: getResponsiveFontSize(32),
    fontWeight: typography.weights.bold,
    color: colors.foreground,
    textAlign: 'center',
    marginBottom: getResponsiveMargin(8),
    fontFamily: typography.fonts.dancingScript,
    lineHeight: responsive.height(48),
  },
  subtitle: {
    fontSize: getResponsiveFontSize(16),
    color: colors.mutedForeground,
    textAlign: 'center',
    marginBottom: getResponsiveMargin(32),
    lineHeight: responsive.height(24),
  },
  button: {
    marginTop: getResponsiveMargin(16),
  },
  backButton: {
    marginTop: getResponsiveMargin(12),
  },
});

