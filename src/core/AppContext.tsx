import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { Game, User, Comment } from '../types/entities';
import { games as initialGames, users as initialUsers, comments as initialComments } from './mockData';

interface AppState {
  games: Game[];
  users: User[];
  comments: Comment[];
  currentUser: User | null;
  loading: boolean;
  error: string | null;
}

type AppAction = 
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_CURRENT_USER'; payload: User }
  | { type: 'LIKE_GAME'; payload: { gameId: string; userId: string } }
  | { type: 'UNLIKE_GAME'; payload: { gameId: string; userId: string } }
  | { type: 'ADD_COMMENT'; payload: Comment }
  | { type: 'ADD_GAME'; payload: Game }
  | { type: 'FOLLOW_USER'; payload: { followerId: string; followingId: string } }
  | { type: 'UNFOLLOW_USER'; payload: { followerId: string; followingId: string } }
  | { type: 'INCREMENT_VIEWS'; payload: string }
  | { type: 'SHARE_GAME'; payload: string };

const initialState: AppState = {
  games: initialGames,
  users: initialUsers,
  comments: initialComments,
  currentUser: initialUsers[0], // Default to first user
  loading: false,
  error: null,
};

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    
    case 'SET_CURRENT_USER':
      return { ...state, currentUser: action.payload };
    
    case 'LIKE_GAME':
      return {
        ...state,
        games: state.games.map(game => 
          game.id === action.payload.gameId 
            ? { 
                ...game, 
                likes: game.likes + 1,
                likedBy: [...game.likedBy, action.payload.userId]
              }
            : game
        )
      };
    
    case 'UNLIKE_GAME':
      return {
        ...state,
        games: state.games.map(game => 
          game.id === action.payload.gameId 
            ? { 
                ...game, 
                likes: Math.max(0, game.likes - 1),
                likedBy: game.likedBy.filter(id => id !== action.payload.userId)
              }
            : game
        )
      };
    
    case 'ADD_COMMENT':
      return {
        ...state,
        comments: [action.payload, ...state.comments],
        games: state.games.map(game => 
          game.id === action.payload.gameId 
            ? { ...game, comments: game.comments + 1 }
            : game
        )
      };
    
    case 'ADD_GAME':
      return {
        ...state,
        games: [action.payload, ...state.games]
      };
    
    case 'FOLLOW_USER':
      return {
        ...state,
        users: state.users.map(user => {
          if (user.id === action.payload.followerId) {
            return { ...user, following: [...user.following, action.payload.followingId] };
          }
          if (user.id === action.payload.followingId) {
            return { ...user, followers: [...user.followers, action.payload.followerId] };
          }
          return user;
        })
      };
    
    case 'UNFOLLOW_USER':
      return {
        ...state,
        users: state.users.map(user => {
          if (user.id === action.payload.followerId) {
            return { ...user, following: user.following.filter(id => id !== action.payload.followingId) };
          }
          if (user.id === action.payload.followingId) {
            return { ...user, followers: user.followers.filter(id => id !== action.payload.followerId) };
          }
          return user;
        })
      };
    
    case 'INCREMENT_VIEWS':
      return {
        ...state,
        games: state.games.map(game => 
          game.id === action.payload 
            ? { ...game, views: game.views + 1 }
            : game
        )
      };
    
    case 'SHARE_GAME':
      return {
        ...state,
        games: state.games.map(game => 
          game.id === action.payload 
            ? { ...game, shares: game.shares + 1 }
            : game
        )
      };
    
    default:
      return state;
  }
}

const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  actions: {
    likeGame: (gameId: string) => void;
    unlikeGame: (gameId: string) => void;
    addComment: (gameId: string, content: string) => void;
    followUser: (userId: string) => void;
    unfollowUser: (userId: string) => void;
    incrementViews: (gameId: string) => void;
    shareGame: (gameId: string) => void;
    addGame: (game: Game) => void;
  };
} | null>(null);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  const actions = {
    likeGame: (gameId: string) => {
      if (state.currentUser) {
        const game = state.games.find(g => g.id === gameId);
        if (game && !game.likedBy.includes(state.currentUser.id)) {
          dispatch({ type: 'LIKE_GAME', payload: { gameId, userId: state.currentUser.id } });
        }
      }
    },
    
    unlikeGame: (gameId: string) => {
      if (state.currentUser) {
        dispatch({ type: 'UNLIKE_GAME', payload: { gameId, userId: state.currentUser.id } });
      }
    },
    
    addComment: (gameId: string, content: string) => {
      if (state.currentUser) {
        const comment: Comment = {
          id: `c${Date.now()}`,
          gameId,
          userId: state.currentUser.id,
          user: state.currentUser,
          content,
          createdAt: new Date(),
          likes: 0,
          likedBy: []
        };
        dispatch({ type: 'ADD_COMMENT', payload: comment });
      }
    },
    
    followUser: (userId: string) => {
      if (state.currentUser && state.currentUser.id !== userId) {
        dispatch({ 
          type: 'FOLLOW_USER', 
          payload: { followerId: state.currentUser.id, followingId: userId } 
        });
      }
    },
    
    unfollowUser: (userId: string) => {
      if (state.currentUser) {
        dispatch({ 
          type: 'UNFOLLOW_USER', 
          payload: { followerId: state.currentUser.id, followingId: userId } 
        });
      }
    },
    
    incrementViews: (gameId: string) => {
      dispatch({ type: 'INCREMENT_VIEWS', payload: gameId });
    },
    
    shareGame: (gameId: string) => {
      dispatch({ type: 'SHARE_GAME', payload: gameId });
    },
    
    addGame: (game: Game) => {
      dispatch({ type: 'ADD_GAME', payload: game });
    }
  };

  return (
    <AppContext.Provider value={{ state, dispatch, actions }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

export default AppContext;
