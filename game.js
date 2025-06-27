const canvas = document.getElementById('gameCanvas');
const ctx    = canvas.getContext('2d');
canvas.width  = 400;
canvas.height = 600;

const birdImg   = new Image();
const pillarImg = new Image();
birdImg.src     = 'bird.png';
pillarImg.src   = 'pillars.png';

let bird = {
  x:       50,
  y:      200,
  width:   40,
  height:  40,
  gravity: 1.2,
  lift:   -20,
  velocity:0
};

let pipes       = [];
let frame       = 0;
let gameStarted = false;
let gamePlaying = false;   // <<< new: only true after first tap
let countdown   = 3;

// 1) TITLE SCREEN -> COUNTDOWN
document.getElementById('playButton').addEventListener('click', () => {
  document.getElementById('startScreen').style.display = 'none';
  document.getElementById('countdown').style.display   = 'block';
  runCountdown();
});

function runCountdown() {
  const countEl = document.getElementById('countdown');
  const interval = setInterval(() => {
    countEl.textContent = countdown--;
    if (countdown < 0) {
      clearInterval(interval);
      countEl.style.display = 'none';
      gameStarted = true;
      requestAnimationFrame(gameLoop);
    }
  }, 1000);
}

// 2) FIRST TAP STARTS THE ACTION
document.addEventListener('keydown', e => {
  if (!gameStarted) return;
  if (!gamePlaying) {
    // on very first tap, start physics + spawn pipes
    gamePlaying    = true;
    bird.velocity  = bird.lift;
    return;
  }
  // subsequent taps:
  bird.velocity = bird.lift;
});

// DRAWING ROUTINES
function drawBird() {
  ctx.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);
}
function drawPipes() {
  pipes.forEach(p => {
    ctx.drawImage(pillarImg, p.x, 0, p.width, p.top);
    ctx.drawImage(pillarImg, p.x, canvas.height - p.bottom, p.width, p.bottom);
  });
}
function updatePipes() {
  if (frame % 100 === 0) {
    const top = Math.random() * 200 + 50;
    const gap = 120;
    pipes.push({
      x:      canvas.width,
      width:  50,
      top:    top,
      bottom: canvas.height - (top + gap)
    });
  }
  pipes.forEach(p => p.x -= 2);
}

// 3) GAME LOOP
function gameLoop() {
  frame++;
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (!gamePlaying) {
    // bird just sits there until first tap
    drawBird();
    return requestAnimationFrame(gameLoop);
  }

  // physics + pipes only when gamePlaying
  bird.velocity += bird.gravity;
  bird.y        += bird.velocity;

  drawBird();
  updatePipes();
  drawPipes();

  // simple off-screen check = end
  if (bird.y > canvas.height || bird.y < 0) {
    endGame();
    return;
  }

  requestAnimationFrame(gameLoop);
}

// 4) NON-BLOCKING GAME OVER
function endGame() {
  gamePlaying = false;
  // short delay, then reload
  setTimeout(() => window.location.reload(), 800);
}
