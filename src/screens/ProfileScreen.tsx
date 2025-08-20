import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, FlatList, TextInput, SafeAreaView } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { users, games } from '../core/mockData'; // Import games
import { User } from '../types/entities';
import { MainTabScreenProps } from '../navigation/types';
import GameGridItem from '../components/GameGridItem'; // Import GameGridItem

const ProfileScreen = ({ navigation, route }: MainTabScreenProps<'Profile'>) => {
  const userId = route.params?.userId;

  // Ensure users array is not empty before attempting to find/access users[0]
  if (users.length === 0) {
    return (
      <View style={styles.container}>
        <Text>Error: No user data available.</Text>
      </View>
    );
  }

  // Find the user based on userId from navigation params, or default to the first user
  const user: User = userId ? users.find(u => u.id === userId) || users[0] : users[0];

  // This check should ideally not be needed if users.length === 0 is handled,
  // but as a final safeguard against 'user' being undefined/null
  if (!user) {
    return (
      <View style={styles.container}>
        <Text>Error: User not found or data invalid.</Text>
      </View>
    );
  }

  // Dummy data for followers and following
  const followersCount = 1234;
  const followingCount = 567;

  // Filter games created by the current user
  const userGames = games.filter(game => game.creator.id === user.id);

  const handleFollowersPress = () => {
    navigation.navigate('UserList', { userId: user.id, type: 'followers' });
  };

  const handleFollowingPress = () => {
    navigation.navigate('UserList', { userId: user.id, type: 'following' });
  };

  const handleGamePress = (gameId: string) => {
    navigation.navigate('GameReels', { games: userGames, initialGameId: gameId });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.profileHeader}>
        <Image source={{ uri: user.avatarUrl }} style={styles.avatar} />
        <View style={styles.userInfo}>
          <Text style={styles.username}>{user.username}</Text>
          <View style={styles.statsContainer}>
            <TouchableOpacity style={styles.statItem} onPress={handleFollowersPress}>
              <Text style={styles.statNumber}>{followersCount} </Text>
              <Text style={styles.statLabel}>Followers</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.statItem} onPress={handleFollowingPress}>
              <Text style={styles.statNumber}>{followingCount} </Text>
              <Text style={styles.statLabel}>Following</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <TouchableOpacity style={styles.createGameButton} onPress={() => navigation.navigate('CreateGame')}>
        <Text style={styles.createGameButtonText}>+ Create Game</Text>
      </TouchableOpacity>

      <View style={styles.gamesContainer}>
        <Text style={styles.gamesTitle}>Created Games</Text>
        {userGames.length > 0 ? (
          <FlatList
            key="two-columns"
            data={userGames}
            renderItem={({ item }) => (
              <GameGridItem game={item} onPress={() => handleGamePress(item.id)} />
            )}
            keyExtractor={(item) => item.id}
            numColumns={2}
            contentContainerStyle={styles.gamesList}
          />
        ) : (
          <Text style={styles.noGamesText}>No games created yet.</Text>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0a1e',
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#2a2a5a',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 15,
    borderWidth: 2,
    borderColor: '#9d4edd',
  },
  userInfo: {
    flex: 1,
  },
  username: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  statsContainer: {
    flexDirection: 'row',
    marginTop: 5,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },
  statNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#9d4edd',
  },
  statLabel: {
    fontSize: 14,
    color: '#8e8e93',
  },
  createGameButton: {
    backgroundColor: '#9d4edd',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 25,
    alignSelf: 'center',
    marginTop: 20,
    marginBottom: 10,
  },
  createGameButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  gamesContainer: {
    flex: 1,
    width: '100%',
  },
  gamesTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 15,
    marginBottom: 10,
    color: '#ffffff',
  },
  gamesList: {
    alignItems: 'center',
  },
  noGamesText: {
    textAlign: 'center',
    marginTop: 20,
    color: '#8e8e93',
  },
});

export default ProfileScreen;
