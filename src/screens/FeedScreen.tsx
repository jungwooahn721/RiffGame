import React, { useState, useCallback, useMemo } from 'react';
import { 
  View, 
  FlatList, 
  StyleSheet, 
  RefreshControl, 
  TextInput, 
  TouchableOpacity,
  Text,
  Animated
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import { useApp } from '../core/AppContext';
import GameCard from '../components/GameCard';
import { MainTabScreenProps } from '../navigation/types';

const FeedScreen = ({ navigation }: MainTabScreenProps<'Feed'>) => {
  const { state, actions } = useApp();
  const insets = useSafeAreaInsets();
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [sortBy, setSortBy] = useState<'recent' | 'popular' | 'trending'>('recent');
  const searchAnimation = new Animated.Value(0);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    // Simulate API call
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, []);

  const filteredAndSortedGames = useMemo(() => {
    let filtered = state.games.filter(game => game.isPublic);
    
    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(game => 
        game.title.toLowerCase().includes(query) ||
        game.description?.toLowerCase().includes(query) ||
        game.creator.username.toLowerCase().includes(query) ||
        game.tags.some(tag => tag.toLowerCase().includes(query)) ||
        game.category.toLowerCase().includes(query)
      );
    }
    
    // Apply sorting
    switch (sortBy) {
      case 'popular':
        return filtered.sort((a, b) => b.likes - a.likes);
      case 'trending':
        return filtered.sort((a, b) => {
          const aScore = (b.likes * 2) + (b.views * 0.1) + (b.shares * 5);
          const bScore = (a.likes * 2) + (a.views * 0.1) + (a.shares * 5);
          return aScore - bScore;
        });
      default: // recent
        return filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }
  }, [state.games, searchQuery, sortBy]);

  const handleGamePress = (gameId: string) => {
    actions.incrementViews(gameId);
    navigation.navigate('GameReels', { 
      games: filteredAndSortedGames, 
      initialGameId: gameId 
    });
  };

  const handleUserPress = (userId: string) => {
    navigation.navigate('Profile', { userId });
  };

  const toggleSearch = () => {
    const toValue = showSearch ? 0 : 1;
    setShowSearch(!showSearch);
    
    Animated.timing(searchAnimation, {
      toValue,
      duration: 300,
      useNativeDriver: false,
    }).start();
    
    if (showSearch) {
      setSearchQuery('');
    }
  };

  const SortButton = ({ type, label }: { type: typeof sortBy, label: string }) => (
    <TouchableOpacity
      style={[styles.sortButton, sortBy === type && styles.sortButtonActive]}
      onPress={() => setSortBy(type)}
    >
      <Text style={[styles.sortButtonText, sortBy === type && styles.sortButtonTextActive]}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.headerTop}>
        <View style={styles.headerLeft}>
          <View style={styles.logoContainer}>
            <Icon name="game-controller" size={20} color="#9d4edd" />
            <Text style={styles.appName}>RiffGame</Text>
          </View>
          <View style={styles.statusIndicator}>
            <View style={styles.liveDot} />
            <Text style={styles.liveText}>Live Feed</Text>
          </View>
        </View>
        <TouchableOpacity onPress={toggleSearch} style={styles.searchToggle}>
          <Icon name="search-outline" size={24} color="#ffffff" />
        </TouchableOpacity>
      </View>
      
      <Animated.View style={[
        styles.searchContainer,
        {
          height: searchAnimation.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 50],
          }),
          opacity: searchAnimation,
        }
      ]}>
        <View style={styles.searchInputContainer}>
          <Icon name="search-outline" size={20} color="#8e8e93" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search games, creators, tags..."
            placeholderTextColor="#8e8e93"
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoCorrect={false}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')} style={styles.clearButton}>
              <Icon name="close-circle" size={20} color="#8e8e93" />
            </TouchableOpacity>
          )}
        </View>
      </Animated.View>
      
      <View style={styles.sortContainer}>
        <SortButton type="recent" label="Recent" />
        <SortButton type="popular" label="Popular" />
        <SortButton type="trending" label="Trending" />
      </View>
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Icon name="game-controller-outline" size={64} color="#8e8e93" />
      <Text style={styles.emptyStateTitle}>No games found</Text>
      <Text style={styles.emptyStateSubtitle}>
        {searchQuery ? 'Try adjusting your search terms' : 'Be the first to create a game!'}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <FlatList
        data={filteredAndSortedGames}
        renderItem={({ item }) => (
          <GameCard 
            game={item} 
            onPress={() => handleGamePress(item.id)}
            onUserPress={handleUserPress}
          />
        )}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[
          styles.list,
          { paddingBottom: 50 + insets.bottom }
        ]}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#9d4edd"
            colors={['#9d4edd']}
          />
        }
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmptyState}
        getItemLayout={(data, index) => (
          { length: 400, offset: 400 * index, index } // Approximate item height
        )}
        removeClippedSubviews={true}
        maxToRenderPerBatch={5}
        windowSize={10}
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
    paddingHorizontal: 15,
    paddingTop: 0, // Removed padding
    // paddingBottom moved to inline style for dynamic calculation
  },
  header: {
    marginBottom: 16,
    paddingHorizontal: 0,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#00ff88',
  },
  liveText: {
    fontSize: 12,
    color: '#00ff88',
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  searchToggle: {
    padding: 8,
  },
  searchContainer: {
    overflow: 'hidden',
    marginBottom: 12, // Reduced from 15
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a2e',
    borderRadius: 25,
    paddingHorizontal: 15,
    height: 50,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    color: '#ffffff',
    fontSize: 16,
  },
  clearButton: {
    padding: 5,
  },
  sortContainer: {
    flexDirection: 'row',
    backgroundColor: '#1a1a2e',
    borderRadius: 25,
    padding: 4,
  },
  sortButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 20,
    alignItems: 'center',
  },
  sortButtonActive: {
    backgroundColor: '#9d4edd',
  },
  sortButtonText: {
    color: '#8e8e93',
    fontSize: 14,
    fontWeight: '600',
  },
  sortButtonTextActive: {
    color: '#ffffff',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateSubtitle: {
    fontSize: 14,
    color: '#8e8e93',
    textAlign: 'center',
    paddingHorizontal: 40,
  },
});

export default FeedScreen;
