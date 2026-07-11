// ============================================
// Punto de Entrada y Game Loop
// ============================================

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let W, H;
function resize() {
  W = canvas.width = window.innerWidth;
  H = canvas.height = window.innerHeight;
}
resize();
window.addEventListener('resize', resize);

// Inicializar fondo
initBackground();

// Game Loop principal
function gameLoop() {
  requestAnimationFrame(gameLoop);

  ctx.fillStyle = '#0a0012';
  ctx.fillRect(0, 0, W, H);

  if (screenShake > 0) {
    ctx.save();
    ctx.translate((Math.random()-0.5) * screenShake, (Math.random()-0.5) * screenShake);
    screenShake *= 0.9;
    if (screenShake < 0.5) screenShake = 0;
  }

  const doUpdate = slowMotion <= 0 || Math.random() > 0.5;
  if (slowMotion > 0) slowMotion--;

  // Fondo
  nebulas.forEach(n => { n.update(); n.draw(); });
  stars.forEach(s => { s.update(); s.draw(); });

  if (gameState === 'playing') {
    if (comboTimer > 0) {
      comboTimer--;
      if (comboTimer <= 0) combo = 0;
    }

    if (!bossSpawned && enemiesKilled >= enemiesForNextLevel) {
      bossSpawned = true;
      boss = new Boss();
    }

    if (!boss || !boss.alive) {
      if (bossSpawned && boss && !boss.alive) {
        nextLevel();
      }
      spawnWave();
    }

    if (doUpdate) {
      player.update();
      bullets.forEach(b => b.update());
      enemyBullets.forEach(b => b.update());
      enemies.forEach(e => e.update());
      powerups.forEach(p => p.update());
      if (boss && boss.alive) boss.update();
    }

    particles.forEach(p => p.update());
    checkCollisions();

    bullets = bullets.filter(b => b.alive);
    enemyBullets = enemyBullets.filter(b => b.alive);
    enemies = enemies.filter(e => e.alive);
    powerups = powerups.filter(p => p.alive);
    particles = particles.filter(p => p.life > 0);

    particles.forEach(p => p.draw());
    powerups.forEach(p => p.draw());
    enemies.forEach(e => e.draw());
    if (boss && boss.alive) boss.draw();
    bullets.forEach(b => b.draw());
    enemyBullets.forEach(b => {
      ctx.fillStyle = b.color;
      ctx.shadowBlur = 8;
      ctx.shadowColor = b.color;
      ctx.beginPath();
      ctx.arc(b.x, b.y, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
    });
    player.draw();

    updateHUD();
  }

  if (screenShake > 0) ctx.restore();

  // Viñeta
  const vignette = ctx.createRadialGradient(W/2, H/2, H*0.3, W/2, H/2, H*0.8);
  vignette.addColorStop(0, 'transparent');
  vignette.addColorStop(1, 'rgba(0,0,0,0.5)');
  ctx.fillStyle = vignette;
  ctx.fillRect(0, 0, W, H);
}

// Event Listeners
document.getElementById('startBtn').addEventListener('click', startGame);
document.getElementById('restartBtn').addEventListener('click', startGame);

// Iniciar
gameLoop();
