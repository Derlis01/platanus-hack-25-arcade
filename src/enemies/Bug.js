// =============================================================================
// Bug Enemy
// =============================================================================
class Bug extends Enemy {
  constructor(scene, config) {
    super(scene, config);
    this.sprite = scene.physics.add.sprite(config.x, config.y, null);
    this.sprite.setSize(15, 15);
    this.sprite.setGravityY(GRAVITY);
    this.patrolMin = config.patrol[0];
    this.patrolMax = config.patrol[1];
    this.speed = 50;
    this.direction = 1;
  }

  update(delta) {
    if (this.sprite.x >= this.patrolMax) this.direction = -1;
    else if (this.sprite.x <= this.patrolMin) this.direction = 1;
    this.sprite.setVelocityX(this.speed * this.direction);

    this.graphics.clear();
    this.graphics.fillStyle(0xff0000, 1);
    this.graphics.fillCircle(this.sprite.x, this.sprite.y, 8);
    this.graphics.lineStyle(2, 0xffff00, 1);
    this.graphics.strokeCircle(this.sprite.x, this.sprite.y, 10);
  }

  checkCollision(founder, idea, focusSystem) {
    if (!focusSystem) return;
    if (founder && founder.sprite) {
      const fdist = Phaser.Math.Distance.Between(founder.sprite.x, founder.sprite.y, this.sprite.x, this.sprite.y);
      if (fdist < 20) {
        focusSystem.damage(10);
        playTone(this.scene, 150, 0.1);
      }
    }
  }
}
