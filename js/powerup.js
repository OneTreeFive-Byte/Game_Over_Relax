// ============================================
// Power-Ups
// ============================================

class PowerUp {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.type = ['rapid', 'multi', 'shield', 'life'][Math.floor(Math.random() * 4)];
    this.size = 15;
    this.alive = true;
    this.time = 0;
  }
  update() {
    this.y += 2;
    this.time += 0.1;
    if (this.y > H + 20) this.alive = false;
  }
  draw() {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.time);

    const colors = { rapid: '#ffff00', multi: '#ff00ff', shield: '#00ff00', life: '#ff0080' };
    const color = colors[this.type];

    ctx.shadowBlur = 15;
    ctx.shadowColor = color;
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.beginPath();
    for (let i = 0; i < 4; i++) {
      const angle = (i / 4) * Math.PI * 2;
      const r = this.size;
      if (i === 0) ctx.moveTo(Math.cos(angle)*r, Math.sin(angle)*r);
      else ctx.lineTo(Math.cos(angle)*r, Math.sin(angle)*r);
    }
    ctx.closePath();
    ctx.stroke();

    ctx.fillStyle = color;
    ctx.font = '10px Orbitron';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    const labels = { rapid: 'R', multi: 'M', shield: 'S', life: '♥' };
    ctx.fillText(labels[this.type], 0, 0);

    ctx.shadowBlur = 0;
    ctx.restore();
  }
}

let powerups = [];
