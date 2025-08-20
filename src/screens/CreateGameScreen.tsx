import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  ScrollView,
  SafeAreaView,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { launchImageLibrary } from 'react-native-image-picker';
import { games, aiGeneratedGameHtml } from '../core/mockData';
import { RootStackScreenProps } from '../navigation/types';

const systemPrompt = `You are an expert game developer...`; // Full prompt remains the same

type OptionButtonProps = {
  text: string;
  isSelected: boolean;
  onPress: () => void;
};

const OptionButton = ({ text, isSelected, onPress }: OptionButtonProps) => (
  <TouchableOpacity
    style={[styles.option, isSelected ? styles.optionSelected : {}]}
    onPress={onPress}>
    <Text style={styles.optionText}>{text}</Text>
  </TouchableOpacity>
);

const CreateGameScreen = ({ navigation }: RootStackScreenProps<'CreateGame'>) => {
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [dimension, setDimension] = useState<'2D' | '3D'>('2D');
  const [perspective, setPerspective] = useState<'Top-Down' | 'Side-View'>('Top-Down');
  const [gameMode, setGameMode] = useState<'Arcade' | 'Sandbox'>('Arcade');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const handleImageSelection = () => {
    launchImageLibrary({ mediaType: 'photo', quality: 0.5 }, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorCode) {
        Alert.alert('ImagePicker Error', response.errorMessage);
      } else if (response.assets && response.assets[0].uri) {
        setSelectedImage(response.assets[0].uri);
        // In a real app, you would convert this image to base64 to send to the API
        console.log('Selected image URI:', response.assets[0].uri);
      }
    });
  };

  const handleGenerateGame = async () => {
    if (!prompt.trim()) {
      Alert.alert('Prompt is empty', 'Please describe the game you want to create.');
      return;
    }
    setIsLoading(true);

    const detailedPrompt = `Create a ${dimension}, ${perspective}, ${gameMode} game. The user's description is: "${prompt}"`;

    console.log('--- Sending to AI ---');
    console.log('System Prompt:', systemPrompt);
    console.log('User Prompt:', detailedPrompt);
    console.log('---------------------');

    await new Promise(resolve => setTimeout(resolve, 3000));

    const newGame = {
      id: `game-${Date.now()}`,
      title: prompt.substring(0, 30).trim() + '...',
      creator: {
        id: 'user-1',
        username: 'You',
        avatarUrl: 'https://i.pravatar.cc/150?u=user-1',
        followers: [],
        following: [],
      },
      thumbnailUrl: `https://picsum.photos/seed/${Date.now()}/400/600`,
      gameHtml: aiGeneratedGameHtml,
    };

    games.unshift(newGame);
    setIsLoading(false);

    navigation.navigate('GameReels', {
      games: [newGame],
      initialGameId: newGame.id,
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon name="arrow-back-outline" size={28} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Create Game</Text>
          <View style={{ width: 28 }} />
        </View>

        <View style={styles.promptContainer}>
          <TextInput
            style={styles.promptInput}
            placeholder="Describe your game..."
            placeholderTextColor="#8e8e93"
            value={prompt}
            onChangeText={setPrompt}
            multiline
          />
          <View style={styles.promptIcons}>
            <TouchableOpacity onPress={handleImageSelection}>
              <Icon name="image-outline" size={24} color="#8e8e93" />
            </TouchableOpacity>
            <Icon name="help-circle-outline" size={24} color="#8e8e93" />
          </View>
        </View>

        {selectedImage && (
          <View style={styles.imagePreviewContainer}>
            <Image source={{ uri: selectedImage }} style={styles.imagePreview} />
            <TouchableOpacity style={styles.removeImageButton} onPress={() => setSelectedImage(null)}>
              <Icon name="close-circle" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.optionsSection}>
          <Text style={styles.optionsTitle}>Options</Text>
          <View style={styles.optionRow}>
            <Text style={styles.optionLabel}>Dimension</Text>
            <View style={styles.optionGroup}>
              <OptionButton text="2D" isSelected={dimension === '2D'} onPress={() => setDimension('2D')} />
              <OptionButton text="3D" isSelected={dimension === '3D'} onPress={() => setDimension('3D')} />
            </View>
          </View>
          <View style={styles.optionRow}>
            <Text style={styles.optionLabel}>Perspective</Text>
            <View style={styles.optionGroup}>
              <OptionButton text="Top-Down" isSelected={perspective === 'Top-Down'} onPress={() => setPerspective('Top-Down')} />
              <OptionButton text="Side-View" isSelected={perspective === 'Side-View'} onPress={() => setPerspective('Side-View')} />
            </View>
          </View>
          <View style={styles.optionRow}>
            <Text style={styles.optionLabel}>Game Mode</Text>
            <View style={styles.optionGroup}>
              <OptionButton text="Arcade" isSelected={gameMode === 'Arcade'} onPress={() => setGameMode('Arcade')} />
              <OptionButton text="Sandbox" isSelected={gameMode === 'Sandbox'} onPress={() => setGameMode('Sandbox')} />
            </View>
          </View>
        </View>
      </ScrollView>
      <View style={styles.footer}>
        <TouchableOpacity style={styles.createButton} onPress={handleGenerateGame} disabled={isLoading}>
          {isLoading ? <ActivityIndicator color="#fff" /> : <Text style={styles.createButtonText}>Create Game</Text>}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0f0a1e',
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  promptContainer: {
    backgroundColor: '#1a1a2e',
    borderRadius: 15,
    marginHorizontal: 15,
    padding: 15,
    minHeight: 200,
  },
  promptInput: {
    flex: 1,
    color: '#fff',
    fontSize: 16,
    textAlignVertical: 'top',
  },
  promptIcons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  imagePreviewContainer: {
    marginHorizontal: 15,
    marginTop: 15,
    position: 'relative',
  },
  imagePreview: {
    width: '100%',
    height: 200,
    borderRadius: 10,
  },
  removeImageButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 12,
  },
  optionsSection: {
    backgroundColor: '#1a1a2e',
    borderRadius: 15,
    margin: 15,
    padding: 20,
  },
  optionsTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  optionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  optionLabel: {
    color: '#fff',
    fontSize: 16,
  },
  optionGroup: {
    flexDirection: 'row',
    backgroundColor: '#0f0a1e',
    borderRadius: 20,
    padding: 4,
  },
  option: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 16,
  },
  optionSelected: {
    backgroundColor: '#9d4edd',
  },
  optionText: {
    color: '#fff',
    fontWeight: '600',
  },
  footer: {
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: '#2a2a5a',
  },
  createButton: {
    backgroundColor: '#9d4edd',
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: 'center',
  },
  createButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default CreateGameScreen;