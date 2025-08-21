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

  // Calculate total likes on user's games
  const totalLikes = useMemo(() => {
    if (!user) return 0;
    return userGames.reduce((total, game) => total + (game.likes || 0), 0);
  }, [userGames]);

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
          <Image 
            source={{ uri: `https://picsum.photos/seed/placeholder${index + 10}/400/600` }} 
            style={styles.placeholderGridImage} 
          />
          <View style={styles.placeholderGridOverlay}>
            <View style={styles.placeholderGridText} />
            <View style={styles.placeholderGridStats}>
              <View style={styles.placeholderGridStat} />
              <View style={styles.placeholderGridStat} />
              <View style={styles.placeholderGridStat} />
            </View>
          </View>
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

  const renderTopHeader = () => (
    <View style={styles.headerWrapper}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.logoContainer}>
            <Icon name="person-circle" size={20} color="#9d4edd" />
            <Text style={styles.appName}>RiffGame</Text>
          </View>
          <View style={styles.statusIndicator}>
            <View style={styles.profileDot} />
            <Text style={styles.profileText}>{isOwnProfile ? 'Your Profile' : 'User Profile'}</Text>
          </View>
        </View>
        {isOwnProfile && (
          <TouchableOpacity style={styles.settingsButton} onPress={handleSettings}>
            <Icon name="settings-outline" size={24} color="#ffffff" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  const renderHeader = () => (
    <>
      {/* Profile Header with modern design */}
      <View style={styles.profileHeader}>
        <View style={styles.profileMainInfo}>
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
              {isOwnProfile && (
                <TouchableOpacity style={styles.editProfileButton} onPress={handleEditProfile}>
                  <Icon name="create-outline" size={16} color="#8e8e93" />
                </TouchableOpacity>
              )}
            </View>
            
            {user.bio && (
              <Text style={styles.bio} numberOfLines={2}>{user.bio}</Text>
            )}
          </View>
        </View>

        {/* Stats Container */}
        <View style={styles.statsContainer}>
          <TouchableOpacity style={styles.statItem} onPress={handleFollowersPress}>
            <Text style={styles.statNumber}>{formatNumber(user.followers?.length || 0)}</Text>
            <View style={styles.statLabelContainer}>
              <Icon name="people" size={12} color="#8e8e93" />
              <Text style={styles.statLabel}>followers</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.statItem} onPress={handleFollowingPress}>
            <Text style={styles.statNumber}>{formatNumber(user.following?.length || 0)}</Text>
            <View style={styles.statLabelContainer}>
              <Icon name="person-add" size={12} color="#8e8e93" />
              <Text style={styles.statLabel}>following</Text>
            </View>
          </TouchableOpacity>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{formatNumber(userGames.length)}</Text>
            <View style={styles.statLabelContainer}>
              <Icon name="game-controller" size={12} color="#8e8e93" />
              <Text style={styles.statLabel}>games</Text>
            </View>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{formatNumber(totalLikes)}</Text>
            <View style={styles.statLabelContainer}>
              <Icon name="heart" size={12} color="#8e8e93" />
              <Text style={styles.statLabel}>likes</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        {isOwnProfile ? (
          <TouchableOpacity style={styles.createGameButton} onPress={handleCreateGame}>
            <View style={styles.buttonContent}>
              <Icon name="add-circle" size={20} color="#ffffff" />
              <Text style={styles.createGameButtonText}>Create Game</Text>
            </View>
          </TouchableOpacity>
        ) : (
          <View style={styles.socialButtons}>
            <TouchableOpacity 
              style={[styles.followButton, isFollowing && styles.followingButton]} 
              onPress={handleFollowToggle}
            >
              <View style={styles.buttonContent}>
                <Icon 
                  name={isFollowing ? "checkmark-circle" : "person-add"} 
                  size={18} 
                  color={isFollowing ? "#9d4edd" : "#ffffff"} 
                />
                <Text style={[styles.followButtonText, isFollowing && styles.followingButtonText]}>
                  {isFollowing ? 'Following' : 'Follow'}
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity style={styles.messageButton}>
              <View style={styles.buttonContent}>
                <Icon name="chatbubble" size={18} color="#9d4edd" />
                <Text style={styles.messageButtonText}>Message</Text>
              </View>
            </TouchableOpacity>
          </View>
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
          <View style={{ paddingHorizontal: 15 }}>
            {renderTopHeader()}
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
          </View>
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
  topHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 0,
    marginBottom: 12,
    paddingTop: 5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingTop: 5,
  },
  headerWrapper: {
    marginBottom: 16,
    paddingHorizontal: 0,
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
  profileDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#c77dff',
  },
  profileText: {
    fontSize: 12,
    color: '#c77dff',
    fontWeight: '600',
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
    paddingHorizontal: 10,
    paddingTop: 8,
    paddingBottom: 16,
    marginBottom: 12,
  },
  profileMainInfo: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
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
    bottom: -2,
    right: -2,
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
    paddingTop: 4,
  },
  nameSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  editProfileButton: {
    padding: 6,
    backgroundColor: '#1c1c1e',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#3a3a3a',
  },
  settingsButton: {
    padding: 8,
  },
  displayName: {
    fontSize: 22,
    fontWeight: '700',
    color: '#ffffff',
  },
  bio: {
    fontSize: 14,
    color: '#e0e0e0',
    lineHeight: 20,
    marginTop: 4,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 16,
    backgroundColor: '#1c1c1e',
    borderRadius: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#3a3a3a',
  },
  statItem: {
    alignItems: 'center',
  },
  statLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
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
    paddingHorizontal: 10,
    marginBottom: 16,
  },
  socialButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  createGameButton: {
    backgroundColor: '#9d4edd',
    paddingVertical: 16,
    borderRadius: 16,
    shadowColor: '#9d4edd',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  createGameButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
  followButton: {
    flex: 1,
    backgroundColor: '#9d4edd',
    paddingVertical: 14,
    borderRadius: 16,
    shadowColor: '#9d4edd',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
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
    position: 'relative',
    overflow: 'hidden',
  },
  placeholderGridImage: {
    width: '100%',
    height: '70%',
    borderRadius: 8,
  },
  placeholderGridOverlay: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    right: 8,
  },
  placeholderGridText: {
    height: 10,
    backgroundColor: '#5a5a5a',
    borderRadius: 3,
    marginBottom: 4,
    width: '75%',
  },
  placeholderGridStats: {
    flexDirection: 'row',
    gap: 6,
  },
  placeholderGridStat: {
    height: 6,
    width: 16,
    backgroundColor: '#5a5a5a',
    borderRadius: 2,
  },
});

export default ProfileScreen;
