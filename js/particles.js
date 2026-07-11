// ============================================
// Sistema de Partículas
// ============================================

class Particle {
  constructor(x, y, color, speed, size, life) {
    this.x = x;
    this.y = y;
    this.color = color;
    this.vx = (Math.random() - 0.5) * speed;
    this.vy = (Math.random() - 0.5) * speed;
    this.size = size || 3;
    this.life = life || 1;
    this.maxLife = this.life;
    this.decay = 0.01 + Math.random() * 0.02;
  }
  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.vx *= 0.98;
    this.vy *= 0.98;
    this.life -= this.decay;
  }
  draw() {
    const alpha = this.life / this.maxLife;
    ctx.globalAlpha = alpha;
    ctx.fillStyle = this.color;
    ctx.shadowBlur = 10;
    ctx.shadowColor = this.color;
    ctx.fillRect(this.x - this.size/2, this.y - this.size/2, this.size * alpha, this.size * alpha);
    ctx.shadowBlur = 0;
    ctx.globalAlpha = 1;
  }
}

let particles = [];
