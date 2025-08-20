export interface User {
  id: string;
  username: string;
  avatarUrl: string;
  templates?: GameTemplate[];
}

export interface Game {
  id: string;
  title: string;
  creator: User;
  thumbnailUrl: string;
  gameUrl?: string;
  gameHtml?: string;
}

export interface GameTemplate {
  name: string;
  description: string;
  dimension: '2D' | '3D';
  perspective: 'Top-Down' | 'Side-View';
  gameMode: 'Arcade' | 'Sandbox';
}
