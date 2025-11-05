// =============================================================================
// Enemies - Base Class
// =============================================================================
class Enemy {
  constructor(scene, config) {
    this.scene = scene;
    this.config = config;
    this.type = config.type;
    this.graphics = scene.add.graphics();
    this.name = config.name || '';
    this.nameText = null;
  }

  createNameText(x, y) {
    if (this.name && !this.nameText) {
      this.nameText = this.scene.add.text(x, y, this.name, {
        fontSize: '13px',
        fill: '#ffffff',
        align: 'center',
        fontStyle: 'bold',
        stroke: '#000000',
        strokeThickness: 3
      });
      this.nameText.setOrigin(0.5, 1);
    }
  }

  updateNamePosition(x, y) {
    if (this.nameText) {
      this.nameText.setPosition(x, y - 15);
    }
  }

  update(delta) {}
  checkCollision(founder, idea, focusSystem) {}
  destroy() {
    if (this.graphics) this.graphics.destroy();
    if (this.sprite) this.sprite.destroy();
    if (this.nameText) this.nameText.destroy();
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
    case 'coffee': return new Coffee(scene, config);
    default: return null;
  }
}
