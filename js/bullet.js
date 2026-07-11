// ============================================
// Clase Bullet
// ============================================

class Bullet {
  constructor(x, y, vx, vy, color, isSuper = false) {
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
    this.color = color;
    this.isSuper = isSuper;
    this.size = isSuper ? 6 : 3;
    this.alive = true;
  }
  update() {
    this.x += this.vx;
    this.y += this.vy;
    if (this.y < -20 || this.y > H + 20 || this.x < -20 || this.x > W + 20) this.alive = false;
  }
  draw() {
    ctx.fillStyle = this.color;
    ctx.shadowBlur = this.isSuper ? 20 : 10;
    ctx.shadowColor = this.color;
    if (this.isSuper) {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
    } else {
      ctx.fillRect(this.x - this.size/2, this.y - 8, this.size, 16);
    }
    ctx.shadowBlur = 0;
  }
}

let bullets = [];
let enemyBullets = [];
