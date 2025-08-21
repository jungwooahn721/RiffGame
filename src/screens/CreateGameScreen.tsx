import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
  StatusBar,
  Alert,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import { launchImageLibrary } from 'react-native-image-picker';
import { RootStackScreenProps } from '../navigation/types';
import { games, aiGeneratedGameHtml } from '../core/mockData';
import { useApp } from '../core/AppContext';
import { Game } from '../types/entities';

type SegmentedControlProps = {
  options: string[];
  selectedValue: string;
  onSelect: (value: string) => void;
};

const SegmentedControl: React.FC<SegmentedControlProps> = ({ options, selectedValue, onSelect }) => (
  <View style={styles.segmentedControl}>
    {options.map(option => (
      <TouchableOpacity
        key={option}
        onPress={() => onSelect(option)}
        style={[
          styles.segmentButton,
          selectedValue === option && styles.segmentButtonActive,
        ]}
      >
        <Text style={[
          styles.segmentButtonText,
          selectedValue === option && styles.segmentButtonTextActive,
        ]}>
          {option}
        </Text>
      </TouchableOpacity>
    ))}
  </View>
);

const CreateGameScreen = ({ navigation }: RootStackScreenProps<'CreateGame'>) => {
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [dimension, setDimension] = useState<'2D' | '3D'>('2D');
  const [perspective, setPerspective] = useState<'Top-Down' | 'Side-View'>('Top-Down');
  const [gameMode, setGameMode] = useState<'Arcade' | 'Sandbox'>('Arcade');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const { actions } = useApp();

  const handleImageSelection = () => {
    launchImageLibrary({ mediaType: 'photo', quality: 0.5 }, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorCode) {
        Alert.alert('ImagePicker Error', response.errorMessage ?? 'Unknown error');
      } else if (response.assets && response.assets[0].uri) {
        setSelectedImage(response.assets[0].uri);
        console.log('Selected image URI:', response.assets[0].uri);
      }
    });
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      Alert.alert('Prompt is empty', 'Please describe the game you want to create.');
      return;
    }
    setIsLoading(true);

    let detailedPrompt = `Create a ${dimension}, ${perspective}, ${gameMode} game. The user's description is: "${prompt}"`;
    if (selectedImage) {
      detailedPrompt += ` Use the attached image as visual inspiration.`;
    }

    console.log('--- Sending to AI ---');
    console.log('Detailed Prompt:', detailedPrompt);
    console.log('---------------------');
    
    // Simulate API call to GPT-5
    await new Promise<void>(resolve => setTimeout(resolve, 3000));

    const newGame: Game = {
      id: `game-${Date.now()}`,
      title: prompt.length > 30 ? prompt.substring(0, 27) + '...' : prompt,
      description: `A new game generated from the prompt: "${prompt}"`,
      category: 'Arcade',
      tags: [dimension, perspective, gameMode],
      likes: 0,
      comments: 0,
      shares: 0,
      views: 0,
      creator: {
        id: 'user-1',
        username: 'You',
        avatarUrl: 'https://i.pravatar.cc/150?u=user-1',
        verified: true,
        followers: [],
        following: [],
        createdAt: new Date(),
        stats: {
          totalGames: 1,
          totalLikes: 0,
          totalViews: 0,
        },
      },
      thumbnailUrl: selectedImage || `https://picsum.photos/seed/${Date.now()}/400/600`,
      gameHtml: aiGeneratedGameHtml,
      createdAt: new Date(),
      updatedAt: new Date(),
      isPublic: true,
      likedBy: [],
    };

    // Add the new game to the global state
    actions.addGame(newGame);
    
    setIsLoading(false);

    // Navigate to the reels screen to view the new game
    navigation.navigate('GameReels', {
      games: [newGame, ...games],
      initialGameId: newGame.id,
    });
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <StatusBar barStyle="light-content" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.flex}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.closeButton}>
            <Icon name="close" size={28} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Create with AI</Text>
        </View>
        
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.promptContainer}>
            <TextInput
              style={styles.input}
              placeholder="e.g., 'A retro snake game with a modern twist'"
              placeholderTextColor="#8a8a8a"
              value={prompt}
              onChangeText={setPrompt}
              multiline
            />
            <TouchableOpacity onPress={handleImageSelection} style={styles.imagePickerButton}>
              <Icon name="image-outline" size={24} color="#a0a0a0" />
            </TouchableOpacity>
          </View>

          {selectedImage && (
            <View style={styles.imagePreviewContainer}>
              <Image source={{ uri: selectedImage }} style={styles.imagePreview} />
              <TouchableOpacity style={styles.removeImageButton} onPress={() => setSelectedImage(null)}>
                <Icon name="close-circle" size={24} color="#fff" />
              </TouchableOpacity>
            </View>
          )}

          <View style={styles.optionsContainer}>
            <View style={styles.optionRow}>
              <Text style={styles.optionLabel}>Dimension</Text>
              <SegmentedControl 
                options={['2D', '3D']}
                selectedValue={dimension}
                onSelect={setDimension as any}
              />
            </View>
            <View style={styles.optionRow}>
              <Text style={styles.optionLabel}>Perspective</Text>
              <SegmentedControl 
                options={['Top-Down', 'Side-View']}
                selectedValue={perspective}
                onSelect={setPerspective as any}
              />
            </View>
            <View style={styles.optionRow}>
              <Text style={styles.optionLabel}>Game Mode</Text>
              <SegmentedControl 
                options={['Arcade', 'Sandbox']}
                selectedValue={gameMode}
                onSelect={setGameMode as any}
              />
            </View>
          </View>

          <View style={styles.ideaBox}>
            <Text style={styles.ideaTitle}>Need inspiration?</Text>
            <Text style={styles.ideaText}>• A platformer in a candy world</Text>
            <Text style={styles.ideaText}>• A space shooter against alien ships</Text>
            <Text style={styles.ideaText}>• A simple puzzle game with colors</Text>
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity onPress={handleGenerate} disabled={isLoading || !prompt.trim()} style={[styles.generateButton, (!prompt.trim() || isLoading) && styles.disabledButton]}>
            {isLoading ? (
              <ActivityIndicator size="small" color="#ffffff" />
            ) : (
              <>
                <Icon name="game-controller" size={20} color="#fff" />
                <Text style={styles.buttonText}>Generate Game</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0a1e',
  },
  flex: {
    flex: 1,
  },
  header: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  closeButton: {
    position: 'absolute',
    left: 15,
    top: 10,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  scrollContent: {
    padding: 20,
  },
  promptContainer: {
    backgroundColor: '#1c1c1e',
    borderRadius: 15,
    paddingHorizontal: 15,
    paddingTop: 15,
    paddingBottom: 10,
    minHeight: 120,
    borderWidth: 1,
    borderColor: '#3a3a3a',
    marginBottom: 20,
  },
  input: {
    flex: 1,
    color: '#ffffff',
    fontSize: 16,
    lineHeight: 24,
    textAlignVertical: 'top',
  },
  imagePickerButton: {
    position: 'absolute',
    right: 10,
    bottom: 10,
    backgroundColor: '#333',
    borderRadius: 15,
    padding: 5,
  },
  imagePreviewContainer: {
    marginHorizontal: 0,
    marginBottom: 20,
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
    padding: 2,
  },
  optionsContainer: {
    backgroundColor: '#1c1c1e',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#3a3a3a',
  },
  optionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  optionLabel: {
    color: '#e0e0e0',
    fontSize: 16,
  },
  segmentedControl: {
    flexDirection: 'row',
    backgroundColor: '#101012',
    borderRadius: 10,
    padding: 2,
  },
  segmentButton: {
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  segmentButtonActive: {
    backgroundColor: '#9d4edd',
  },
  segmentButtonText: {
    color: '#a0a0a0',
    fontWeight: '600',
  },
  segmentButtonTextActive: {
    color: '#ffffff',
  },
  ideaBox: {
    marginTop: 10,
    backgroundColor: 'rgba(142, 45, 226, 0.1)',
    borderRadius: 15,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(142, 45, 226, 0.3)',
  },
  ideaTitle: {
    color: '#c77dff',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  ideaText: {
    color: '#e0e0e0',
    fontSize: 14,
    marginBottom: 5,
    lineHeight: 20,
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#2a2a2a',
  },
  generateButton: {
    backgroundColor: '#9d4edd',
    width: '100%',
    height: 50,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  disabledButton: {
    backgroundColor: '#5c5c5c',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
});

export default CreateGameScreen;