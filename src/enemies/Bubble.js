// =============================================================================
// Bubble Enemy
// =============================================================================
class Bubble extends Enemy {
  constructor(scene, config) {
    super(scene, config);
    this.sprite = scene.physics.add.sprite(config.x, config.y, null);
    this.sprite.setSize(20, 20);
    this.sprite.setGravityY(0);
    this.sprite.setBounce(1, 1);
    this.sprite.setCollideWorldBounds(true);
    this.bouncing = config.bouncing !== undefined ? config.bouncing : true;
    if (this.bouncing) {
      const angle = Math.random() * Math.PI * 2;
      this.sprite.setVelocity(Math.cos(angle) * 80, Math.sin(angle) * 80);
    }
    this.createNameText(config.x, config.y);
  }

  update(delta, idea) {
    this.graphics.clear();

    // Glow exterior
    this.graphics.fillStyle(NEON.PINK, 0.2);
    this.graphics.fillCircle(this.sprite.x, this.sprite.y, 16);

    // Borde neon brillante
    this.graphics.lineStyle(3, NEON.PINK, 1);
    this.graphics.strokeCircle(this.sprite.x, this.sprite.y, 12);

    // Interior translúcido
    this.graphics.fillStyle(NEON.PINK, 0.3);
    this.graphics.fillCircle(this.sprite.x, this.sprite.y, 12);

    // Reflejo brillante
    this.graphics.fillStyle(NEON.WHITE, 0.8);
    this.graphics.fillCircle(this.sprite.x - 4, this.sprite.y - 4, 3);

    this.updateNamePosition(this.sprite.x, this.sprite.y);
  }

  checkCollision(founder, idea, focusSystem) {
    if (founder && founder.sprite && founder.sprite.body) {
      const fdist = Phaser.Math.Distance.Between(founder.sprite.x, founder.sprite.y, this.sprite.x, this.sprite.y);
      if (fdist < 25) {
        const dx = founder.sprite.x - this.sprite.x;
        const dy = founder.sprite.y - this.sprite.y;
        const dist = Math.sqrt(dx*dx + dy*dy);
        if (dist > 0) founder.sprite.setVelocityX(founder.sprite.body.velocity.x + (dx/dist) * 100);
      }
    }
    if (idea && idea.sprite && focusSystem) {
      const idist = Phaser.Math.Distance.Between(idea.sprite.x, idea.sprite.y, this.sprite.x, this.sprite.y);
      if (idist < 25) {
        focusSystem.damage(8);
        playTone(this.scene, 250, 0.1);
      }
    }
  }
}
