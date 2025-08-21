import React from 'react';
import CreateGameScreen from './CreateGameScreen';
import { MainTabScreenProps } from '../navigation/types';

const CreateGameTab = ({ navigation }: MainTabScreenProps<'Create'>) => {
  // Convert MainTabScreenProps to RootStackScreenProps for CreateGameScreen
  const rootStackNavigation = {
    ...navigation,
    navigate: (name: any, params?: any) => {
      if (name === 'GameReels') {
        navigation.navigate(name, params);
      } else {
        navigation.navigate(name, params);
      }
    },
    goBack: () => navigation.goBack(),
  };

  return <CreateGameScreen navigation={rootStackNavigation as any} route={{ params: undefined } as any} />;
};

export default CreateGameTab;
