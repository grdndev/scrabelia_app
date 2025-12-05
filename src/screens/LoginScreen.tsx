import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Image,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Button } from '../components/ui/Button';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { toast } from '../utils/toast';
import * as authApi from '../utils/supabase/api';
import { ForgotPasswordDialog } from '../components/ForgotPasswordDialog';
import { ResendConfirmationDialog } from '../components/ResendConfirmationDialog';
import { PrivacyDialog } from '../components/PrivacyDialog';
import { TermsDialog } from '../components/TermsDialog';
import { responsive, getResponsiveFontSize, getResponsivePadding, getResponsiveMargin } from '../utils/responsive';

interface LoginScreenProps {
  onLogin: (username: string) => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
  const insets = useSafeAreaInsets();
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [showResendConfirmation, setShowResendConfirmation] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [authorNameAvailable, setAuthorNameAvailable] = useState<boolean | null>(null);
  const [checkingAuthorName, setCheckingAuthorName] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  // Vérifier la disponibilité du nom d'auteur en temps réel (debounced)
  useEffect(() => {
    if (!isSignUp || !formData.name.trim()) {
      setAuthorNameAvailable(null);
      return;
    }

    const timer = setTimeout(async () => {
      setCheckingAuthorName(true);
      try {
        const response = await authApi.checkAuthorNameAvailability(formData.name.trim());
        setAuthorNameAvailable(response.available);
      } catch (error) {
        console.error('Erreur vérification nom d\'auteur:', error);
      } finally {
        setCheckingAuthorName(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [formData.name, isSignUp]);

  const handleSubmit = async () => {
    setIsLoading(true);

    try {
      if (isSignUp) {
        if (!formData.name.trim()) {
          toast.error('Veuillez entrer votre nom d\'auteur');
          return;
        }

        if (authorNameAvailable === false) {
          toast.error('Ce nom d\'auteur est déjà pris. Veuillez en choisir un autre.');
          return;
        }

        if (!formData.email.trim()) {
          toast.error('Veuillez entrer votre email');
          return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email.trim())) {
          toast.error('Veuillez entrer une adresse email valide');
          return;
        }

        if (formData.password.length < 6) {
          toast.error('Le mot de passe doit contenir au moins 6 caractères');
          return;
        }

        if (formData.password !== formData.confirmPassword) {
          toast.error('Les mots de passe ne correspondent pas');
          return;
        }

        const response = await authApi.signup(
          formData.email.trim(),
          formData.password,
          formData.name.trim()
        );

        if (response.success) {
          toast.success('Bienvenue sur Scribela !');
          onLogin(response.user.authorName);
        } else {
          toast.error('Erreur lors de l\'inscription');
        }
      } else {
        if (!formData.email.trim()) {
          toast.error('Veuillez entrer votre email');
          return;
        }

        if (!formData.password.trim()) {
          toast.error('Veuillez entrer votre mot de passe');
          return;
        }

        const response = await authApi.login(
          formData.email.trim(),
          formData.password
        );

        if (response.success) {
          toast.success('Connexion réussie !');
          onLogin(response.user.authorName);
        } else {
          toast.error('Email ou mot de passe incorrect');
        }
      }
    } catch (error: any) {
      console.error('Erreur auth:', error);
      toast.error(error.message || 'Une erreur est survenue');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMode = () => {
    setIsSignUp(!isSignUp);
    setAuthorNameAvailable(null);
    setFormData({
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    });
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
    >
      <LinearGradient
        colors={['#F9F6F1', '#F9F6F1', 'rgba(232, 194, 123, 0.2)']}
        style={StyleSheet.absoluteFill}
      />
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: Math.max(insets.top, getResponsivePadding(16)) },
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          {/* Logo et titre */}
          <View style={styles.logoContainer}>
            <View style={styles.logoWrapper}>
              <Text style={styles.logoEmoji}>📝</Text>
            </View>
            <Text
              style={[
                styles.title,
                { fontFamily: typography.fonts.dancingScript },
              ]}
            >
              Scribela
            </Text>
            <Text
              style={[
                styles.subtitle,
                { fontFamily: typography.fonts.georgia },
              ]}
            >
              L'écho de nos mondes intérieurs
            </Text>
          </View>

          {/* Formulaire */}
          <View style={styles.formContainer}>
            <Text
              style={[
                styles.formTitle,
                { fontFamily: typography.fonts.dancingScript },
              ]}
            >
              {isSignUp ? 'Créer un compte' : 'Connexion'}
            </Text>

            {isSignUp && (
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Nom d'auteur</Text>
                <View style={styles.inputWrapper}>
                  <Text style={styles.inputIcon}>👤</Text>
                  <TextInput
                    style={styles.input}
                    value={formData.name}
                    onChangeText={(text) => setFormData({ ...formData, name: text })}
                    placeholder="Votre nom d'auteur (ex: Marie Sarah)"
                    placeholderTextColor={colors.mutedForeground}
                  />
                  {formData.name.trim() && (
                    <View style={styles.checkIcon}>
                      {checkingAuthorName ? (
                        <Text style={styles.spinner}>⟳</Text>
                      ) : authorNameAvailable === true ? (
                        <Text style={styles.checkMark}>✓</Text>
                      ) : authorNameAvailable === false ? (
                        <Text style={styles.xMark}>✗</Text>
                      ) : null}
                    </View>
                  )}
                </View>
                {formData.name.trim() && authorNameAvailable === false && (
                  <Text style={styles.errorText}>
                    Ce nom d'auteur est déjà pris
                  </Text>
                )}
                {formData.name.trim() && authorNameAvailable === true && (
                  <Text style={styles.successText}>
                    Ce nom d'auteur est disponible
                  </Text>
                )}
              </View>
            )}

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email</Text>
              <View style={styles.inputWrapper}>
                <Text style={styles.inputIcon}>✉</Text>
                <TextInput
                  style={styles.input}
                  value={formData.email}
                  onChangeText={(text) => setFormData({ ...formData, email: text })}
                  placeholder="votre@email.com"
                  placeholderTextColor={colors.mutedForeground}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Mot de passe</Text>
              <View style={styles.inputWrapper}>
                <Text style={styles.inputIcon}>🔒</Text>
                <TextInput
                  style={styles.input}
                  value={formData.password}
                  onChangeText={(text) => setFormData({ ...formData, password: text })}
                  placeholder="••••••••"
                  placeholderTextColor={colors.mutedForeground}
                  secureTextEntry={!showPassword}
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  style={styles.eyeButton}
                >
                  <Text>{showPassword ? '👁️' : '👁️‍🗨️'}</Text>
                </TouchableOpacity>
              </View>
            </View>

            {isSignUp && (
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Confirmer le mot de passe</Text>
                <View style={styles.inputWrapper}>
                  <Text style={styles.inputIcon}>🔒</Text>
                  <TextInput
                    style={styles.input}
                    value={formData.confirmPassword}
                    onChangeText={(text) => setFormData({ ...formData, confirmPassword: text })}
                    placeholder="••••••••"
                    placeholderTextColor={colors.mutedForeground}
                    secureTextEntry={!showPassword}
                  />
                </View>
              </View>
            )}

            {!isSignUp && (
              <View style={styles.linksRow}>
                <TouchableOpacity
                  onPress={() => setShowResendConfirmation(true)}
                  style={styles.link}
                >
                  <Text style={styles.linkText}>Email non reçu ?</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setShowForgotPassword(true)}
                  style={styles.link}
                >
                  <Text style={styles.linkText}>Mot de passe oublié ?</Text>
                </TouchableOpacity>
              </View>
            )}

            <TouchableOpacity
              onPress={handleSubmit}
              disabled={isLoading || (isSignUp && authorNameAvailable === false)}
              style={[
                styles.submitButton,
                (isLoading || (isSignUp && authorNameAvailable === false)) && styles.submitButtonDisabled,
              ]}
            >
              <LinearGradient
                colors={['#A8B5A2', '#B0C4C8']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.gradient}
              >
                {isLoading ? (
                  <View style={styles.loadingContainer}>
                    <Text style={styles.spinner}>⟳</Text>
                    <Text style={styles.buttonText}>
                      {isSignUp ? 'Création...' : 'Connexion...'}
                    </Text>
                  </View>
                ) : (
                  <Text style={styles.buttonText}>
                    {isSignUp ? 'Créer mon compte' : 'Se connecter'}
                  </Text>
                )}
              </LinearGradient>
            </TouchableOpacity>
          </View>

          <View style={styles.switchContainer}>
            <Text style={styles.switchText}>
              {isSignUp ? 'Vous avez déjà un compte ?' : 'Pas encore de compte ?'}
              {' '}
              <Text style={styles.switchLink} onPress={toggleMode}>
                {isSignUp ? 'Se connecter' : "S'inscrire"}
              </Text>
            </Text>
          </View>

          {/* Citation */}
          <View style={styles.quoteContainer}>
            <Text style={styles.quote}>
              "Ecris en toute authenticité"
            </Text>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>
              En vous connectant, vous acceptez nos{' '}
              <Text style={styles.footerLink} onPress={() => setShowTerms(true)}>
                conditions d'utilisation
              </Text>
              {' '}et notre{' '}
              <Text style={styles.footerLink} onPress={() => setShowPrivacy(true)}>
                politique de confidentialité
              </Text>
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Dialogs */}
      <TermsDialog open={showTerms} onOpenChange={setShowTerms} />
      <PrivacyDialog open={showPrivacy} onOpenChange={setShowPrivacy} />
      <ForgotPasswordDialog open={showForgotPassword} onOpenChange={setShowForgotPassword} />
      <ResendConfirmationDialog open={showResendConfirmation} onOpenChange={setShowResendConfirmation} />
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 16,
  },
  content: {
    width: '100%',
    maxWidth: responsive.isTablet ? 500 : 400,
    alignSelf: 'center',
    paddingHorizontal: getResponsivePadding(16),
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: getResponsiveMargin(32),
    paddingVertical: getResponsivePadding(10),
  },
  logoWrapper: {
    width: responsive.width(160),
    height: responsive.height(160),
    maxWidth: responsive.screenWidth * 0.4,
    maxHeight: responsive.screenHeight * 0.2,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: getResponsiveMargin(4),
  },
  logoEmoji: {
    fontSize: getResponsiveFontSize(80),
  },
  title: {
    fontSize: getResponsiveFontSize(48),
    color: colors.foreground,
    marginBottom: getResponsiveMargin(4),
  },
  subtitle: {
    fontSize: getResponsiveFontSize(16),
    color: colors.mutedForeground,
    lineHeight: responsive.height(24),
    paddingHorizontal: getResponsivePadding(16),
  },
  formContainer: {
    backgroundColor: colors.card,
    borderRadius: responsive.radius(16),
    padding: getResponsivePadding(24),
    marginBottom: getResponsiveMargin(24),
    marginHorizontal: getResponsivePadding(16),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 10,
    borderWidth: 1,
    borderColor: colors.border,
    maxWidth: responsive.isTablet ? 500 : '100%',
    alignSelf: 'center',
    width: '100%',
  },
  formTitle: {
    fontSize: getResponsiveFontSize(28),
    color: colors.foreground,
    textAlign: 'center',
    marginBottom: getResponsiveMargin(12),
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: colors.mutedForeground,
    marginBottom: 8,
    fontFamily: typography.fonts.lora,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },
  inputIcon: {
    position: 'absolute',
    left: 12,
    fontSize: 20,
    zIndex: 1,
  },
  input: {
    flex: 1,
    height: responsive.height(48),
    minHeight: responsive.isSmallDevice ? 44 : responsive.height(48),
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: responsive.radius(6),
    paddingLeft: responsive.width(40),
    paddingRight: responsive.width(40),
    paddingVertical: getResponsivePadding(12),
    fontSize: getResponsiveFontSize(16),
    backgroundColor: colors.inputBackground,
    color: colors.foreground,
    fontFamily: typography.fonts.lora,
  },
  checkIcon: {
    position: 'absolute',
    right: 12,
  },
  spinner: {
    fontSize: 20,
    color: colors.mutedForeground,
  },
  checkMark: {
    fontSize: 20,
    color: '#22c55e',
  },
  xMark: {
    fontSize: 20,
    color: colors.destructive,
  },
  eyeButton: {
    position: 'absolute',
    right: 12,
    padding: 4,
  },
  errorText: {
    fontSize: 12,
    color: colors.destructive,
    marginTop: 4,
    fontFamily: typography.fonts.lora,
  },
  successText: {
    fontSize: 12,
    color: '#22c55e',
    marginTop: 4,
    fontFamily: typography.fonts.lora,
  },
  linksRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  link: {
    padding: 4,
  },
  linkText: {
    fontSize: 14,
    color: colors.secondary,
    fontFamily: typography.fonts.lora,
  },
  submitButton: {
    borderRadius: 6,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  submitButtonDisabled: {
    opacity: 0.5,
  },
  gradient: {
    height: 48, // h-12
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: typography.weights.medium,
    fontFamily: typography.fonts.lora,
  },
  switchContainer: {
    marginTop: 24,
    alignItems: 'center',
  },
  switchText: {
    fontSize: 14,
    color: colors.mutedForeground,
    fontFamily: typography.fonts.lora,
  },
  switchLink: {
    color: colors.secondary,
    fontWeight: typography.weights.medium,
  },
  quoteContainer: {
    marginTop: 32,
    alignItems: 'center',
  },
  quote: {
    fontSize: 16,
    color: colors.mutedForeground,
    fontStyle: 'italic',
    lineHeight: 24,
    fontFamily: typography.fonts.lora,
  },
  footer: {
    marginTop: 32,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: colors.mutedForeground,
    textAlign: 'center',
    fontFamily: typography.fonts.lora,
  },
  footerLink: {
    color: colors.secondary,
  },
});
