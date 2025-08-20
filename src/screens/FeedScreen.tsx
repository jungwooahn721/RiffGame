import React from 'react';
import { View, FlatList, StyleSheet, SafeAreaView } from 'react-native';
import { games } from '../core/mockData';
import GameGridItem from '../components/GameGridItem';
import { MainTabScreenProps } from '../navigation/types';

const FeedScreen = ({ navigation }: MainTabScreenProps<'Feed'>) => {

  const handleGamePress = (gameId: string) => {
    navigation.navigate('GameReels', { games: games, initialGameId: gameId });
  };

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={games}
        renderItem={({ item }) => (
          <GameGridItem game={item} onPress={() => handleGamePress(item.id)} />
        )}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0a1e',
  },
  list: {
    padding: 10,
    paddingBottom: 20,
  },
});

export default FeedScreen;
