const config = {
  type: Phaser.AUTO,
  width: window.innerWidth,
  height: window.innerHeight,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 300 },
      debug: false
    }
  },
  scene: {
    preload: preload,
    create: create,
    update: update
  }
};

const game = new Phaser.Game(config);

let bird;
let pipes;
let score = 0;
let scoreText;

function preload() {
  // We'll use simple geometric shapes for assets to avoid loading images
}

function create() {
  // Bird
  bird = this.physics.add.sprite(100, 250, 'bird');
  bird.setCollideWorldBounds(true);
  
  // Pipes
  pipes = this.physics.add.group();
  
  // Score
  scoreText = this.add.text(16, 16, 'Score: 0', { fontSize: '32px', fill: '#fff' });

  // Pipe generation timer
  this.time.addEvent({
    delay: 1500,
    callback: addPipe,
    callbackScope: this,
    loop: true
  });

  // Input
  this.input.on('pointerdown', () => {
    bird.setVelocityY(-200);
  });
  
  // Create bird graphics
  const birdGraphics = this.make.graphics({ x: 0, y: 0, add: false });
  birdGraphics.fillStyle(0xffff00);
  birdGraphics.fillRect(0, 0, 20, 20);
  birdGraphics.generateTexture('bird', 20, 20);
}

function update() {
  if (bird.y > window.innerHeight || bird.y < 0) {
    this.scene.restart();
  }
  
  this.physics.world.overlap(bird, pipes, () => {
    this.scene.restart();
  }, null, this);
}

function addPipe() {
  const pipeX = window.innerWidth;
  const pipeY = Math.floor(Math.random() * 300) + 100;
  const gap = 150;

  const pipeTop = pipes.create(pipeX, pipeY - gap, 'pipe');
  const pipeBottom = pipes.create(pipeX, pipeY + gap, 'pipe');
  
  // Create pipe graphics
  const pipeGraphics = this.make.graphics({ x: 0, y: 0, add: false });
  pipeGraphics.fillStyle(0x00ff00);
  pipeGraphics.fillRect(0, 0, 50, 300);
  pipeGraphics.generateTexture('pipe', 50, 300);

  pipeTop.setOrigin(0, 1);
  pipeBottom.setOrigin(0, 0);
  
  pipes.setVelocityX(-100);

  pipeTop.setImmovable(true);
  pipeBottom.setImmovable(true);
  
  score++;
  scoreText.setText('Score: ' + score);
}
