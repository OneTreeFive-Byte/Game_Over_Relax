// ============================================
// Fondo: Estrellas y Nebulosas
// ============================================

class Star {
  constructor() { this.reset(); this.y = Math.random() * H; }
  reset() {
    this.x = Math.random() * W;
    this.y = -5;
    this.size = Math.random() * 2.5 + 0.5;
    this.speed = this.size * 1.5 + 0.5;
    this.brightness = Math.random();
    this.color = Math.random() > 0.7 ? `hsl(${280 + Math.random() * 60}, 100%, ${60 + Math.random() * 40}%)` : 
                 Math.random() > 0.5 ? `hsl(${180 + Math.random() * 30}, 100%, ${60 + Math.random() * 40}%)` : '#ffffff';
  }
  update() {
    this.y += this.speed;
    if (this.y > H + 5) this.reset();
  }
  draw() {
    ctx.globalAlpha = 0.3 + this.brightness * 0.7;
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.size, this.size);
    ctx.globalAlpha = 1;
  }
}

class Nebula {
  constructor() { this.reset(); this.y = Math.random() * H; }
  reset() {
    this.x = Math.random() * W;
    this.y = -200;
    this.radius = 100 + Math.random() * 200;
    this.speed = 0.2 + Math.random() * 0.3;
    this.hue = Math.random() > 0.5 ? 280 + Math.random() * 40 : 180 + Math.random() * 40;
    this.alpha = 0.02 + Math.random() * 0.03;
  }
  update() {
    this.y += this.speed;
    if (this.y > H + this.radius) this.reset();
  }
  draw() {
    const grad = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.radius);
    grad.addColorStop(0, `hsla(${this.hue}, 100%, 50%, ${this.alpha})`);
    grad.addColorStop(1, 'transparent');
    ctx.fillStyle = grad;
    ctx.fillRect(this.x - this.radius, this.y - this.radius, this.radius * 2, this.radius * 2);
  }
}

let stars = [];
let nebulas = [];

function initBackground() {
  stars = [];
  nebulas = [];
  for (let i = 0; i < 150; i++) stars.push(new Star());
  for (let i = 0; i < 5; i++) nebulas.push(new Nebula());
}
