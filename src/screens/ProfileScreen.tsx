import React, { useMemo, useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, FlatList } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import { useApp } from '../core/AppContext';
import { MainTabScreenProps } from '../navigation/types';
import GameGridItem from '../components/GameGridItem';

const ProfileScreen = ({ navigation, route }: MainTabScreenProps<'Profile'>) => {
  const { state, actions } = useApp();
  const insets = useSafeAreaInsets();
  const userId = route.params?.userId;
  const [activeTab, setActiveTab] = useState<'myGames' | 'liked'>('myGames');
  const [isLoading, setIsLoading] = useState(true);

  // Find the user based on userId from navigation params, or default to current user
  const user = useMemo(() => {
    if (userId) {
      return state.users.find(u => u.id === userId) || state.currentUser;
    }
    return state.currentUser;
  }, [userId, state.users, state.currentUser]);

  // Check if viewing own profile
  const isOwnProfile = state.currentUser?.id === user?.id;

  // Reset tab to myGames when viewing someone else's profile
  useEffect(() => {
    if (!isOwnProfile && activeTab === 'liked') {
      setActiveTab('myGames');
    }
  }, [isOwnProfile, activeTab]);

  // Filter games created by the current profile user
  const userGames = useMemo(() => {
    return state.games.filter(game => game.creator.id === user?.id);
  }, [state.games, user?.id]);

  // Filter liked games (only for own profile)
  const likedGames = useMemo(() => {
    if (!user || !isOwnProfile) return [];
    return state.games.filter(game => game.likedBy.includes(user.id));
  }, [state.games, user?.id, isOwnProfile]);

  // Current games to display based on active tab
  const currentGames = useMemo(() => {
    if (activeTab === 'liked' && !isOwnProfile) {
      // If viewing someone else's profile, always show their games regardless of tab
      return userGames;
    }
    return activeTab === 'myGames' ? userGames : likedGames;
  }, [activeTab, userGames, likedGames, isOwnProfile]);

  // Check if following this user
  const isFollowing = useMemo(() => {
    if (!state.currentUser || !user || isOwnProfile) return false;
    return state.currentUser.following.includes(user.id);
  }, [state.currentUser, user, isOwnProfile]);

  // Simulate loading state
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  if (!user) {
    return (
      <SafeAreaView style={styles.container} edges={['left', 'right']}>
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
    navigation.navigate('GameReels', { games: currentGames, initialGameId: gameId });
  };

  const handleCreateGame = () => {
    if (navigation) {
      navigation.navigate('CreateGame');
    }
  };

  const handleEditProfile = () => {
    navigation.navigate('EditProfile', { user });
  };

  const handleSettings = () => {
    navigation.navigate('Settings');
  };  const renderGamePlaceholder = () => (
    <View style={styles.placeholderCard}>
      <View style={styles.placeholderImage} />
      <View style={styles.placeholderContent}>
        <View style={styles.placeholderTitle} />
        <View style={styles.placeholderStats}>
          <View style={styles.placeholderStat} />
          <View style={styles.placeholderStat} />
          <View style={styles.placeholderStat} />
        </View>
      </View>
    </View>
  );

  const renderPlaceholderGrid = () => (
    <View style={styles.placeholderGrid}>
      {Array.from({ length: 6 }).map((_, index) => (
        <View key={index} style={styles.placeholderGridItem}>
          <View style={styles.placeholderGridImage} />
        </View>
      ))}
    </View>
  );

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
    <>
      {/* Profile Header with integrated settings */}
      <View style={styles.profileHeader}>
        <View style={styles.avatarContainer}>
          <Image source={{ uri: user.avatarUrl }} style={styles.avatar} />
          {user.verified && (
            <View style={styles.verifiedBadge}>
              <Icon name="checkmark" size={12} color="#ffffff" />
            </View>
          )}
        </View>
        
        <View style={styles.userInfo}>
          <View style={styles.nameSection}>
            <Text style={styles.displayName}>{user.displayName}</Text>
            {/* Edit Profile and Settings buttons */}
            {isOwnProfile && (
              <View style={styles.headerButtons}>
                <TouchableOpacity style={styles.editProfileButton} onPress={handleEditProfile}>
                  <Icon name="create-outline" size={20} color="#8e8e93" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.settingsButton} onPress={handleSettings}>
                  <Icon name="settings-outline" size={20} color="#8e8e93" />
                </TouchableOpacity>
              </View>
            )}
          </View>
          
          <View style={styles.statsContainer}>
            <TouchableOpacity style={styles.statItem} onPress={handleFollowersPress}>
              <Text style={styles.statNumber}>{user.followers?.length || '0'}</Text>
              <Text style={styles.statLabel}>followers</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.statItem} onPress={handleFollowingPress}>
              <Text style={styles.statNumber}>{user.following?.length || '0'}</Text>
              <Text style={styles.statLabel}>following</Text>
            </TouchableOpacity>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{userGames.length}</Text>
              <Text style={styles.statLabel}>games</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        {isOwnProfile ? (
          <TouchableOpacity style={styles.createGameButton} onPress={handleCreateGame}>
            <Icon name="add" size={16} color="#ffffff" />
            <Text style={styles.createGameButtonText}>Create Game</Text>
          </TouchableOpacity>
        ) : (
          <>
            <TouchableOpacity 
              style={[styles.followButton, isFollowing && styles.followingButton]} 
              onPress={handleFollowToggle}
            >
              <Icon 
                name={isFollowing ? "checkmark" : "add"} 
                size={16} 
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
    </>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Icon 
        name={activeTab === 'myGames' ? "game-controller-outline" : "heart-outline"} 
        size={64} 
        color="#8e8e93" 
      />
      <Text style={styles.emptyStateTitle}>
        {activeTab === 'myGames' 
          ? (isOwnProfile ? 'No games yet' : 'No games created')
          : 'No liked games'
        }
      </Text>
      <Text style={styles.emptyStateSubtitle}>
        {activeTab === 'myGames' 
          ? (isOwnProfile 
              ? 'Start creating your first game!' 
              : `${user.displayName} hasn't created any games yet.`
            )
          : (isOwnProfile 
              ? 'Games you like will appear here' 
              : `${user.displayName} hasn't liked any games yet.`
            )
        }
      </Text>
      {isOwnProfile && activeTab === 'myGames' && (
        <TouchableOpacity style={styles.emptyStateButton} onPress={handleCreateGame}>
          <Text style={styles.emptyStateButtonText}>Create Your First Game</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right']}>
      <FlatList
        data={isLoading ? [] : currentGames}
        renderItem={({ item }) => (
          <GameGridItem 
            game={item} 
            onPress={() => handleGamePress(item.id)} 
          />
        )}
        numColumns={2}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={() => (
          <>
            {renderHeader()}
            
            {/* Games Toggle Section */}
            {isOwnProfile && (
              <View style={styles.gamesToggleContainer}>
                <TouchableOpacity 
                  style={[styles.toggleButton, activeTab === 'myGames' && styles.activeToggleButton]}
                  onPress={() => setActiveTab('myGames')}
                >
                  <Icon 
                    name="grid-outline" 
                    size={24} 
                    color={activeTab === 'myGames' ? '#ffffff' : '#8e8e93'} 
                  />
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[styles.toggleButton, activeTab === 'liked' && styles.activeToggleButton]}
                  onPress={() => setActiveTab('liked')}
                >
                  <Icon 
                    name="heart-outline" 
                    size={24} 
                    color={activeTab === 'liked' ? '#ffffff' : '#8e8e93'} 
                  />
                </TouchableOpacity>
              </View>
            )}
            
            {/* Show placeholder when loading */}
            {isLoading && renderPlaceholderGrid()}
          </>
        )}
        ListEmptyComponent={!isLoading ? renderEmptyState : null}
        contentContainerStyle={[
          { paddingHorizontal: 10, paddingBottom: 50 + insets.bottom },
          (currentGames.length === 0 && !isLoading) && { flex: 1 }
        ]}
        columnWrapperStyle={styles.gridRow}
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
  gridRow: {
    justifyContent: 'space-evenly',
    paddingHorizontal: 0,
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
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 4,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 16,
  },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 3,
    borderColor: '#9d4edd',
  },
  verifiedBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    backgroundColor: '#9d4edd',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#1a1a2e',
  },
  userInfo: {
    flex: 1,
  },
  nameSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  editProfileButton: {
    padding: 4,
    marginRight: 8,
  },
  settingsButton: {
    padding: 4,
  },
  displayName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 8,
  },
  statsContainer: {
    flexDirection: 'row',
  },
  statItem: {
    marginRight: 24,
  },
  statNumber: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ffffff',
  },
  statLabel: {
    fontSize: 11,
    color: '#8e8e93',
    fontWeight: '500',
    marginTop: 2,
  },
  actionButtons: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 16,
  },
  createGameButton: {
    flex: 1,
    backgroundColor: '#9d4edd',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 8,
    shadowColor: '#9d4edd',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  createGameButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
    marginLeft: 8,
  },
  followButton: {
    flex: 1,
    backgroundColor: '#9d4edd',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    shadowColor: '#9d4edd',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  followingButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#9d4edd',
    shadowOpacity: 0,
    elevation: 0,
  },
  followButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
    marginLeft: 8,
  },
  followingButtonText: {
    color: '#9d4edd',
  },
  messageButton: {
    flex: 1,
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#9d4edd',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 12,
  },
  messageButtonText: {
    color: '#9d4edd',
    fontSize: 16,
    fontWeight: '700',
    marginLeft: 8,
  },
  gamesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12, // Reduced from 16
  },
  gamesToggleContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 1,
    marginTop: -12,
    borderBottomWidth: 1,
    borderBottomColor: '#2a2a5a',
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeToggleButton: {
    borderBottomColor: '#ffffff',
  },
  gamesList: {
    paddingHorizontal: 16,
    paddingBottom: 60,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 40,
    backgroundColor: '#1a1a2e',
    borderRadius: 16,
    marginHorizontal: 16,
    borderWidth: 1,
    borderColor: '#2a2a5a',
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#ffffff',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateSubtitle: {
    fontSize: 14,
    color: '#8e8e93',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 16,
  },
  emptyStateButton: {
    backgroundColor: '#9d4edd',
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 12,
    marginTop: 12,
    shadowColor: '#9d4edd',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  emptyStateButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
  // Placeholder styles for loading state
  placeholderCard: {
    backgroundColor: '#2a2a2a',
    marginHorizontal: 4,
    marginBottom: 8,
    borderRadius: 8,
    overflow: 'hidden',
  },
  placeholderImage: {
    width: '100%',
    aspectRatio: 1,
    backgroundColor: '#3a3a3a',
  },
  placeholderContent: {
    padding: 8,
  },
  placeholderTitle: {
    height: 16,
    backgroundColor: '#3a3a3a',
    marginBottom: 8,
    borderRadius: 4,
  },
  placeholderStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  placeholderStat: {
    height: 12,
    backgroundColor: '#3a3a3a',
    borderRadius: 3,
    width: '30%',
  },
  placeholderGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 12,
    marginTop: 16,
  },
  placeholderGridItem: {
    width: '48%',
    aspectRatio: 1,
    backgroundColor: '#3a3a3a',
    marginHorizontal: '1%',
    marginBottom: 8,
    borderRadius: 8,
  },
  placeholderGridImage: {
    width: '100%',
    height: '100%',
    backgroundColor: '#3a3a3a',
    borderRadius: 8,
  },
});

export default ProfileScreen;
