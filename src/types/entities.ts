export interface User {
  id: string;
  username: string;
  displayName?: string;
  avatarUrl: string;
  bio?: string;
  verified?: boolean;
  followers: string[]; // User IDs
  following: string[]; // User IDs
  templates?: GameTemplate[];
  createdAt: Date;
  stats: {
    totalGames: number;
    totalLikes: number;
    totalViews: number;
  };
}

export interface Game {
  id: string;
  title: string;
  description?: string;
  creator: User;
  thumbnailUrl: string;
  gameUrl?: string;
  gameHtml?: string;
  tags: string[];
  category: GameCategory;
  likes: number;
  comments: number;
  shares: number;
  views: number;
  createdAt: Date;
  updatedAt: Date;
  isPublic: boolean;
  likedBy: string[]; // User IDs who liked this game
  template?: GameTemplate;
}

export interface Comment {
  id: string;
  gameId: string;
  userId: string;
  user: User;
  content: string;
  createdAt: Date;
  likes: number;
  likedBy: string[];
  replies?: Comment[];
  parentId?: string;
}

export interface GameTemplate {
  id: string;
  name: string;
  description: string;
  dimension: '2D' | '3D';
  perspective: 'Top-Down' | 'Side-View' | 'First-Person' | 'Third-Person';
  gameMode: 'Arcade' | 'Sandbox' | 'Puzzle' | 'Action' | 'Strategy';
  difficulty: 'Easy' | 'Medium' | 'Hard';
  estimatedPlayTime: string; // e.g., "2-5 minutes"
}

export type GameCategory = 
  | 'Action' 
  | 'Puzzle' 
  | 'Arcade' 
  | 'Strategy' 
  | 'Adventure' 
  | 'Simulation'
  | 'Sports'
  | 'Racing';

export interface Notification {
  id: string;
  userId: string;
  type: 'like' | 'comment' | 'follow' | 'game_featured';
  message: string;
  isRead: boolean;
  createdAt: Date;
  relatedGameId?: string;
  relatedUserId?: string;
}
