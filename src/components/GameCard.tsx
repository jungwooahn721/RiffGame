import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Animated, Share, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { Game } from '../types/entities';
import { useApp } from '../core/AppContext';

interface GameCardProps {
  game: Game;
  onPress: () => void;
  onUserPress?: (userId: string) => void;
  showFullDescription?: boolean;
}

const GameCard: React.FC<GameCardProps> = ({ 
  game, 
  onPress, 
  onUserPress,
  showFullDescription = false 
}) => {
  const { state, actions } = useApp();
  const [likeAnimation] = useState(new Animated.Value(1));
  
  const isLiked = state.currentUser ? game.likedBy.includes(state.currentUser.id) : false;
  const isOwnGame = state.currentUser?.id === game.creator.id;

  const handleLike = () => {
    if (!state.currentUser) return;
    
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

    if (isLiked) {
      actions.unlikeGame(game.id);
    } else {
      actions.likeGame(game.id);
    }
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Check out "${game.title}" by ${game.creator.username} on RiffGame! 🎮`,
        url: `riffgame://game/${game.id}`, // Deep link
        title: game.title,
      });
      actions.shareGame(game.id);
    } catch (error) {
      console.error('Share failed:', error);
    }
  };

  const handleComment = () => {
    // Navigate to comments screen or show comment modal
    Alert.alert('Comments', 'Comment feature coming soon!');
  };

  const formatNumber = (num: number): string => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const timeAgo = (date: Date): string => {
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'now';
    if (diffInHours < 24) return `${diffInHours}h`;
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d`;
    return `${Math.floor(diffInHours / 168)}w`;
  };

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.95}>
      <View style={styles.card}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.userInfo}
            onPress={() => onUserPress?.(game.creator.id)}
            activeOpacity={0.7}
          >
            <Image source={{ uri: game.creator.avatarUrl }} style={styles.avatar} />
            <View>
              <View style={styles.usernameRow}>
                <Text style={styles.username}>{game.creator.username}</Text>
                {game.creator.verified && (
                  <Icon name="checkmark-circle" size={16} color="#9d4edd" style={styles.verifiedIcon} />
                )}
              </View>
              <Text style={styles.timeAgo}>{timeAgo(game.createdAt)}</Text>
            </View>
          </TouchableOpacity>
          
          {!isOwnGame && (
            <TouchableOpacity style={styles.followButton}>
              <Text style={styles.followButtonText}>Follow</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Game Preview */}
        <TouchableOpacity onPress={onPress} activeOpacity={0.9}>
          <View style={styles.gamePreview}>
            <Image source={{ uri: game.thumbnailUrl }} style={styles.thumbnailImage} />
            <View style={styles.playOverlay}>
              <Icon name="play-circle" size={60} color="rgba(255,255,255,0.9)" />
            </View>
            <View style={styles.categoryTag}>
              <Text style={styles.categoryText}>{game.category}</Text>
            </View>
          </View>
        </TouchableOpacity>

        {/* Content */}
        <View style={styles.content}>
          <Text style={styles.title}>{game.title}</Text>
          {game.description && (
            <Text 
              style={styles.description} 
              numberOfLines={showFullDescription ? undefined : 2}
            >
              {game.description}
            </Text>
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

        {/* Stats & Actions */}
        <View style={styles.footer}>
          <View style={styles.stats}>
            <Text style={styles.viewsText}>{formatNumber(game.views)} views</Text>
          </View>
          
          <View style={styles.actions}>
            <Animated.View style={{ transform: [{ scale: likeAnimation }] }}>
              <TouchableOpacity 
                style={[styles.actionButton, isLiked && styles.actionButtonLiked]} 
                onPress={handleLike}
                activeOpacity={0.7}
              >
                <Icon 
                  name={isLiked ? "heart" : "heart-outline"} 
                  size={24} 
                  color={isLiked ? "#ff4757" : "#9d4edd"} 
                />
                <Text style={[styles.actionText, isLiked && styles.actionTextLiked]}>
                  {formatNumber(game.likes)}
                </Text>
              </TouchableOpacity>
            </Animated.View>
            
            <TouchableOpacity style={styles.actionButton} onPress={handleComment}>
              <Icon name="chatbubble-outline" size={24} color="#9d4edd" />
              <Text style={styles.actionText}>{formatNumber(game.comments)}</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.actionButton} onPress={handleShare}>
              <Icon name="share-social-outline" size={24} color="#9d4edd" />
              <Text style={styles.actionText}>{formatNumber(game.shares)}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#16213e',
    borderRadius: 15,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#2a2a5a',
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
    paddingBottom: 10,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#9d4edd',
  },
  usernameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  username: {
    fontWeight: 'bold',
    color: '#ffffff',
    fontSize: 16,
  },
  verifiedIcon: {
    marginLeft: 4,
  },
  timeAgo: {
    fontSize: 12,
    color: '#8e8e93',
    marginTop: 2,
  },
  followButton: {
    backgroundColor: '#9d4edd',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 15,
  },
  followButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  gamePreview: {
    height: 250,
    position: 'relative',
    backgroundColor: '#1a1a2e',
  },
  thumbnailImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  playOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  categoryTag: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(157, 78, 221, 0.9)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  categoryText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
  },
  content: {
    padding: 15,
    paddingBottom: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 6,
  },
  description: {
    fontSize: 14,
    color: '#b0b0b0',
    lineHeight: 20,
    marginBottom: 10,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 5,
  },
  tag: {
    backgroundColor: '#2a2a5a',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    marginRight: 6,
    marginBottom: 4,
  },
  tagText: {
    color: '#9d4edd',
    fontSize: 12,
    fontWeight: '500',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingBottom: 15,
  },
  stats: {
    flex: 1,
  },
  viewsText: {
    fontSize: 12,
    color: '#8e8e93',
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 20,
    paddingVertical: 5,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  actionButtonLiked: {
    backgroundColor: 'rgba(255, 71, 87, 0.1)',
  },
  actionText: {
    marginLeft: 6,
    color: '#9d4edd',
    fontSize: 14,
    fontWeight: '500',
  },
  actionTextLiked: {
    color: '#ff4757',
  },
});

export default GameCard;