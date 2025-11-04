// =============================================================================
// Enemies - Base Class
// =============================================================================
class Enemy {
  constructor(scene, config) {
    this.scene = scene;
    this.config = config;
    this.type = config.type;
    this.graphics = scene.add.graphics();
  }
  update(delta) {}
  checkCollision(founder, idea, focusSystem) {}
  destroy() {
    if (this.graphics) this.graphics.destroy();
    if (this.sprite) this.sprite.destroy();
  }
}

function createEnemy(scene, config) {
  switch (config.type) {
    case 'magnet': return new Magnet(scene, config);
    case 'shadow': return new Shadow(scene, config);
    case 'bug': return new Bug(scene, config);
    case 'eye': return new Eye(scene, config);
    case 'cannon': return new Cannon(scene, config);
    case 'bubble': return new Bubble(scene, config);
    default: return null;
  }
}
