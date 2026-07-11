// ============================================
// Enemigos
// ============================================

class Enemy {
  constructor(x, y, type) {
    this.x = x;
    this.y = y;
    this.type = type;
    this.alive = true;
    this.shootTimer = Math.random() * 60 + 30;
    this.time = Math.random() * 100;
    this.startX = x;

    switch(type) {
      case 'basic':
        this.w = 30; this.h = 30; this.hp = 1; this.maxHp = 1;
        this.speed = 2 + level * 0.3; this.score = 100; this.color = '#ff0040';
        break;
      case 'fast':
        this.w = 25; this.h = 25; this.hp = 1; this.maxHp = 1;
        this.speed = 4 + level * 0.3; this.score = 150; this.color = '#ffff00';
        break;
      case 'tank':
        this.w = 45; this.h = 40; this.hp = 3 + Math.floor(level/2); this.maxHp = this.hp;
        this.speed = 1 + level * 0.1; this.score = 300; this.color = '#ff8000';
        break;
      case 'shooter':
        this.w = 35; this.h = 35; this.hp = 2; this.maxHp = 2;
        this.speed = 1.5 + level * 0.2; this.score = 250; this.color = '#9d00ff';
        break;
      case 'zigzag':
        this.w = 28; this.h = 28; this.hp = 1; this.maxHp = 1;
        this.speed = 2.5 + level * 0.2; this.score = 200; this.color = '#00ff80';
        break;
    }
  }
  update() {
    this.time += 0.05;
    switch(this.type) {
      case 'basic':
        this.y += this.speed;
        break;
      case 'fast':
        this.y += this.speed;
        this.x += Math.sin(this.time * 3) * 2;
        break;
      case 'tank':
        this.y += this.speed;
        break;
      case 'shooter':
        this.y += this.speed;
        this.x += Math.sin(this.time * 2) * 1.5;
        this.shootTimer--;
        if (this.shootTimer <= 0) {
          this.shootTimer = 80 - level * 3;
          enemyBullets.push(new Bullet(this.x, this.y + this.h/2, 0, 5, '#ff0040'));
        }
        break;
      case 'zigzag':
        this.y += this.speed;
        this.x = this.startX + Math.sin(this.time * 4) * 80;
        break;
    }
    if (this.y > H + 50) this.alive = false;
  }
  draw() {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.shadowBlur = 12;
    ctx.shadowColor = this.color;

    switch(this.type) {
      case 'basic':
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.moveTo(0, this.h/2);
        ctx.lineTo(-this.w/2, -this.h/2);
        ctx.lineTo(0, -this.h/4);
        ctx.lineTo(this.w/2, -this.h/2);
        ctx.closePath();
        ctx.fill();
        ctx.fillStyle = '#fff';
        ctx.fillRect(-3, -2, 6, 6);
        break;
      case 'fast':
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.moveTo(0, this.h/2);
        ctx.lineTo(-this.w/2, 0);
        ctx.lineTo(-this.w/4, -this.h/2);
        ctx.lineTo(this.w/4, -this.h/2);
        ctx.lineTo(this.w/2, 0);
        ctx.closePath();
        ctx.fill();
        break;
      case 'tank':
        ctx.fillStyle = '#1a0a00';
        ctx.strokeStyle = this.color;
        ctx.lineWidth = 2;
        ctx.fillRect(-this.w/2, -this.h/2, this.w, this.h);
        ctx.strokeRect(-this.w/2, -this.h/2, this.w, this.h);
        ctx.fillStyle = this.color;
        ctx.fillRect(-this.w/4, -this.h/4, this.w/2, this.h/2);
        if (this.hp < this.maxHp) {
          ctx.fillStyle = 'rgba(255,0,0,0.5)';
          ctx.fillRect(-this.w/2, -this.h/2 - 8, this.w, 4);
          ctx.fillStyle = '#00ff00';
          ctx.fillRect(-this.w/2, -this.h/2 - 8, this.w * (this.hp/this.maxHp), 4);
        }
        break;
      case 'shooter':
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(0, 0, this.w/2, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#1a001a';
        ctx.beginPath();
        ctx.arc(0, 0, this.w/4, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#ff0040';
        ctx.fillRect(-2, this.h/4, 4, 10);
        break;
      case 'zigzag':
        ctx.fillStyle = this.color;
        ctx.rotate(this.time * 3);
        ctx.fillRect(-this.w/2, -this.h/2, this.w, this.h);
        ctx.fillStyle = '#003320';
        ctx.fillRect(-this.w/4, -this.h/4, this.w/2, this.h/2);
        break;
    }
    ctx.shadowBlur = 0;
    ctx.restore();
  }
  hit() {
    this.hp--;
    if (this.hp <= 0) {
      this.alive = false;
      this.explode();
      return true;
    }
    hitSound();
    for (let i = 0; i < 5; i++) {
      particles.push(new Particle(this.x, this.y, this.color, 4, 2, 0.5));
    }
    return false;
  }
  explode() {
    explosionSound();
    const count = this.type === 'tank' ? 30 : 15;
    for (let i = 0; i < count; i++) {
      particles.push(new Particle(this.x, this.y, this.color, 6, 3, 1));
      particles.push(new Particle(this.x, this.y, '#ffffff', 4, 2, 0.8));
    }
    if (Math.random() < 0.12) {
      powerups.push(new PowerUp(this.x, this.y));
    }
  }
}

let enemies = [];
