// src/services/api.ts

const mockGameCode = `
<!DOCTYPE html>
<html>
<head>
<style>
    body, html {
        margin: 0;
        padding: 0;
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: #1a1a1a;
        overflow: hidden;
    }
    .container {
        width: 100%;
        height: 100%;
        position: relative;
    }
    .particle {
        position: absolute;
        background-color: #fff;
        border-radius: 50%;
        opacity: 0;
        animation: float 10s infinite ease-in-out;
    }
    @keyframes float {
        0% {
            transform: translateY(100vh) scale(0.5);
            opacity: 0;
        }
        50% {
            opacity: 1;
        }
        100% {
            transform: translateY(-100vh) scale(1.5);
            opacity: 0;
        }
    }
</style>
</head>
<body>
<div class="container" id="particle-container"></div>
<script>
    const container = document.getElementById('particle-container');
    const colors = ['#FFD700', '#FF69B4', '#00FFFF', '#7FFF00'];
    for (let i = 0; i < 50; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        const size = Math.random() * 10 + 5;
        particle.style.width = \`\${size}px\`;
        particle.style.height = \`\${size}px\`;
        particle.style.left = \`\${Math.random() * 100}%\`;
        particle.style.top = \`\${Math.random() * 100}%\`;
        particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        particle.style.animationDelay = \`\${Math.random() * 10}s\`;
        particle.style.animationDuration = \`\${Math.random() * 10 + 5}s\`;
        container.appendChild(particle);
    }
</script>
</body>
</html>
`;

export const generateGameCode = async (prompt: string): Promise<string> => {
  console.log('Generating game for prompt:', prompt);
  // In a real app, you would make a network request to your GPT API here.
  // For now, we'll just return a mock game code after a short delay.
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(mockGameCode);
    }, 1500);
  });
};
