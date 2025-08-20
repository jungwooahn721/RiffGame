import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { Game } from '../types/entities';

interface GameGridItemProps {
  game: Game;
  onPress: () => void;
}

const GameGridItem: React.FC<GameGridItemProps> = ({ game, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
      <View style={styles.gamePreview}>
        <View style={styles.gradientOverlay} />
        <Text style={styles.gameTitle}>{game.title}</Text>
      </View>
      <View style={styles.overlay}>
        <View style={styles.statItem}>
          <Icon name="heart-outline" size={14} color="#9d4edd" />
          <Text style={styles.statsText}>{game.likes}</Text>
        </View>
        <View style={styles.statItem}>
          <Icon name="chatbubble-outline" size={14} color="#9d4edd" />
          <Text style={styles.statsText}>{game.comments}</Text>
        </View>
        <View style={styles.statItem}>
          <Icon name="share-social-outline" size={14} color="#9d4edd" />
          <Text style={styles.statsText}>{game.shares}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: (Dimensions.get('window').width - 30) / 2,
    height: (Dimensions.get('window').width - 30) / 2,
    margin: 5,
    backgroundColor: '#16213e',
    borderRadius: 15,
    position: 'relative',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#2a2a5a',
  },
  gamePreview: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#9d4edd',
  },
  gradientOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(199, 125, 255, 0.3)',
  },
  gameTitle: {
    fontWeight: 'bold',
    color: '#ffffff',
    fontSize: 14,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
    zIndex: 1,
    paddingHorizontal: 5,
  },
  overlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 6,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statsText: {
    color: '#ffffff',
    fontSize: 10,
    marginLeft: 3,
    fontWeight: '600',
  },
});

export default GameGridItem;
