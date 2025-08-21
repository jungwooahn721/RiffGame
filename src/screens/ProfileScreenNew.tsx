import React, { useMemo } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import { useApp } from '../core/AppContext';
import { MainTabScreenProps } from '../navigation/types';
import GameGridItem from '../components/GameGridItem';

const ProfileScreenNew = ({ navigation, route }: MainTabScreenProps<'Profile'>) => {
  const { state, actions } = useApp();
  const userId = route.params?.userId;

  // Find the user based on userId from navigation params, or default to current user
  const user = useMemo(() => {
    if (userId) {
      return state.users.find(u => u.id === userId) || state.currentUser;
    }
    return state.currentUser;
  }, [userId, state.users, state.currentUser]);

  // Filter games created by the current profile user
  const userGames = useMemo(() => {
    return state.games.filter(game => game.creator.id === user?.id);
  }, [state.games, user?.id]);

  // Check if viewing own profile
  const isOwnProfile = state.currentUser?.id === user?.id;

  // Check if following this user
  const isFollowing = useMemo(() => {
    if (!state.currentUser || !user || isOwnProfile) return false;
    return state.currentUser.following.includes(user.id);
  }, [state.currentUser, user, isOwnProfile]);

  if (!user) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Icon name="person-outline" size={64} color="#8e8e93" />
          <Text style={styles.errorText}>User not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  const handleFollowersPress = () => {
    navigation.navigate('UserList', { userId: user.id, type: 'followers' });
  };

  const handleFollowingPress = () => {
    navigation.navigate('UserList', { userId: user.id, type: 'following' });
  };

  const handleGamePress = (gameId: string) => {
    actions.incrementViews(gameId);
    navigation.navigate('GameReels', { games: userGames, initialGameId: gameId });
  };

  const handleCreateGame = () => {
    if (isOwnProfile) {
      navigation.navigate('CreateGame');
    }
  };

  const handleFollowToggle = () => {
    if (!user || isOwnProfile) return;
    
    if (isFollowing) {
      actions.unfollowUser(user.id);
    } else {
      actions.followUser(user.id);
    }
  };

  const formatNumber = (num: number): string => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      {/* Profile Header */}
      <View style={styles.profileHeader}>
        <View style={styles.avatarContainer}>
          <Image source={{ uri: user.avatarUrl }} style={styles.avatar} />
          {user.verified && (
            <View style={styles.verifiedBadge}>
              <Icon name="checkmark" size={16} color="#ffffff" />
            </View>
          )}
        </View>
        
        <View style={styles.userInfo}>
          <View style={styles.nameContainer}>
            <Text style={styles.displayName}>{user.displayName || user.username}</Text>
            <Text style={styles.username}>@{user.username}</Text>
          </View>
          
          {user.bio && (
            <Text style={styles.bio}>{user.bio}</Text>
          )}
          
          <View style={styles.statsContainer}>
            <TouchableOpacity style={styles.statItem} onPress={handleFollowersPress}>
              <Text style={styles.statNumber}>{formatNumber(user.followers.length)}</Text>
              <Text style={styles.statLabel}>Followers</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.statItem} onPress={handleFollowingPress}>
              <Text style={styles.statNumber}>{formatNumber(user.following.length)}</Text>
              <Text style={styles.statLabel}>Following</Text>
            </TouchableOpacity>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{formatNumber(user.stats.totalLikes)}</Text>
              <Text style={styles.statLabel}>Likes</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        {isOwnProfile ? (
          <>
            <TouchableOpacity style={styles.createGameButton} onPress={handleCreateGame}>
              <Icon name="add-circle-outline" size={20} color="#ffffff" />
              <Text style={styles.createGameButtonText}>Create Game</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.editProfileButton}>
              <Icon name="settings-outline" size={20} color="#9d4edd" />
              <Text style={styles.editProfileButtonText}>Settings</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <TouchableOpacity 
              style={[styles.followButton, isFollowing && styles.followingButton]} 
              onPress={handleFollowToggle}
            >
              <Icon 
                name={isFollowing ? "checkmark-outline" : "add-outline"} 
                size={20} 
                color={isFollowing ? "#9d4edd" : "#ffffff"} 
              />
              <Text style={[styles.followButtonText, isFollowing && styles.followingButtonText]}>
                {isFollowing ? 'Following' : 'Follow'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.messageButton}>
              <Icon name="chatbubble-outline" size={20} color="#9d4edd" />
              <Text style={styles.messageButtonText}>Message</Text>
            </TouchableOpacity>
          </>
        )}
      </View>

      {/* Games Section Header */}
      <View style={styles.gamesHeader}>
        <Text style={styles.gamesTitle}>
          {isOwnProfile ? 'Your Games' : `${user.username}'s Games`} ({userGames.length})
        </Text>
        <View style={styles.gamesSortOptions}>
          <TouchableOpacity style={styles.sortOption}>
            <Icon name="grid-outline" size={20} color="#9d4edd" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.sortOption}>
            <Icon name="list-outline" size={20} color="#8e8e93" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Icon name="game-controller-outline" size={64} color="#8e8e93" />
      <Text style={styles.emptyStateTitle}>
        {isOwnProfile ? 'No games yet' : 'No games created'}
      </Text>
      <Text style={styles.emptyStateSubtitle}>
        {isOwnProfile 
          ? 'Start creating your first game!' 
          : `${user.username} hasn't created any games yet.`
        }
      </Text>
      {isOwnProfile && (
        <TouchableOpacity style={styles.emptyStateButton} onPress={handleCreateGame}>
          <Text style={styles.emptyStateButtonText}>Create Your First Game</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={userGames}
        renderItem={({ item }) => (
          <GameGridItem game={item} onPress={() => handleGamePress(item.id)} />
        )}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.gamesList}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={userGames.length === 0 ? renderEmptyState : null}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0a1e',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: '#8e8e93',
    fontSize: 16,
    marginTop: 16,
  },
  headerContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: '#9d4edd',
  },
  verifiedBadge: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    backgroundColor: '#9d4edd',
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#0f0a1e',
  },
  userInfo: {
    flex: 1,
  },
  nameContainer: {
    marginBottom: 8,
  },
  displayName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  username: {
    fontSize: 14,
    color: '#8e8e93',
    marginTop: 2,
  },
  bio: {
    fontSize: 14,
    color: '#b0b0b0',
    lineHeight: 20,
    marginBottom: 12,
  },
  statsContainer: {
    flexDirection: 'row',
  },
  statItem: {
    alignItems: 'center',
    marginRight: 24,
  },
  statNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  statLabel: {
    fontSize: 12,
    color: '#8e8e93',
    marginTop: 2,
  },
  actionButtons: {
    flexDirection: 'row',
    marginBottom: 24,
    gap: 12,
  },
  createGameButton: {
    flex: 1,
    backgroundColor: '#9d4edd',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 25,
  },
  createGameButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  editProfileButton: {
    flex: 1,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#9d4edd',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 25,
  },
  editProfileButtonText: {
    color: '#9d4edd',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  followButton: {
    flex: 1,
    backgroundColor: '#9d4edd',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 25,
  },
  followingButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#9d4edd',
  },
  followButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  followingButtonText: {
    color: '#9d4edd',
  },
  messageButton: {
    flex: 1,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#9d4edd',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 25,
  },
  messageButtonText: {
    color: '#9d4edd',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  gamesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  gamesTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  gamesSortOptions: {
    flexDirection: 'row',
  },
  sortOption: {
    padding: 8,
    marginLeft: 8,
  },
  gamesList: {
    paddingHorizontal: 5,
    paddingBottom: 100,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 40,
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
    lineHeight: 20,
  },
  emptyStateButton: {
    backgroundColor: '#9d4edd',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
    marginTop: 20,
  },
  emptyStateButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ProfileScreenNew;
