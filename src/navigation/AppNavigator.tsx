import React from 'react';
import { Text, View, TouchableOpacity } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useNavigation } from '@react-navigation/native';
import { HomeScreen } from '../screens/HomeScreen';
import { GardenScreen } from '../screens/GardenScreen';
import { CreateTextScreen } from '../screens/CreateTextScreen';
import { AuthorCarnetScreen } from '../screens/AuthorCarnetScreen';
import { CircleDiscussionScreen } from '../screens/CircleDiscussionScreen';
import { DuoDiscussionScreen } from '../screens/DuoDiscussionScreen';
import { UserCirclesScreen } from '../screens/UserCirclesScreen';
import { ResonancesScreen } from '../screens/ResonancesScreen';
import { ScribelaChannelScreen } from '../screens/ScribelaChannelScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { SubscriptionManager } from '../components/SubscriptionManager';
import { AdminLoginScreen } from '../screens/AdminLoginScreen';
import { AdminAnnouncementsScreen } from '../screens/AdminAnnouncementsScreen';
import { AdminReportsScreen } from '../screens/AdminReportsScreen';
import { AdminSponsorshipsScreen } from '../screens/AdminSponsorshipsScreen';
import { AdminContentReportsScreen } from '../screens/AdminContentReportsScreen';
import { Button } from '../components/ui/Button';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { responsive, getResponsiveFontSize } from '../utils/responsive';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

export type RootStackParamList = {
  Home: undefined;
  Garden: {
    textId: string;
    textTitle: string;
    textContent: string;
    textAuthor: { name: string };
  };
  CreateText: undefined;
  AuthorCarnet: { authorName: string };
  CircleDiscussion: { circleId: string; circleName: string };
  DuoDiscussion: { duoName: string };
  UserCircles: undefined;
  Resonances: undefined;
  ScribelaChannel: undefined;
  Profile: undefined;
  SubscriptionManager: undefined;
  AdminLogin: undefined;
  AdminDashboard: undefined;
  AdminAnnouncements: undefined;
  AdminReports: undefined;
  AdminSponsorships: undefined;
  AdminContentReports: undefined;
};

function CreateTextButton() {
  const navigation = useNavigation();
  return (
    <TouchableOpacity
      onPress={() => {
        (navigation as any).navigate('CreateText');
      }}
      style={{ marginRight: 16 }}
    >
      <Text style={{ fontSize: 24 }}>✏️</Text>
    </TouchableOpacity>
  );
}

function AdminDashboardScreen() {
  const navigation = useNavigation();
  return (
    <View style={{ flex: 1, padding: 16, backgroundColor: colors.background }}>
      <Text
        style={{
          fontSize: 24,
          marginBottom: 24,
          fontFamily: typography.fonts.dancingScript,
        }}
      >
        Administration
      </Text>
      <Button
        onPress={() => (navigation as any).navigate('AdminAnnouncements')}
        style={{ marginBottom: 12 }}
      >
        Gérer les annonces
      </Button>
      <Button
        onPress={() => (navigation as any).navigate('AdminReports')}
        style={{ marginBottom: 12 }}
      >
        Gérer les signalements
      </Button>
      <Button
        onPress={() => (navigation as any).navigate('AdminContentReports')}
        style={{ marginBottom: 12 }}
      >
        Signalements de contenu
      </Button>
      <Button
        onPress={() => (navigation as any).navigate('AdminSponsorships')}
        style={{ marginBottom: 12 }}
      >
        Gérer les sponsorings
      </Button>
    </View>
  );
}

function HomeStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.card,
        },
        headerTintColor: colors.foreground,
        headerTitleStyle: {
          fontWeight: '600',
          fontFamily: typography.fonts.dancingScript,
          fontSize: 24,
        },
      }}
    >
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: 'Scrabelia',
          headerRight: () => <CreateTextButton />,
        }}
      />
      <Stack.Screen
        name="Garden"
        component={GardenScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="CreateText"
        component={CreateTextScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="AuthorCarnet"
        component={AuthorCarnetScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="CircleDiscussion"
        component={CircleDiscussionScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="DuoDiscussion"
        component={DuoDiscussionScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="UserCircles"
        component={UserCirclesScreen}
        options={{ title: 'Mes cercles' }}
      />
      <Stack.Screen
        name="Resonances"
        component={ResonancesScreen}
        options={{ title: 'Résonances' }}
      />
      <Stack.Screen
        name="ScribelaChannel"
        component={ScribelaChannelScreen}
        options={{ title: 'Canal Officiel' }}
      />
      <Stack.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ title: 'Profil' }}
      />
      <Stack.Screen
        name="SubscriptionManager"
        component={SubscriptionManager}
        options={{ title: 'Mes abonnements' }}
      />
      <Stack.Screen
        name="AdminLogin"
        component={AdminLoginScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="AdminDashboard"
        component={AdminDashboardScreen}
        options={{ title: 'Admin' }}
      />
      <Stack.Screen
        name="AdminAnnouncements"
        component={AdminAnnouncementsScreen}
        options={{ title: 'Annonces' }}
      />
      <Stack.Screen
        name="AdminReports"
        component={AdminReportsScreen}
        options={{ title: 'Signalements' }}
      />
      <Stack.Screen
        name="AdminSponsorships"
        component={AdminSponsorshipsScreen}
        options={{ title: 'Sponsorings' }}
      />
      <Stack.Screen
        name="AdminContentReports"
        component={AdminContentReportsScreen}
        options={{ title: 'Signalements contenu' }}
      />
    </Stack.Navigator>
  );
}

export const AppNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.mutedForeground,
        tabBarStyle: {
          backgroundColor: colors.card,
          borderTopColor: colors.border,
          borderTopWidth: 1,
        },
        tabBarLabelStyle: {
          fontFamily: typography.fonts.lora,
          fontSize: getResponsiveFontSize(12),
        },
        tabBarIconStyle: {
          alignItems: 'center',
          justifyContent: 'center',
        },
        tabBarItemStyle: {
          paddingVertical: responsive.isSmallDevice ? 4 : 8,
        },
      }}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeStack}
        options={{
          title: 'Accueil',
          tabBarIcon: ({ color, size }) => (
            <View style={{ alignItems: 'center', justifyContent: 'center', height: size + 4, width: size + 4 }}>
              <Text style={{ fontSize: size, color, lineHeight: size + 4, includeFontPadding: false }}>🏠</Text>
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="ChannelTab"
        component={ScribelaChannelScreen}
        options={{
          title: 'Canal',
          tabBarIcon: ({ color, size }) => (
            <View style={{ alignItems: 'center', justifyContent: 'center', height: size + 4, width: size + 4 }}>
              <Text style={{ fontSize: size, color, lineHeight: size + 4, includeFontPadding: false }}>📢</Text>
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="CirclesTab"
        component={UserCirclesScreen}
        options={{
          title: 'Cercles',
          tabBarIcon: ({ color, size }) => (
            <View style={{ alignItems: 'center', justifyContent: 'center', height: size + 4, width: size + 4 }}>
              <Text style={{ fontSize: size, color, lineHeight: size + 4, includeFontPadding: false }}>👥</Text>
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="ResonancesTab"
        component={ResonancesScreen}
        options={{
          title: 'Résonances',
          tabBarIcon: ({ color, size }) => (
            <View style={{ alignItems: 'center', justifyContent: 'center', height: size + 4, width: size + 4 }}>
              <Text style={{ fontSize: size, color, lineHeight: size + 4, includeFontPadding: false }}>✨</Text>
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="ProfileTab"
        component={ProfileScreen}
        options={{
          title: 'Profil',
          tabBarIcon: ({ color, size }) => (
            <View style={{ alignItems: 'center', justifyContent: 'center', height: size + 4, width: size + 4 }}>
              <Text style={{ fontSize: size, color, lineHeight: size + 4, includeFontPadding: false }}>👤</Text>
            </View>
          ),
        }}
      />
    </Tab.Navigator>
  );
};
