import React, { useState, useMemo, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Dimensions, Image, ScrollView } from 'react-native';
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
        <Image source={{ uri: item.thumbnailUrl }} style={styles.gameImage} />
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
    <View style={[styles.placeholderItem, { width: itemSize, height: itemSize }]}>
      <Image 
        source={{ uri: `https://picsum.photos/seed/placeholder${index}/400/600` }} 
        style={styles.placeholderImage} 
      />
      <View style={styles.placeholderOverlay}>
        <View style={styles.placeholderText} />
        <View style={styles.placeholderStats}>
          <View style={styles.placeholderStat} />
          <View style={styles.placeholderStat} />
          <View style={styles.placeholderStat} />
        </View>
      </View>
    </View>
  );

  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.headerLeft}>
        <View style={styles.logoContainer}>
          <Icon name="compass" size={20} color="#9d4edd" />
          <Text style={styles.appName}>RiffGame</Text>
        </View>
        <View style={styles.statusIndicator}>
          <View style={styles.exploreDot} />
          <Text style={styles.exploreText}>Discover Games</Text>
        </View>
      </View>
      <TouchableOpacity style={styles.searchButton}>
        <Icon name="search-outline" size={24} color="#ffffff" />
      </TouchableOpacity>
    </View>
  );

  const renderCategories = () => (
    <View style={styles.categoriesContainer}>
      <Text style={styles.sectionTitle}>Browse by Category</Text>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoriesScrollContent}
        style={styles.categoriesScroll}
      >
        {['Action', 'Puzzle', 'Arcade', 'Strategy', 'Adventure', 'Sports', 'Racing', 'Simulation'].map((category) => (
          <TouchableOpacity key={category} style={styles.categoryCard}>
            <Text style={styles.categoryText}>{category}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  const renderFeatured = () => (
    <View style={styles.featuredContainer}>
      <Text style={styles.sectionTitle}>Featured Games</Text>
      <View style={styles.featuredGrid}>
        {state.games.slice(0, 6).map((game) => (
          <TouchableOpacity
            key={game.id}
            style={styles.featuredItem}
            onPress={() => handleGamePress(game.id)}
          >
            <View style={styles.gameContainer}>
              <Image source={{ uri: game.thumbnailUrl }} style={styles.gameImage} />
              <View style={styles.gradientOverlay} />
              <Text style={styles.gameTitle}>{game.title}</Text>
              <View style={styles.playIndicator}>
                <Icon name="play" size={16} color="#fff" />
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right']}>
      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingBottom: 50 + insets.bottom }
        ]}
        showsVerticalScrollIndicator={false}
      >
        {renderHeader()}
        {renderCategories()}
        {renderFeatured()}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0a1e',
  },
  content: {
    paddingHorizontal: 15,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 0,
    paddingVertical: 0,
    marginBottom: 12,
    paddingTop: 5,
  },
  headerLeft: {
    flexDirection: 'column',
    gap: 4,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  appName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  statusIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  exploreDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#ff6b35',
  },
  exploreText: {
    fontSize: 12,
    color: '#ff6b35',
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  searchButton: {
    padding: 8,
  },
  categoriesContainer: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 12,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoriesScroll: {
    flexGrow: 0,
  },
  categoriesScrollContent: {
    paddingHorizontal: 15,
    gap: 12,
  },
  categoryCard: {
    backgroundColor: '#1c1c1e',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#3a3a3a',
    minWidth: 80,
    alignItems: 'center',
  },
  categoryText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  featuredContainer: {
    marginBottom: 24,
  },
  featuredGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  featuredItem: {
    width: (Dimensions.get('window').width - 46) / 3, // 3 columns with gaps
    height: (Dimensions.get('window').width - 46) / 3,
    backgroundColor: '#1a1a2e',
    borderRadius: 8,
    overflow: 'hidden',
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
  gameImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
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
    position: 'relative',
    overflow: 'hidden',
  },
  placeholderImage: {
    width: '100%',
    height: '70%',
    borderRadius: 8,
  },
  placeholderOverlay: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    right: 8,
  },
  placeholderText: {
    height: 12,
    backgroundColor: '#4a4a4a',
    borderRadius: 4,
    marginBottom: 6,
    width: '80%',
  },
  placeholderStats: {
    flexDirection: 'row',
    gap: 8,
  },
  placeholderStat: {
    height: 8,
    width: 20,
    backgroundColor: '#4a4a4a',
    borderRadius: 2,
  },
});

export default ExploreScreen;
