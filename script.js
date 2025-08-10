const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Load images
const headImg = new Image();
const bodyImg = new Image();
const foodImg = new Image();

headImg.src = 'assets/snake-head.png';
bodyImg.src = 'assets/snake-body.png';
foodImg.src = 'assets/food.png';

const deathSound = new Audio('assets/death.wav');
const eatSound = new Audio('assets/coin.mp3');

const startScreen = document.getElementById('start-screen');
const gameOverScreen = document.getElementById('game-over-screen');
const startBtn = document.getElementById('start-btn');
const restartBtn = document.getElementById('restart-btn');

let box = 20;
let snake = [];
let food = {};
let direction = 'RIGHT';
let game;

function initGame() {
  snake = [{ x: 9 * box, y: 10 * box }];
  direction = 'RIGHT';
  generateFood();
  game = setInterval(draw, 100);
}

function generateFood() {
  food = {
    x: Math.floor(Math.random() * 19 + 1) * box,
    y: Math.floor(Math.random() * 19 + 1) * box,
  };
}

document.addEventListener('keydown', e => {
  if (e.key === 'ArrowLeft' || e.key === 'a' && direction !== 'RIGHT') direction = 'LEFT';
  if (e.key === 'ArrowUp' || e.key === 'w' && direction !== 'DOWN') direction = 'UP';
  if (e.key === 'ArrowRight' || e.key === 'd' && direction !== 'LEFT') direction = 'RIGHT';
  if (e.key === 'ArrowDown' || e.key === 's' && direction !== 'UP') direction = 'DOWN';
});

function draw() {
  // Gradient background
let gradient = ctx.createLinearGradient(0, 0, 0, canvas.height); // vertical
gradient.addColorStop(0, '#d76620');  // top color (Sapphire Blue)
gradient.addColorStop(1, '#5c688a');  // bottom color (Deep Navy)

ctx.fillStyle = gradient;
ctx.fillRect(0, 0, canvas.width, canvas.height);

// Draw snake
for (let i = 0; i < snake.length; i++) {
  const segment = snake[i];
  if (i === 0) {
    ctx.drawImage(headImg, segment.x, segment.y, box, box);
  } else {
    ctx.drawImage(bodyImg, segment.x, segment.y, box, box);
  }
}

// Draw food
ctx.drawImage(foodImg, food.x, food.y, box, box);


  ctx.drawImage(foodImg, food.x, food.y, box, box);

  let headX = snake[0].x;
  let headY = snake[0].y;

  if (direction === 'LEFT') headX -= box;
  if (direction === 'RIGHT') headX += box;
  if (direction === 'UP') headY -= box;
  if (direction === 'DOWN') headY += box;

  // Warp through walls
  if (headX < 0) headX = canvas.width - box;
  else if (headX >= canvas.width) headX = 0;
  if (headY < 0) headY = canvas.height - box;
  else if (headY >= canvas.height) headY = 0;

  if (collision({ x: headX, y: headY }, snake)) {
    clearInterval(game);
    deathSound.play();
    canvas.classList.add('hidden');
    gameOverScreen.classList.remove('hidden');
    return;
  }

  if (headX === food.x && headY === food.y) {
    generateFood();
    eatSound.play();
  } else {
    snake.pop();
  }

  snake.unshift({ x: headX, y: headY });
}

function collision(head, body) {
  return body.some(segment => head.x === segment.x && head.y === segment.y);
}

startBtn.onclick = () => {
  startScreen.classList.add('hidden');
  canvas.classList.remove('hidden');
  document.getElementById('controls').classList.remove('hidden');
  initGame();
};

restartBtn.onclick = () => {
  gameOverScreen.classList.add('hidden');
  canvas.classList.remove('hidden');
  document.getElementById('controls').classList.remove('hidden');
  initGame();
};


function setDirection(dir) {
  if (dir === 'LEFT' && direction !== 'RIGHT') direction = 'LEFT';
  if (dir === 'RIGHT' && direction !== 'LEFT') direction = 'RIGHT';
  if (dir === 'UP' && direction !== 'DOWN') direction = 'UP';
  if (dir === 'DOWN' && direction !== 'UP') direction = 'DOWN';
}
