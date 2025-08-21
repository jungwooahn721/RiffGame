import React, { useState, useRef, useCallback, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  Dimensions, 
  TouchableOpacity, 
  Animated,
  Share,
  StatusBar
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { RootStackScreenProps } from '../navigation/types';
import { Game } from '../types/entities';
import Icon from 'react-native-vector-icons/Ionicons';
import { useApp } from '../core/AppContext';

const { height, width } = Dimensions.get('window');

interface GameReelItemProps {
  game: Game;
  isActive: boolean;
  onUserPress: (userId: string) => void;
  onLike: () => void;
  onShare: () => void;
  onComment: () => void;
  isLiked: boolean;
}

const GameReelItem: React.FC<GameReelItemProps> = ({
  game,
  isActive,
  onUserPress,
  onLike,
  onShare,
  onComment,
  isLiked
}) => {
  const [likeAnimation] = useState(new Animated.Value(1));
  const insets = useSafeAreaInsets();

  const handleLike = () => {
    // Animate like button
    Animated.sequence([
      Animated.timing(likeAnimation, {
        toValue: 1.3,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(likeAnimation, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
    
    onLike();
  };

  const formatNumber = (num: number): string => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  return (
    <View style={styles.page}>
      {/* Game WebView */}
      <WebView
        originWhitelist={['*']}
        source={{
          html: game.gameHtml || `
            <html>
              <head>
                <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
                <style>
                  body { 
                    margin: 0; 
                    padding: 40px 20px; 
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    font-family: Arial, sans-serif;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                    min-height: 100vh;
                    color: white;
                    text-align: center;
                  }
                  .preview {
                    background: rgba(255,255,255,0.1);
                    border-radius: 20px;
                    padding: 40px;
                    backdrop-filter: blur(10px);
                    border: 1px solid rgba(255,255,255,0.2);
                  }
                  h1 { margin: 0 0 20px 0; font-size: 2em; }
                  p { margin: 10px 0; opacity: 0.9; }
                  .category { 
                    background: rgba(157, 78, 221, 0.8);
                    padding: 8px 16px;
                    border-radius: 20px;
                    font-size: 0.9em;
                    font-weight: bold;
                    margin-top: 20px;
                  }
                </style>
              </head>
              <body>
                <div class="preview">
                  <h1>${game.title}</h1>
                  <p>${game.description || 'An amazing game created with AI!'}</p>
                  <div class="category">${game.category}</div>
                </div>
              </body>
            </html>
          `,
          baseUrl: '',
        }}
        style={styles.webview}
        javaScriptEnabled
        scrollEnabled={false}
        bounces={false}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
      />

      {/* Overlay UI */}
      <View style={[styles.overlay, { bottom: insets.bottom > 0 ? insets.bottom : 20 }]}>
        {/* User Info */}
        <TouchableOpacity 
          style={styles.userInfo}
          onPress={() => onUserPress(game.creator.id)}
          activeOpacity={0.7}
        >
          <View style={styles.avatarContainer}>
            <Text style={styles.avatarText}>
              {game.creator.username.charAt(0).toUpperCase()}
            </Text>
          </View>
          <View style={styles.userDetails}>
            <View style={styles.usernameRow}>
              <Text style={styles.username}>@{game.creator.username}</Text>
              {game.creator.verified && (
                <Icon name="checkmark-circle" size={16} color="#9d4edd" />
              )}
            </View>
            <Text style={styles.gameTitle}>{game.title}</Text>
          </View>
        </TouchableOpacity>

        {/* Game Description */}
        {game.description && (
          <View style={styles.descriptionContainer}>
            <Text style={styles.description} numberOfLines={3}>
              {game.description}
            </Text>
          </View>
        )}

        {/* Tags */}
        <View style={styles.tagsContainer}>
          {game.tags.slice(0, 3).map((tag, index) => (
            <View key={index} style={styles.tag}>
              <Text style={styles.tagText}>#{tag}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Action Buttons */}
      <View style={[styles.actionButtons, { bottom: insets.bottom > 0 ? insets.bottom + 10 : 30 }]}>
        <Animated.View style={{ transform: [{ scale: likeAnimation }] }}>
          <TouchableOpacity 
            style={[styles.actionButton, isLiked && styles.likedButton]}
            onPress={handleLike}
            activeOpacity={0.7}
          >
            <Icon 
              name={isLiked ? "heart" : "heart-outline"} 
              size={32} 
              color={isLiked ? "#ff4757" : "#ffffff"} 
            />
            <Text style={[styles.actionText, isLiked && styles.likedText]}>
              {formatNumber(game.likes)}
            </Text>
          </TouchableOpacity>
        </Animated.View>

        <TouchableOpacity style={styles.actionButton} onPress={onComment}>
          <Icon name="chatbubble-outline" size={32} color="#ffffff" />
          <Text style={styles.actionText}>{formatNumber(game.comments)}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton} onPress={onShare}>
          <Icon name="share-social-outline" size={32} color="#ffffff" />
          <Text style={styles.actionText}>{formatNumber(game.shares)}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const GameReelsScreen = ({ route, navigation }: RootStackScreenProps<'GameReels'>) => {
  const { games, initialGameId } = route.params;
  const { state, actions } = useApp();
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const insets = useSafeAreaInsets();

  const initialIndex = games.findIndex(game => game.id === initialGameId);

  useEffect(() => {
    // Hide status bar for immersive experience
    StatusBar.setHidden(true);
    return () => StatusBar.setHidden(false);
  }, []);

  const handleViewableItemsChanged = useCallback(({ viewableItems }: any) => {
    if (viewableItems.length > 0) {
      const index = viewableItems[0].index;
      setCurrentIndex(index);
      
      // Track view for analytics
      const gameId = games[index]?.id;
      if (gameId) {
        actions.incrementViews(gameId);
      }
    }
  }, [games, actions]);

  const handleMomentumScrollEnd = useCallback((event: any) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    const index = Math.round(offsetY / height);
    setCurrentIndex(index);
  }, []);

  const handleScrollEndDrag = useCallback((event: any) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    const velocity = event.nativeEvent.velocity.y;
    
    // Calculate which page should be shown based on scroll position and velocity
    let targetIndex = Math.round(offsetY / height);
    
    // If the user is scrolling fast, respect the direction
    if (Math.abs(velocity) > 0.5) {
      if (velocity > 0 && targetIndex < games.length - 1) {
        targetIndex = Math.ceil(offsetY / height);
      } else if (velocity < 0 && targetIndex > 0) {
        targetIndex = Math.floor(offsetY / height);
      }
    }
    
    // Ensure we don't go out of bounds
    targetIndex = Math.max(0, Math.min(targetIndex, games.length - 1));
    
    // Smooth scroll to target
    flatListRef.current?.scrollToIndex({
      index: targetIndex,
      animated: true,
    });
  }, [games.length]);

  const handleUserPress = (userId: string) => {
    navigation.navigate('Main', { 
      screen: 'Profile', 
      params: { userId } 
    });
  };

  const handleLike = (gameId: string) => {
    const game = state.games.find(g => g.id === gameId);
    const isLiked = game && state.currentUser ? game.likedBy.includes(state.currentUser.id) : false;
    
    if (isLiked) {
      actions.unlikeGame(gameId);
    } else {
      actions.likeGame(gameId);
    }
  };

  const handleShare = async (game: Game) => {
    try {
      await Share.share({
        message: `Check out "${game.title}" by ${game.creator.username} on RiffGame! 🎮`,
        url: `riffgame://game/${game.id}`,
        title: game.title,
      });
      actions.shareGame(game.id);
    } catch (error) {
      console.error('Share failed:', error);
    }
  };

  const handleComment = (gameId: string) => {
    // TODO: Implement comments screen
    console.log('Comment on game:', gameId);
  };

  const renderItem = ({ item, index }: { item: Game; index: number }) => {
    const isActive = index === currentIndex;
    const isLiked = state.currentUser ? item.likedBy.includes(state.currentUser.id) : false;

    return (
      <GameReelItem
        game={item}
        isActive={isActive}
        onUserPress={handleUserPress}
        onLike={() => handleLike(item.id)}
        onShare={() => handleShare(item)}
        onComment={() => handleComment(item.id)}
        isLiked={isLiked}
      />
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right']}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      <FlatList
        ref={flatListRef}
        data={games}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        pagingEnabled
        showsVerticalScrollIndicator={false}
        initialScrollIndex={initialIndex >= 0 ? initialIndex : 0}
        getItemLayout={(data, index) => (
          { length: height, offset: height * index, index }
        )}
        onViewableItemsChanged={handleViewableItemsChanged}
        onMomentumScrollEnd={handleMomentumScrollEnd}
        onScrollEndDrag={handleScrollEndDrag}
        viewabilityConfig={{
          viewAreaCoveragePercentThreshold: 50,
        }}
        removeClippedSubviews={true}
        maxToRenderPerBatch={3}
        windowSize={5}
        snapToInterval={height}
        snapToAlignment="start"
        decelerationRate="fast"
        bounces={false}
        scrollEventThrottle={16}
      />
      
      {/* Close Button */}
      <TouchableOpacity 
        style={styles.closeButton} 
        onPress={() => navigation.goBack()}
        activeOpacity={0.7}
      >
        <Icon name="close" size={28} color="#fff" />
      </TouchableOpacity>

      {/* Progress Indicator */}
      <View style={styles.progressContainer}>
        {games.map((_, index) => (
          <View
            key={index}
            style={[
              styles.progressDot,
              index === currentIndex && styles.progressDotActive
            ]}
          />
        ))}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    paddingTop: 0, // Remove any top padding
  },
  page: {
    width: width,
    height: height,
    position: 'relative',
  },
  webview: {
    flex: 1,
    backgroundColor: '#000',
  },
  overlay: {
    position: 'absolute',
    left: 20,
    right: 80,
    paddingBottom: 10,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  avatarContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#9d4edd',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    borderWidth: 2,
    borderColor: '#ffffff',
  },
  avatarText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  userDetails: {
    flex: 1,
  },
  usernameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  username: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 6,
  },
  gameTitle: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 2,
  },
  descriptionContainer: {
    marginBottom: 8,
  },
  description: {
    color: '#ffffff',
    fontSize: 14,
    lineHeight: 18,
    opacity: 0.9,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 5,
  },
  tag: {
    backgroundColor: 'rgba(157, 78, 221, 0.3)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
    marginBottom: 4,
  },
  tagText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '500',
  },
  actionButtons: {
    position: 'absolute',
    right: 20,
    alignItems: 'center',
  },
  actionButton: {
    alignItems: 'center',
    marginBottom: 16,
    padding: 8,
  },
  likedButton: {
    backgroundColor: 'rgba(255, 71, 87, 0.2)',
    borderRadius: 25,
  },
  actionText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
    marginTop: 4,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  likedText: {
    color: '#ff4757',
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 20,
    padding: 8,
    zIndex: 10,
  },
  progressContainer: {
    position: 'absolute',
    top: 10,
    left: 20,
    flexDirection: 'row',
    zIndex: 10,
  },
  progressDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    marginRight: 6,
  },
  progressDotActive: {
    backgroundColor: '#ffffff',
  },
});

export default GameReelsScreen;
