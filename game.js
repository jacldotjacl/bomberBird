const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = 400;
canvas.height = 600;

const birdImg = new Image();
const pillarImg = new Image();
birdImg.src = 'bird.png';
pillarImg.src = 'pillars.png';

let bird = { x: 50, y: 150, width: 40, height: 40, gravity: 2, lift: -30, velocity: 0 };
let pipes = [];
let frame = 0;

document.addEventListener('keydown', () => bird.velocity = bird.lift);

function drawBird() {
  ctx.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);
}

function drawPipes() {
  for (let i = 0; i < pipes.length; i++) {
    let p = pipes[i];
    ctx.drawImage(pillarImg, p.x, 0, p.width, p.top);
    ctx.drawImage(pillarImg, p.x, canvas.height - p.bottom, p.width, p.bottom);
  }
}

function updatePipes() {
  if (frame % 100 === 0) {
    let top = Math.random() * 200 + 50;
    let gap = 120;
    pipes.push({
      x: canvas.width,
      width: 50,
      top,
      bottom: canvas.height - (top + gap)
    });
  }

  pipes.forEach(p => p.x -= 2);
}

function gameLoop() {
  frame++;
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Bird physics
  bird.velocity += bird.gravity;
  bird.y += bird.velocity;

  drawBird();
  updatePipes();
  drawPipes();

  if (bird.y > canvas.height || bird.y < 0) {
    alert('Game over!');
    window.location.reload();
  }

  requestAnimationFrame(gameLoop);
}

birdImg.onload = () => gameLoop();
