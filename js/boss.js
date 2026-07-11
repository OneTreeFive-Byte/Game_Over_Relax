// ============================================
// Jefes Finales
// ============================================

class Boss {
  constructor() {
    this.x = W / 2;
    this.y = -100;
    this.targetY = 120;
    this.w = 120;
    this.h = 80;
    this.hp = 30 + level * 15;
    this.maxHp = this.hp;
    this.alive = true;
    this.phase = 0;
    this.time = 0;
    this.shootTimer = 0;
    this.entering = true;
    this.name = ['CYBER HYDRA', 'NEON OVERLORD', 'VOID REAPER', 'PLASMA TITAN', 'QUANTUM BEAST'][Math.min(level-1, 4)];
    bossSound();
    document.getElementById('boss-health').classList.add('visible');
    document.getElementById('boss-name').textContent = `⚠ ${this.name} ⚠`;
  }
  update() {
    this.time += 0.02;
    if (this.entering) {
      this.y += 1.5;
      if (this.y >= this.targetY) this.entering = false;
      return;
    }
    this.x = W/2 + Math.sin(this.time * 1.5) * (W/3);
    this.y = this.targetY + Math.sin(this.time * 2) * 30;

    this.shootTimer--;
    if (this.shootTimer <= 0) {
      this.shoot();
      this.shootTimer = Math.max(20, 50 - level * 3);
    }
    document.getElementById('boss-fill').style.width = `${(this.hp/this.maxHp)*100}%`;
  }
  shoot() {
    const patterns = this.hp < this.maxHp * 0.3 ? 3 : this.hp < this.maxHp * 0.6 ? 2 : 1;
    if (patterns >= 1) {
      const dx = player.x - this.x;
      const dy = player.y - this.y;
      const dist = Math.sqrt(dx*dx + dy*dy);
      enemyBullets.push(new Bullet(this.x, this.y + this.h/2, (dx/dist)*5, (dy/dist)*5, '#ff0040'));
    }
    if (patterns >= 2) {
      for (let i = -2; i <= 2; i++) {
        const angle = Math.PI/2 + i * 0.3;
        enemyBullets.push(new Bullet(this.x, this.y + this.h/2, Math.cos(angle)*4, Math.sin(angle)*4, '#ff00ff'));
      }
    }
    if (patterns >= 3) {
      for (let i = 0; i < 12; i++) {
        const angle = (i/12) * Math.PI * 2 + this.time;
        enemyBullets.push(new Bullet(this.x, this.y, Math.cos(angle)*3, Math.sin(angle)*3, '#9d00ff'));
      }
    }
  }
  draw() {
    ctx.save();
    ctx.translate(this.x, this.y);

    const glow = ctx.createRadialGradient(0, 0, 0, 0, 0, this.w);
    glow.addColorStop(0, 'rgba(255,0,64,0.1)');
    glow.addColorStop(1, 'transparent');
    ctx.fillStyle = glow;
    ctx.fillRect(-this.w, -this.w, this.w*2, this.w*2);

    ctx.fillStyle = '#1a0020';
    ctx.strokeStyle = '#ff0040';
    ctx.lineWidth = 3;
    ctx.shadowBlur = 20;
    ctx.shadowColor = '#ff0040';

    ctx.beginPath();
    ctx.moveTo(0, -this.h/2);
    ctx.lineTo(-this.w/2, -this.h/4);
    ctx.lineTo(-this.w/2 - 20, this.h/4);
    ctx.lineTo(-this.w/3, this.h/2);
    ctx.lineTo(this.w/3, this.h/2);
    ctx.lineTo(this.w/2 + 20, this.h/4);
    ctx.lineTo(this.w/2, -this.h/4);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#ff0040';
    ctx.shadowBlur = 15;
    ctx.beginPath();
    ctx.arc(0, 0, 15, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#ff00ff';
    ctx.beginPath();
    ctx.arc(-30, 10, 8, 0, Math.PI * 2);
    ctx.arc(30, 10, 8, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = '#00ffff';
    ctx.lineWidth = 1;
    ctx.shadowColor = '#00ffff';
    const pulse = Math.sin(this.time * 5) * 0.5 + 0.5;
    ctx.globalAlpha = pulse;
    ctx.beginPath();
    ctx.moveTo(-this.w/2, 0);
    ctx.lineTo(this.w/2, 0);
    ctx.stroke();
    ctx.globalAlpha = 1;

    ctx.shadowBlur = 0;
    ctx.restore();
  }
  hit() {
    this.hp--;
    hitSound();
    screenShake = 3;
    for (let i = 0; i < 5; i++) {
      particles.push(new Particle(this.x + (Math.random()-0.5)*this.w, this.y + (Math.random()-0.5)*this.h, '#ff0040', 5, 3, 0.8));
    }
    if (this.hp <= 0) {
      this.alive = false;
      this.explode();
    }
  }
  explode() {
    explosionSound();
    superSound();
    screenShake = 25;
    slowMotion = 30;
    for (let i = 0; i < 80; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 2 + Math.random() * 8;
      particles.push(new Particle(this.x, this.y, '#ff0040', speed, 4, 2));
      particles.push(new Particle(this.x, this.y, '#ff00ff', speed, 3, 1.5));
      particles.push(new Particle(this.x, this.y, '#00ffff', speed * 0.5, 2, 1.8));
      particles.push(new Particle(this.x, this.y, '#ffffff', speed * 0.3, 5, 1));
    }
    score += 2000 * level;
    document.getElementById('boss-health').classList.remove('visible');
  }
}

let boss = null;
