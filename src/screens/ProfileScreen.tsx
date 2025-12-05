import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useScribela } from '../contexts/ScribelaContext';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Avatar } from '../components/ui/Avatar';
import { Button } from '../components/ui/Button';
import { Separator } from '../components/ui/Separator';
import { Dialog } from '../components/ui/Dialog';
import { Textarea } from '../components/ui/Textarea';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { toast } from '../utils/toast';
import { responsive, getResponsiveFontSize, getResponsivePadding, getResponsiveMargin } from '../utils/responsive';

export const ProfileScreen: React.FC = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const {
    currentUser,
    texts,
    mySubscribers,
    subscribedAuthors,
    updateAuthorBio,
    getAuthorBio,
  } = useScribela();

  const [bio, setBio] = useState('');
  const [bioDialogOpen, setBioDialogOpen] = useState(false);
  const [editingBio, setEditingBio] = useState('');

  React.useEffect(() => {
    loadBio();
  }, []);

  const loadBio = async () => {
    try {
      const authorBio = await getAuthorBio(currentUser);
      setBio(authorBio);
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  const handleSaveBio = async () => {
    try {
      await updateAuthorBio(currentUser, editingBio);
      setBio(editingBio);
      setBioDialogOpen(false);
      toast.success('Bio mise à jour');
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Erreur lors de la mise à jour');
    }
  };

  const myTexts = texts.filter((text) => text.author.name === currentUser);

  return (
    <ScrollView 
      style={styles.container}
      contentContainerStyle={{ paddingBottom: responsive.height(80) }} // Space for tab bar
    >
      {/* Header */}
      <View style={[styles.header, { paddingTop: Math.max(insets.top, getResponsivePadding(24)) }]}>
        <Avatar name={currentUser} size={responsive.width(80)} />
        <Text
          style={[
            styles.userName,
            { fontFamily: typography.fonts.dancingScript },
          ]}
        >
          {currentUser}
        </Text>
        <Button
          variant="outline"
          onPress={() => {
            setEditingBio(bio);
            setBioDialogOpen(true);
          }}
          style={styles.editButton}
        >
          Modifier la bio
        </Button>
      </View>

      {/* Bio */}
      {bio && (
        <Card style={styles.bioCard}>
          <CardContent>
            <Text
              style={[
                styles.bioText,
                { fontFamily: typography.fonts.lora },
              ]}
            >
              {bio}
            </Text>
          </CardContent>
        </Card>
      )}

      {/* Stats */}
      <View style={styles.stats}>
        <View style={styles.statItem}>
          <Text
            style={[
              styles.statValue,
              { fontFamily: typography.fonts.dancingScript },
            ]}
          >
            {myTexts.length}
          </Text>
          <Text
            style={[
              styles.statLabel,
              { fontFamily: typography.fonts.lora },
            ]}
          >
            Textes
          </Text>
        </View>
        <Separator orientation="vertical" style={styles.statSeparator} />
        <View style={styles.statItem}>
          <Text
            style={[
              styles.statValue,
              { fontFamily: typography.fonts.dancingScript },
            ]}
          >
            {mySubscribers.length}
          </Text>
          <Text
            style={[
              styles.statLabel,
              { fontFamily: typography.fonts.lora },
            ]}
          >
            Abonnés
          </Text>
        </View>
        <Separator orientation="vertical" style={styles.statSeparator} />
        <View style={styles.statItem}>
          <Text
            style={[
              styles.statValue,
              { fontFamily: typography.fonts.dancingScript },
            ]}
          >
            {subscribedAuthors.length}
          </Text>
          <Text
            style={[
              styles.statLabel,
              { fontFamily: typography.fonts.lora },
            ]}
          >
            Abonnements
          </Text>
        </View>
      </View>

      {/* Menu */}
      <View style={styles.menu}>
        <TouchableOpacity
          onPress={() => {
            (navigation as any).navigate('SubscriptionManager');
          }}
          style={styles.menuItem}
          activeOpacity={0.7}
        >
          <Text style={styles.menuIcon}>📋</Text>
          <Text
            style={[
              styles.menuLabel,
              { fontFamily: typography.fonts.lora },
            ]}
          >
            Mes abonnements
          </Text>
          <Text style={styles.menuArrow}>→</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            (navigation as any).navigate('AuthorCarnet', {
              authorName: currentUser,
            });
          }}
          style={styles.menuItem}
          activeOpacity={0.7}
        >
          <Text style={styles.menuIcon}>📖</Text>
          <Text
            style={[
              styles.menuLabel,
              { fontFamily: typography.fonts.lora },
            ]}
          >
            Mon carnet
          </Text>
          <Text style={styles.menuArrow}>→</Text>
        </TouchableOpacity>
      </View>

      <Dialog
        open={bioDialogOpen}
        onOpenChange={setBioDialogOpen}
        title="Modifier la bio"
        footer={
          <View style={styles.dialogFooter}>
            <Button
              variant="outline"
              onPress={() => setBioDialogOpen(false)}
            >
              Annuler
            </Button>
            <Button onPress={handleSaveBio}>Enregistrer</Button>
          </View>
        }
      >
        <Textarea
          label="Bio"
          value={editingBio}
          onChangeText={setEditingBio}
          placeholder="Décrivez-vous en quelques mots..."
          style={styles.bioTextarea}
          maxLength={300}
        />
        <Text
          style={[
            styles.charCount,
            { fontFamily: typography.fonts.lora },
          ]}
        >
          {editingBio.length}/300
        </Text>
      </Dialog>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    alignItems: 'center',
    paddingHorizontal: getResponsivePadding(24),
    paddingBottom: getResponsivePadding(24),
    backgroundColor: colors.card,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  userName: {
    fontSize: getResponsiveFontSize(28),
    fontWeight: typography.weights.medium,
    color: colors.foreground,
    marginTop: getResponsiveMargin(16),
    marginBottom: getResponsiveMargin(16),
    lineHeight: responsive.height(42),
    fontFamily: typography.fonts.dancingScript,
    textAlign: 'center',
  },
  editButton: {
    marginTop: getResponsiveMargin(8),
  },
  bioCard: {
    margin: getResponsiveMargin(16),
  },
  bioText: {
    fontSize: getResponsiveFontSize(16),
    color: colors.foreground,
    lineHeight: responsive.height(24),
    fontWeight: typography.weights.normal,
  },
  stats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: getResponsivePadding(24),
    paddingVertical: getResponsivePadding(24),
    backgroundColor: colors.card,
    marginVertical: getResponsiveMargin(16),
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: getResponsiveFontSize(32),
    fontWeight: typography.weights.semibold,
    color: colors.foreground,
    marginBottom: getResponsiveMargin(4),
    fontFamily: typography.fonts.dancingScript,
  },
  statLabel: {
    fontSize: getResponsiveFontSize(14),
    color: colors.mutedForeground,
  },
  statSeparator: {
    width: 1,
    height: responsive.height(40),
    alignSelf: 'center',
  },
  menu: {
    margin: getResponsiveMargin(16),
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: getResponsivePadding(16),
    backgroundColor: colors.card,
    borderRadius: responsive.radius(12),
    marginBottom: getResponsiveMargin(12),
    borderWidth: 1,
    borderColor: colors.border,
  },
  menuIcon: {
    fontSize: getResponsiveFontSize(24),
    marginRight: getResponsiveMargin(16),
  },
  menuLabel: {
    flex: 1,
    fontSize: getResponsiveFontSize(16),
    color: colors.foreground,
    lineHeight: responsive.height(24),
    fontWeight: typography.weights.normal,
  },
  menuArrow: {
    fontSize: getResponsiveFontSize(20),
    color: colors.mutedForeground,
  },
  dialogFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: getResponsiveMargin(12),
    marginTop: getResponsiveMargin(16),
    flexWrap: 'wrap',
  },
  bioTextarea: {
    minHeight: responsive.height(120),
  },
  charCount: {
    fontSize: getResponsiveFontSize(12),
    color: colors.mutedForeground,
    textAlign: 'right',
    marginTop: getResponsiveMargin(4),
  },
});

