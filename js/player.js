// ============================================
// Jugador
// ============================================

const player = {
  x: 0, y: 0, w: 40, h: 50,
  speed: 7, shootTimer: 0, shootDelay: 8,
  invincible: 0, powerType: null, powerTimer: 0,
  trail: [],
  init() {
    this.x = W / 2;
    this.y = H - 100;
    this.invincible = 0;
    this.powerType = null;
    this.powerTimer = 0;
    this.trail = [];
  },
  update() {
    let dx = 0, dy = 0;
    if (keys['arrowleft'] || keys['a']) dx = -1;
    if (keys['arrowright'] || keys['d']) dx = 1;
    if (keys['arrowup'] || keys['w']) dy = -1;
    if (keys['arrowdown'] || keys['s']) dy = 1;

    this.x += dx * this.speed;
    this.y += dy * this.speed;

    this.x = Math.max(this.w/2, Math.min(W - this.w/2, this.x));
    this.y = Math.max(this.h/2, Math.min(H - this.h/2, this.y));

    this.trail.push({ x: this.x, y: this.y + this.h/2, alpha: 1 });
    if (this.trail.length > 15) this.trail.shift();
    this.trail.forEach(t => t.alpha -= 0.07);

    if (this.shootTimer > 0) this.shootTimer--;
    if ((keys[' '] || mouseDown) && this.shootTimer <= 0) {
      this.shoot();
      this.shootTimer = this.powerType === 'rapid' ? 3 : this.shootDelay;
    }

    if (keys['shift'] && power >= maxPower) {
      this.superAttack();
    }

    if (this.invincible > 0) this.invincible--;
    if (this.powerTimer > 0) {
      this.powerTimer--;
      if (this.powerTimer <= 0) this.powerType = null;
    }
  },
  shoot() {
    shootSound();
    const bx = this.x;
    const by = this.y - this.h/2;

    if (this.powerType === 'multi') {
      bullets.push(new Bullet(bx, by, 0, -12, '#00ffff'));
      bullets.push(new Bullet(bx - 15, by, -2, -11, '#ff00ff'));
      bullets.push(new Bullet(bx + 15, by, 2, -11, '#ff00ff'));
      bullets.push(new Bullet(bx - 25, by, -4, -10, '#9d00ff'));
      bullets.push(new Bullet(bx + 25, by, 4, -10, '#9d00ff'));
    } else {
      bullets.push(new Bullet(bx - 8, by, 0, -12, '#00ffff'));
      bullets.push(new Bullet(bx + 8, by, 0, -12, '#00ffff'));
    }
  },
  superAttack() {
    superSound();
    power = 0;
    screenShake = 15;
    for (let i = 0; i < 36; i++) {
      const angle = (i / 36) * Math.PI * 2;
      bullets.push(new Bullet(this.x, this.y, Math.cos(angle) * 10, Math.sin(angle) * 10, '#ff00ff', true));
    }
    for (let i = 0; i < 50; i++) {
      particles.push(new Particle(this.x, this.y, '#ff00ff', 8, 4, 1.5));
      particles.push(new Particle(this.x, this.y, '#00ffff', 8, 3, 1.2));
    }
  },
  draw() {
    this.trail.forEach(t => {
      if (t.alpha > 0) {
        ctx.globalAlpha = t.alpha * 0.3;
        ctx.fillStyle = '#00ffff';
        ctx.fillRect(t.x - 3, t.y, 6, 10);
      }
    });
    ctx.globalAlpha = 1;

    if (this.invincible > 0 && Math.floor(this.invincible / 3) % 2 === 0) return;

    ctx.save();
    ctx.translate(this.x, this.y);

    const engineGlow = ctx.createRadialGradient(0, this.h/2 + 5, 0, 0, this.h/2 + 5, 20);
    engineGlow.addColorStop(0, 'rgba(0,255,255,0.8)');
    engineGlow.addColorStop(0.5, 'rgba(255,0,255,0.3)');
    engineGlow.addColorStop(1, 'transparent');
    ctx.fillStyle = engineGlow;
    ctx.fillRect(-20, this.h/2 - 5, 40, 30);

    ctx.fillStyle = '#1a0030';
    ctx.strokeStyle = '#00ffff';
    ctx.lineWidth = 2;
    ctx.shadowBlur = 15;
    ctx.shadowColor = '#00ffff';
    ctx.beginPath();
    ctx.moveTo(0, -this.h/2);
    ctx.lineTo(-this.w/2, this.h/2);
    ctx.lineTo(-this.w/4, this.h/3);
    ctx.lineTo(0, this.h/2 - 5);
    ctx.lineTo(this.w/4, this.h/3);
    ctx.lineTo(this.w/2, this.h/2);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#ff00ff';
    ctx.shadowColor = '#ff00ff';
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.ellipse(0, -5, 6, 10, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = '#ff00ff';
    ctx.lineWidth = 1;
    ctx.shadowColor = '#ff00ff';
    ctx.beginPath();
    ctx.moveTo(-5, 0);
    ctx.lineTo(-this.w/2 + 5, this.h/2 - 10);
    ctx.moveTo(5, 0);
    ctx.lineTo(this.w/2 - 5, this.h/2 - 10);
    ctx.stroke();

    if (this.powerType) {
      const pColor = this.powerType === 'rapid' ? '#ffff00' : this.powerType === 'multi' ? '#ff00ff' : '#00ff00';
      ctx.shadowBlur = 20;
      ctx.shadowColor = pColor;
      ctx.strokeStyle = pColor;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(0, 0, this.w/2 + 5 + Math.sin(Date.now() * 0.01) * 3, 0, Math.PI * 2);
      ctx.stroke();
    }

    ctx.shadowBlur = 0;
    ctx.restore();
  }
};
