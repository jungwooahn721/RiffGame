import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { CompositeScreenProps, NavigatorScreenParams } from '@react-navigation/native';
import { Game } from '../types/entities';

export type RootStackParamList = {
  Main: NavigatorScreenParams<MainTabParamList>;
  Game: { gameId: string };
  UserList: { userId: string; type: 'followers' | 'following' };
  CreateGame: undefined;
  GameReels: { games: Game[]; initialGameId: string };
  EditProfile: { user: any };
  Settings: undefined;
};

export type MainTabParamList = {
  Feed: undefined;
  Explore: undefined;
  Create: undefined;
  Profile: { userId?: string };
};

export type RootStackScreenProps<T extends keyof RootStackParamList> = NativeStackScreenProps<RootStackParamList, T>;

export type MainTabScreenProps<T extends keyof MainTabParamList> = CompositeScreenProps<
  BottomTabScreenProps<MainTabParamList, T>,
  NativeStackScreenProps<RootStackParamList>
>;
