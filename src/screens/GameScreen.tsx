import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { WebView } from 'react-native-webview';

const GameScreen = () => {
  const gameUrl = Platform.select({
    android: 'file:///android_asset/index.html',
    ios: './game-assets/index.html',
  });

  return (
    <View style={styles.container}>
      <WebView
        source={{ uri: gameUrl }}
        style={styles.webview}
        originWhitelist={['*']}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        allowFileAccess={true}
        allowFileAccessFromFileURLs={true}
        allowUniversalAccessFromFileURLs={true}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  webview: {
    flex: 1,
  },
});

export default GameScreen;