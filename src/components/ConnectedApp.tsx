import React from 'react';
import { View, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { AppNavigator } from '../navigation/AppNavigator';
import { ScribelaProvider } from '../contexts/ScribelaContext';
import { colors } from '../theme/colors';

interface ConnectedAppProps {
  currentUser: string;
}

export const ConnectedApp: React.FC<ConnectedAppProps> = ({ currentUser }) => {
  return (
    <ScribelaProvider currentUser={currentUser}>
      <View style={styles.container}>
        <NavigationContainer>
          <AppNavigator />
        </NavigationContainer>
      </View>
    </ScribelaProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
});

