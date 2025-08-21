import React from 'react';
import { NavigationContainer, DarkTheme } from '@react-navigation/native';
import { StatusBar } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import AppNavigator from './src/navigation/AppNavigator';
import { AppProvider } from './src/core/AppContext';

const customDarkTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: '#9d4edd',
    background: '#0f0a1e',
    card: '#16213e',
    text: '#ffffff',
    border: '#2a2a5a',
    notification: '#c77dff',
  },
};

const App = () => {
  return (
    <AppProvider>
      <SafeAreaProvider>
        <SafeAreaView style={{ flex: 1, backgroundColor: '#0f0a1e' }}>
          <StatusBar barStyle="light-content" backgroundColor="#0f0a1e" />
          <NavigationContainer theme={customDarkTheme}>
            <AppNavigator />
          </NavigationContainer>
        </SafeAreaView>
      </SafeAreaProvider>
    </AppProvider>
  );
};

export default App;
