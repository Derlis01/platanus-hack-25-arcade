// =============================================================================
// Cannon Enemy
// =============================================================================
class Cannon extends Enemy {
  constructor(scene, config) {
    super(scene, config);
    this.x = config.x;
    this.y = config.y;
    this.fireTimer = 0;
    this.fireRate = 2000;
    this.projectiles = [];
    this.createNameText(config.x, config.y);
  }

  update(delta, idea) {
    this.fireTimer += delta;
    if (this.fireTimer >= this.fireRate && idea && idea.sprite) {
      const dx = idea.sprite.x - this.x;
      const dy = idea.sprite.y - this.y;
      const dist = Math.sqrt(dx*dx + dy*dy);
      this.projectiles.push({
        x: this.x,
        y: this.y,
        vx: (dx / dist) * 3,
        vy: (dy / dist) * 3
      });
      playTone(this.scene, 300, 0.1);
      this.fireTimer = 0;
    }

    this.projectiles = this.projectiles.filter(p => {
      p.x += p.vx * delta * 0.06;
      p.y += p.vy * delta * 0.06;
      return p.x > 0 && p.x < GAME_WIDTH && p.y > 0 && p.y < GAME_HEIGHT;
    });

    this.graphics.clear();

    // Cañón con estilo neon
    this.graphics.fillStyle(NEON.RED, 0.5);
    this.graphics.fillRect(this.x - 10, this.y - 5, 20, 10);

    // Borde brillante
    this.graphics.lineStyle(2, NEON.RED, 1);
    this.graphics.strokeRect(this.x - 10, this.y - 5, 20, 10);

    // Proyectiles neon con glow
    this.projectiles.forEach(p => {
      // Glow exterior
      this.graphics.fillStyle(NEON.RED, 0.3);
      this.graphics.fillCircle(p.x, p.y, 8);
      // Proyectil brillante
      this.graphics.fillStyle(NEON.RED, 1);
      this.graphics.fillCircle(p.x, p.y, 5);
      // Centro blanco
      this.graphics.fillStyle(NEON.WHITE, 0.8);
      this.graphics.fillCircle(p.x, p.y, 2);
    });

    this.updateNamePosition(this.x, this.y);
  }

  checkCollision(founder, idea, focusSystem) {
    if (!focusSystem) return;
    this.projectiles.forEach(p => {
      if (idea && idea.sprite) {
        const idist = Phaser.Math.Distance.Between(idea.sprite.x, idea.sprite.y, p.x, p.y);
        if (idist < 15) {
          focusSystem.damage(15);
          playTone(this.scene, 200, 0.2);
          p.x = -1000;
        }
      }
    });
  }
}
