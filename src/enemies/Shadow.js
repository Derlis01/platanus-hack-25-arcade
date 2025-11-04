// =============================================================================
// Shadow Enemy (Síndrome del Impostor)
// =============================================================================
class Shadow extends Enemy {
  constructor(scene, config) {
    super(scene, config);
    this.idleTimer = 0;
    this.frozen = false;
    this.shadow = null;
  }

  update(delta, founder) {
    if (!founder || !founder.sprite || !founder.sprite.body) return;

    const vel = founder.sprite.body.velocity;
    if (Math.abs(vel.x) < 1 && Math.abs(vel.y) < 1) {
      this.idleTimer += delta;
      if (this.idleTimer > 3000 && !this.frozen) {
        this.frozen = true;
        founder.sprite.setVelocityX(0);
        founder.sprite.setVelocityY(0);
        this.shadow = this.scene.add.graphics();
        playTone(this.scene, 200, 0.3);
        this.scene.time.delayedCall(1000, () => {
          this.frozen = false;
          if (this.shadow) {
            this.shadow.destroy();
            this.shadow = null;
          }
          this.idleTimer = 0;
        });
      }
    } else {
      this.idleTimer = 0;
      if (this.shadow) {
        this.shadow.destroy();
        this.shadow = null;
      }
    }

    if (this.shadow) {
      this.shadow.clear();
      this.shadow.fillStyle(0x000000, 0.7);
      this.shadow.fillCircle(founder.sprite.x, founder.sprite.y, 40);
    }
  }

  checkCollision(founder, idea, focusSystem) {
    if (this.frozen && founder && founder.sprite && founder.sprite.body) {
      founder.sprite.setVelocityX(0);
      founder.sprite.setVelocityY(0);
    }
  }

  destroy() {
    if (this.shadow) this.shadow.destroy();
    if (this.graphics) this.graphics.destroy();
  }
}
