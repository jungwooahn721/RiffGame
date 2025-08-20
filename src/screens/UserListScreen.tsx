import React from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, SafeAreaView } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { users } from '../core/mockData';
import { RootStackScreenProps } from '../navigation/types';

const UserListScreen = ({ navigation, route }: RootStackScreenProps<'UserList'>) => {
  const { type, userId } = route.params;

  // For now, just display all users. In a real app, filter based on type and userId.
  const displayedUsers = users;

  const handleUserPress = (selectedUserId: string) => {
    navigation.navigate('Main', { 
      screen: 'Profile', 
      params: { userId: selectedUserId } 
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="ios-arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Users</Text>
        <View style={{ width: 24 }} />
      </View>
      
      <View style={styles.content}>
        <Text style={styles.title}>{type === 'followers' ? 'Followers' : 'Following'}</Text>
        <FlatList
          data={displayedUsers}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.userItem} onPress={() => handleUserPress(item.id)}>
              <Image source={{ uri: item.avatarUrl }} style={styles.avatar} />
              <Text style={styles.username}>{item.username}</Text>
            </TouchableOpacity>
          )}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0a1e',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingTop: 15,
    paddingBottom: 10,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#fff',
  },
  userItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    padding: 10,
    backgroundColor: '#1a1a2e',
    borderRadius: 10,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  username: {
    fontSize: 18,
    color: '#fff',
  },
});

export default UserListScreen;