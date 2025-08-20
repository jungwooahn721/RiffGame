import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { Game } from '../types/entities';

interface GameCardProps {
  game: Game;
  onPress: () => void;
}

const GameCard: React.FC<GameCardProps> = ({ game, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <View style={styles.card}>
        <View style={styles.header}>
          <Image source={{ uri: game.creator.avatarUrl }} style={styles.avatar} />
          <Text style={styles.username}>{game.creator.username}</Text>
        </View>
        <View style={styles.gamePreview} />
        <View style={styles.footer}>
          <Text style={styles.title}>{game.title}</Text>
          <View style={styles.stats}>
            <TouchableOpacity style={styles.statButton}>
              <Icon name="heart-outline" size={20} color="#9d4edd" />
              <Text style={styles.statText}>{game.likes}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.statButton}>
              <Icon name="chatbubble-outline" size={20} color="#9d4edd" />
              <Text style={styles.statText}>{game.comments}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.statButton}>
              <Icon name="share-social-outline" size={20} color="#9d4edd" />
              <Text style={styles.statText}>{game.shares}</Text>
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
    padding: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#2a2a5a',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#9d4edd',
  },
  username: {
    fontWeight: 'bold',
    color: '#ffffff',
  },
  gamePreview: {
    height: 200,
    backgroundColor: '#9d4edd',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  stats: {
    flexDirection: 'row',
  },
  statButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 15,
  },
  statText: {
    marginLeft: 5,
    color: '#9d4edd',
  },
});

export default GameCard;