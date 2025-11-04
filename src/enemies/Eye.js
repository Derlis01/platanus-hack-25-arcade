// =============================================================================
// Eye Enemy
// =============================================================================
class Eye extends Enemy {
  constructor(scene, config) {
    super(scene, config);
    this.x = config.x;
    this.y = config.y;
    this.angle = 0;
    this.rotSpeed = config.rotSpeed || 1;
    this.range = 150;
    this.freezeTimer = 0;
  }

  update(delta) {
    this.angle += this.rotSpeed * delta * 0.001;
    if (this.freezeTimer > 0) this.freezeTimer -= delta;

    this.graphics.clear();
    this.graphics.fillStyle(0x666666, 1);
    this.graphics.fillCircle(this.x, this.y, 15);
    this.graphics.fillStyle(0xff0000, 1);
    const px = this.x + Math.cos(this.angle) * 5;
    const py = this.y + Math.sin(this.angle) * 5;
    this.graphics.fillCircle(px, py, 5);
    this.graphics.lineStyle(2, this.freezeTimer > 0 ? 0xff0000 : 0x00ffff, 0.5);
    this.graphics.lineBetween(this.x, this.y, this.x + Math.cos(this.angle) * this.range, this.y + Math.sin(this.angle) * this.range);
  }

  checkCollision(founder, idea, focusSystem) {
    if (!founder || !founder.sprite || !founder.sprite.body) return;
    if (this.freezeTimer > 0) {
      founder.sprite.setVelocityX(0);
      founder.sprite.setVelocityY(0);
      return;
    }
    const fx = founder.sprite.x - this.x;
    const fy = founder.sprite.y - this.y;
    const fdist = Math.sqrt(fx*fx + fy*fy);
    const fangle = Math.atan2(fy, fx);
    const angleDiff = Math.abs(((fangle - this.angle + Math.PI) % (2*Math.PI)) - Math.PI);
    if (fdist < this.range && angleDiff < 0.2) {
      this.freezeTimer = 3000;
      playTone(this.scene, 800, 0.2);
    }
  }
}
