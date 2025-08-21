import React, { useState, useEffect } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Text,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import { useApp } from '../core/AppContext';
import { MainTabScreenProps } from '../navigation/types';

const ExploreScreen = ({ navigation }: MainTabScreenProps<'Explore'>) => {
  const { state } = useApp();
  const insets = useSafeAreaInsets();
  const [isLoading, setIsLoading] = useState(true);

  const screenWidth = Dimensions.get('window').width;
  const itemSize = (screenWidth - 6) / 3; // 3 columns with 2px gaps

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleGamePress = (gameId: string) => {
    const gameIndex = state.games.findIndex(game => game.id === gameId);
    if (gameIndex !== -1) {
      navigation.navigate('GameReels', {
        games: state.games,
        initialGameId: gameId,
      });
    }
  };

  const renderGameItem = ({ item, index }: { item: any; index: number }) => (
    <TouchableOpacity
      style={[styles.gameItem, { width: itemSize, height: itemSize }]}
      onPress={() => handleGamePress(item.id)}
    >
      <View style={styles.gameContainer}>
        <View style={styles.gradientOverlay} />
        <Text style={styles.gameTitle}>{item.title}</Text>
        
        {/* Play indicator */}
        <View style={styles.playIndicator}>
          <Icon name="play" size={16} color="#ffffff" />
        </View>
        
        {/* Stats overlay */}
        <View style={styles.statsOverlay}>
          <View style={styles.statItem}>
            <Icon name="heart" size={12} color="#ffffff" />
            <Text style={styles.statText}>{item.likes > 999 ? `${Math.floor(item.likes/1000)}K` : item.likes}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderPlaceholder = ({ index }: { index: number }) => (
    <View style={[styles.placeholderItem, { width: itemSize, height: itemSize }]} />
  );

  const renderHeader = () => (
    <View style={styles.header}>
      <Text style={styles.headerTitle}>Explore</Text>
      <TouchableOpacity style={styles.searchButton}>
        <Icon name="search-outline" size={24} color="#ffffff" />
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right']}>
      <FlatList
        data={isLoading ? Array.from({ length: 12 }, (_, i) => ({ id: `placeholder-${i}` })) : state.games}
        renderItem={isLoading ? renderPlaceholder : renderGameItem}
        numColumns={3}
        keyExtractor={(item, index) => isLoading ? `placeholder-${index}` : item.id}
        ListHeaderComponent={renderHeader}
        contentContainerStyle={[
          styles.content,
          { paddingBottom: 50 + insets.bottom }
        ]}
        columnWrapperStyle={styles.row}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0a1e',
  },
  content: {
    paddingHorizontal: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 16,
    marginBottom: 8,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  searchButton: {
    padding: 8,
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  gameItem: {
    backgroundColor: '#1a1a2e',
    borderRadius: 8,
    overflow: 'hidden',
    position: 'relative',
  },
  gameContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  gradientOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(157, 78, 221, 0.3)',
  },
  gameTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#ffffff',
    textAlign: 'center',
    paddingHorizontal: 4,
    zIndex: 1,
  },
  playIndicator: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 12,
    padding: 4,
    zIndex: 2,
  },
  statsOverlay: {
    position: 'absolute',
    bottom: 4,
    left: 4,
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 2,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 8,
    paddingHorizontal: 4,
    paddingVertical: 2,
  },
  statText: {
    fontSize: 10,
    color: '#ffffff',
    marginLeft: 2,
    fontWeight: '500',
  },
  separator: {
    height: 2,
  },
  placeholderItem: {
    backgroundColor: '#2a2a2a',
    borderRadius: 8,
  },
});

export default ExploreScreen;
