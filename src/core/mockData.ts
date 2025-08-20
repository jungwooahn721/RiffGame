import { User, Game } from '../types/entities';

export const users: User[] = [
  { id: 'u1', username: 'Jungwoo Ahn', avatarUrl: 'https://i.pravatar.cc/150?u=a042581f4e29026704d', templates: [] },
  { id: 'u2', username: 'Bob', avatarUrl: 'https://i.pravatar.cc/150?u=a042581f4e29026704e', templates: [] },
  { id: 'u3', username: 'Charlie', avatarUrl: 'https://i.pravatar.cc/150?u=a042581f4e29026704f', templates: [] },
];

export const games: Game[] = [
  { id: 'g1', title: 'Flappy Clone', creator: users[0], likes: 120, comments: 12, shares: 4 },
  { id: 'g2', title: 'Maze Runner', creator: users[1], likes: 256, comments: 34, shares: 10 },
  { id: 'g3', title: 'Pong 3D', creator: users[2], likes: 50, comments: 5, shares: 2 },
  { id: 'g4', title: 'Platform Jumper', creator: users[0], likes: 88, comments: 8, shares: 6 },
  { id: 'g5', title: 'Space Shooter', creator: users[1], likes: 432, comments: 55, shares: 23 },
  { id: 'g6', title: 'Avoid the Blocks', creator: users[2], likes: 300, comments: 40, shares: 15, gameUrl: 'https://example.com/game/10' }
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
