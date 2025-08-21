import { User, Game, GameTemplate, Comment } from '../types/entities';

export const gameTemplates: GameTemplate[] = [
  {
    id: 't1',
    name: 'Arcade Platformer',
    description: 'Classic side-scrolling platformer with jumping mechanics',
    dimension: '2D',
    perspective: 'Side-View',
    gameMode: 'Arcade',
    difficulty: 'Medium',
    estimatedPlayTime: '3-5 minutes'
  },
  {
    id: 't2',
    name: 'Top-Down Shooter',
    description: 'Fast-paced action game with enemies and power-ups',
    dimension: '2D',
    perspective: 'Top-Down',
    gameMode: 'Action',
    difficulty: 'Hard',
    estimatedPlayTime: '2-4 minutes'
  },
  {
    id: 't3',
    name: 'Puzzle Maze',
    description: 'Navigate through challenging mazes with obstacles',
    dimension: '2D',
    perspective: 'Top-Down',
    gameMode: 'Puzzle',
    difficulty: 'Easy',
    estimatedPlayTime: '5-10 minutes'
  }
];

export const users: User[] = [
  { 
    id: 'Jungwoo Ahn', 
    username: 'Jungwoo Ahn', 
    displayName: 'Jungwoo Ahn',
    avatarUrl: 'https://i.pravatar.cc/150?u=a042581f4e29026704d', 
    bio: '🎮 Game developer & AI enthusiast\n🚀 Creating the future of gaming',
    verified: true,
    followers: ['Bob Builder', 'Charlie Pixel'],
    following: ['Bob Builder'],
    templates: [gameTemplates[0], gameTemplates[1]],
    createdAt: new Date('2024-01-15'),
    stats: {
      totalGames: 12,
      totalLikes: 1543,
      totalViews: 8921
    }
  },
  { 
    id: 'Bob Builder', 
    username: 'Bob Builder', 
    displayName: 'Bob Builder',
    avatarUrl: 'https://i.pravatar.cc/150?u=a042581f4e29026704e', 
    bio: 'Indie game creator 🎯\nLove puzzle and strategy games',
    verified: false,
    followers: ['Jungwoo Ahn', 'Charlie Pixel'],
    following: ['Jungwoo Ahn', 'Charlie Pixel'],
    templates: [gameTemplates[2]],
    createdAt: new Date('2024-02-10'),
    stats: {
      totalGames: 8,
      totalLikes: 892,
      totalViews: 4521
    }
  },
  { 
    id: 'Charlie Pixel', 
    username: 'Charlie Pixel', 
    displayName: 'Charlie Pixel',
    avatarUrl: 'https://i.pravatar.cc/150?u=a042581f4e29026704f', 
    bio: 'Retro game enthusiast 👾\nPixel art & 8-bit music lover',
    verified: false,
    followers: ['Bob Builder'],
    following: ['Jungwoo Ahn', 'Bob Builder'],
    templates: [],
    createdAt: new Date('2024-03-05'),
    stats: {
      totalGames: 5,
      totalLikes: 367,
      totalViews: 2103
    }
  },
];

export const games: Game[] = [
  { 
    id: 'g1', 
    title: 'Neon Flappy Adventure', 
    description: 'Navigate through neon obstacles in this addictive flappy-style game with power-ups!',
    creator: users[0], 
    thumbnailUrl: 'https://picsum.photos/seed/g1/400/600',
    likes: 120, 
    comments: 12, 
    shares: 4,
    views: 1205,
    tags: ['flappy', 'neon', 'arcade', 'obstacles'],
    category: 'Arcade',
    createdAt: new Date('2024-08-20'),
    updatedAt: new Date('2024-08-20'),
    isPublic: true,
    likedBy: ['Bob Builder', 'Charlie Pixel'],
    template: gameTemplates[0]
  },
  { 
    id: 'g2', 
    title: 'Quantum Maze Runner', 
    description: 'Solve quantum puzzles while racing through an ever-changing maze!',
    creator: users[1], 
    thumbnailUrl: 'https://picsum.photos/seed/g2/400/600',
    likes: 256, 
    comments: 34, 
    shares: 10,
    views: 2890,
    tags: ['maze', 'puzzle', 'quantum', 'runner'],
    category: 'Puzzle',
    createdAt: new Date('2024-08-19'),
    updatedAt: new Date('2024-08-19'),
    isPublic: true,
    likedBy: ['Jungwoo Ahn', 'Charlie Pixel'],
    template: gameTemplates[2]
  },
  { 
    id: 'g3', 
    title: 'Cosmic Pong 3D', 
    description: 'Classic pong reimagined in a 3D cosmic environment with special effects!',
    creator: users[2], 
    thumbnailUrl: 'https://picsum.photos/seed/g3/400/600',
    likes: 50, 
    comments: 5, 
    shares: 2,
    views: 423,
    tags: ['pong', '3d', 'cosmic', 'retro'],
    category: 'Arcade',
    createdAt: new Date('2024-08-18'),
    updatedAt: new Date('2024-08-18'),
    isPublic: true,
    likedBy: ['Jungwoo Ahn'],
    template: gameTemplates[1]
  },
  { 
    id: 'g4', 
    title: 'Pixel Platform Jumper', 
    description: 'Jump through pixel-perfect platforms in this challenging retro platformer!',
    creator: users[0], 
    thumbnailUrl: 'https://picsum.photos/seed/g4/400/600',
    likes: 88, 
    comments: 8, 
    shares: 6,
    views: 987,
    tags: ['platform', 'pixel', 'jumping', 'retro'],
    category: 'Action',
    createdAt: new Date('2024-08-17'),
    updatedAt: new Date('2024-08-17'),
    isPublic: true,
    likedBy: ['Bob Builder'],
    template: gameTemplates[0]
  },
  { 
    id: 'g5', 
    title: 'Galaxy Defense Force', 
    description: 'Defend Earth from alien invasion in this intense space shooter!',
    creator: users[1], 
    thumbnailUrl: 'https://picsum.photos/seed/g5/400/600',
    likes: 432, 
    comments: 55, 
    shares: 23,
    views: 4321,
    tags: ['space', 'shooter', 'aliens', 'defense'],
    category: 'Action',
    createdAt: new Date('2024-08-16'),
    updatedAt: new Date('2024-08-16'),
    isPublic: true,
    likedBy: ['Jungwoo Ahn', 'Charlie Pixel'],
    template: gameTemplates[1]
  },
  { 
    id: 'g6', 
    title: 'Block Dodge Master', 
    description: 'Test your reflexes in this fast-paced block dodging challenge!',
    creator: users[2], 
    thumbnailUrl: 'https://picsum.photos/seed/g6/400/600',
    likes: 300, 
    comments: 40, 
    shares: 15,
    views: 3456,
    tags: ['dodge', 'blocks', 'reflexes', 'challenge'],
    category: 'Arcade',
    createdAt: new Date('2024-08-15'),
    updatedAt: new Date('2024-08-15'),
    isPublic: true,
    likedBy: ['Jungwoo Ahn', 'Bob Builder'],
    gameUrl: 'https://example.com/game/10',
    template: gameTemplates[0]
  }
];

export const comments: Comment[] = [
  {
    id: 'c1',
    gameId: 'g1',
    userId: 'Bob Builder',
    user: users[1],
    content: 'This is amazing! Love the neon aesthetic 🔥',
    createdAt: new Date('2024-08-20T10:30:00Z'),
    likes: 5,
    likedBy: ['Jungwoo Ahn', 'Charlie Pixel']
  },
  {
    id: 'c2',
    gameId: 'g1',
    userId: 'Charlie Pixel',
    user: users[2],
    content: 'So addictive! Can\'t stop playing 😍',
    createdAt: new Date('2024-08-20T11:15:00Z'),
    likes: 3,
    likedBy: ['Jungwoo Ahn']
  },
  {
    id: 'c3',
    gameId: 'g2',
    userId: 'Jungwoo Ahn',
    user: users[0],
    content: 'Genius concept! The quantum mechanics are mind-bending 🧠',
    createdAt: new Date('2024-08-19T14:20:00Z'),
    likes: 8,
    likedBy: ['Bob Builder', 'Charlie Pixel']
  }
];

export const aiGeneratedGameHtml = `
<!DOCTYPE html>
<html>
<head>
    <title>Avoid the Blocks</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">
    <style>
        body, html { margin: 0; padding: 0; overflow: hidden; height: 100%; background-color: #111; }
        canvas { display: block; }
    </style>
</head>
<body>
    <script>
        const canvas = document.createElement('canvas');
        document.body.appendChild(canvas);
        const ctx = canvas.getContext('2d');

        let player, obstacles, score, gameOver;

        function resize() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }

        function init() {
            resize();
            player = { x: canvas.width / 2, y: canvas.height - 50, size: 20, speed: 5 };
            obstacles = [];
            score = 0;
            gameOver = false;
            for (let i = 0; i < 5; i++) {
                spawnObstacle();
            }
            loop();
        }

        function spawnObstacle() {
            obstacles.push({
                x: Math.random() * canvas.width,
                y: -20,
                size: Math.random() * 20 + 10,
                speed: Math.random() * 2 + 1
            });
        }

        function update() {
            if (gameOver) return;

            // Move obstacles
            obstacles.forEach(o => {
                o.y += o.speed;
                if (o.y > canvas.height) {
                    o.y = -20;
                    o.x = Math.random() * canvas.width;
                    score++;
                }

                // Collision detection
                if (
                    player.x < o.x + o.size &&
                    player.x + player.size > o.x &&
                    player.y < o.y + o.size &&
                    player.y + player.size > o.y
                ) {
                    gameOver = true;
                    if (window.ReactNativeWebView) {
                        const message = { event: 'GAME_OVER', score: score };
                        window.ReactNativeWebView.postMessage(JSON.stringify(message));
                    }
                }
            });
        }

        function draw() {
            ctx.fillStyle = '#111';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Draw player
            ctx.fillStyle = '#00f';
            ctx.fillRect(player.x, player.y, player.size, player.size);

            // Draw obstacles
            ctx.fillStyle = '#f00';
            obstacles.forEach(o => ctx.fillRect(o.x, o.y, o.size, o.size));

            // Draw score
            ctx.fillStyle = '#fff';
            ctx.font = '24px Arial';
            ctx.fillText('Score: ' + score, 10, 30);

            if (gameOver) {
                ctx.font = '48px Arial';
                ctx.textAlign = 'center';
                ctx.fillText('Game Over', canvas.width / 2, canvas.height / 2);
            }
        }

        function loop() {
            update();
            draw();
            if (!gameOver) {
                requestAnimationFrame(loop);
            }
        }

        // Touch controls
        canvas.addEventListener('touchmove', (e) => {
            e.preventDefault();
            player.x = e.touches[0].clientX - player.size / 2;
        }, { passive: false });

        window.addEventListener('resize', resize);
        init();
    </script>
</body>
</html>
`;
