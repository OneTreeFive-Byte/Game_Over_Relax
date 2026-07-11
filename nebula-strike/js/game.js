// ============================================
// Lógica Principal del Juego
// ============================================

// Estado del juego
let gameState = 'menu';
let score = 0;
let level = 1;
let lives = 3;
let combo = 0;
let comboTimer = 0;
let power = 0;
const maxPower = 100;
let enemiesKilled = 0;
let enemiesForNextLevel = 15;
let screenShake = 0;
let slowMotion = 0;
let waveTimer = 0;
let bossSpawned = false;

// Input
const keys = {};
let mouseX = W / 2;
let mouseDown = false;

window.addEventListener('keydown', e => { keys[e.key.toLowerCase()] = true; if([' ','arrowup','arrowdown','arrowleft','arrowright'].includes(e.key.toLowerCase())) e.preventDefault(); });
window.addEventListener('keyup', e => { keys[e.key.toLowerCase()] = false; });
window.addEventListener('mousemove', e => { mouseX = e.clientX; });
window.addEventListener('mousedown', e => { mouseDown = true; });
window.addEventListener('mouseup', e => { mouseDown = false; });
window.addEventListener('touchstart', e => { mouseDown = true; mouseX = e.touches[0].clientX; });
window.addEventListener('touchmove', e => { mouseX = e.touches[0].clientX; });
window.addEventListener('touchend', e => { mouseDown = false; });

// Spawn de enemigos
function spawnWave() {
  waveTimer++;
  const types = ['basic', 'fast', 'zigzag', 'shooter', 'tank'];
  const availableTypes = types.slice(0, Math.min(types.length, 1 + Math.floor(level / 2)));

  if (waveTimer % 30 === 0) {
    const count = 3 + Math.floor(level / 2);
    for (let i = 0; i < count; i++) {
      const type = availableTypes[Math.floor(Math.random() * availableTypes.length)];
      const x = 50 + (W - 100) * (i / (count - 1 || 1));
      setTimeout(() => {
        if (gameState === 'playing') enemies.push(new Enemy(x, -30, type));
      }, i * 200);
    }
  }

  if (waveTimer % 180 === 0) {
    const type = availableTypes[Math.floor(Math.random() * availableTypes.length)];
    for (let i = 0; i < 5; i++) {
      const x = W/2 + (i - 2) * 50;
      const y = -30 - Math.abs(i - 2) * 30;
      enemies.push(new Enemy(x, y, type));
    }
  }
}

// Colisiones
function checkCollisions() {
  bullets.forEach(b => {
    if (!b.alive) return;
    enemies.forEach(e => {
      if (!e.alive) return;
      if (Math.abs(b.x - e.x) < e.w/2 + b.size && Math.abs(b.y - e.y) < e.h/2 + b.size) {
        b.alive = false;
        if (e.hit()) {
          enemiesKilled++;
          combo++;
          comboTimer = 120;
          const comboMult = Math.min(combo, 10);
          score += e.score * comboMult;
          power = Math.min(power + 5, maxPower);
          if (combo > 2) showCombo(combo);
        }
      }
    });

    if (boss && boss.alive && !boss.entering) {
      if (Math.abs(b.x - boss.x) < boss.w/2 + b.size && Math.abs(b.y - boss.y) < boss.h/2 + b.size) {
        b.alive = false;
        boss.hit();
      }
    }
  });

  if (player.invincible <= 0) {
    enemyBullets.forEach(b => {
      if (!b.alive) return;
      if (Math.abs(b.x - player.x) < player.w/2 && Math.abs(b.y - player.y) < player.h/2) {
        b.alive = false;
        playerHit();
      }
    });

    enemies.forEach(e => {
      if (!e.alive) return;
      if (Math.abs(e.x - player.x) < (e.w + player.w)/2 && Math.abs(e.y - player.y) < (e.h + player.h)/2) {
        e.alive = false;
        e.explode();
        playerHit();
      }
    });
  }

  powerups.forEach(p => {
    if (!p.alive) return;
    if (Math.abs(p.x - player.x) < 30 && Math.abs(p.y - player.y) < 30) {
      p.alive = false;
      powerupSound();
      if (p.type === 'life') {
        lives = Math.min(lives + 1, 5);
      } else if (p.type === 'shield') {
        player.invincible = 180;
      } else {
        player.powerType = p.type;
        player.powerTimer = 600;
      }
      for (let i = 0; i < 15; i++) {
        particles.push(new Particle(p.x, p.y, '#ffffff', 5, 3, 1));
      }
    }
  });
}

function playerHit() {
  if (player.invincible > 0) return;
  lives--;
  player.invincible = 120;
  screenShake = 15;
  explosionSound();
  for (let i = 0; i < 30; i++) {
    particles.push(new Particle(player.x, player.y, '#00ffff', 6, 3, 1));
    particles.push(new Particle(player.x, player.y, '#ff00ff', 5, 2, 0.8));
  }
  combo = 0;
  if (lives <= 0) gameOver();
  updateHUD();
}

function showCombo(c) {
  const el = document.getElementById('combo-display');
  el.textContent = `${c}x COMBO!`;
  el.classList.add('show');
  setTimeout(() => el.classList.remove('show'), 800);
}

function showLevelAnnounce() {
  const el = document.getElementById('level-announce');
  el.textContent = `NIVEL ${level}`;
  el.style.opacity = '1';
  setTimeout(() => { el.style.opacity = '0'; }, 2000);
}

function updateHUD() {
  document.getElementById('score-value').textContent = score.toLocaleString();
  document.getElementById('level-value').textContent = level;
  document.getElementById('combo-value').textContent = `x${Math.max(1, Math.min(combo, 10))}`;
  document.getElementById('power-fill').style.width = `${(power/maxPower)*100}%`;

  const livesDiv = document.getElementById('lives-display');
  livesDiv.innerHTML = '';
  for (let i = 0; i < 5; i++) {
    const icon = document.createElement('div');
    icon.className = 'life-icon' + (i >= lives ? ' lost' : '');
    livesDiv.appendChild(icon);
  }
}

function nextLevel() {
  level++;
  enemiesKilled = 0;
  enemiesForNextLevel = 15 + level * 5;
  bossSpawned = false;
  boss = null;
  document.getElementById('boss-health').classList.remove('visible');
  showLevelAnnounce();
  updateHUD();
}

function gameOver() {
  gameState = 'gameover';
  document.getElementById('hud').classList.remove('visible');
  document.getElementById('game-over-screen').classList.add('visible');
  document.getElementById('final-score').textContent = `SCORE: ${score.toLocaleString()}`;
  document.getElementById('final-level').textContent = `NIVEL ALCANZADO: ${level}`;
}

function startGame() {
  initAudio();
  gameState = 'playing';
  score = 0;
  level = 1;
  lives = 3;
  combo = 0;
  power = 0;
  enemiesKilled = 0;
  enemiesForNextLevel = 15;
  bossSpawned = false;
  boss = null;
  waveTimer = 0;
  bullets = [];
  enemyBullets = [];
  enemies = [];
  powerups = [];
  particles = [];
  player.init();
  document.getElementById('start-screen').style.display = 'none';
  document.getElementById('game-over-screen').classList.remove('visible');
  document.getElementById('hud').classList.add('visible');
  document.getElementById('boss-health').classList.remove('visible');
  showLevelAnnounce();
  updateHUD();
}
