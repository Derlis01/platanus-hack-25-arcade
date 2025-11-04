// =============================================================================
// Founder
// =============================================================================
class Founder {
  constructor(scene, x, y) {
    this.scene = scene;
    this.sprite = scene.physics.add.sprite(x, y, null);
    this.sprite.setSize(20, 30);
    this.sprite.setGravityY(GRAVITY);
    this.sprite.setCollideWorldBounds(true);
    this.graphics = scene.add.graphics();

    this.nameText = scene.add.text(x, y - 35, 'Founder', {
      fontSize: '12px',
      fontFamily: 'Arial',
      color: '#ff6b35',
      fontStyle: 'bold'
    }).setOrigin(0.5);
  }

  update() {
    this.draw();
    this.nameText.setPosition(this.sprite.x, this.sprite.y - 35);
  }

  draw() {
    this.graphics.clear();
    const x = this.sprite.x;
    const y = this.sprite.y;
    this.graphics.fillStyle(0xff6b35, 1);
    this.graphics.fillRect(x - 10, y - 15, 20, 30);
    // Borde eliminado para verificar que los cambios se aplican
  }

  destroy() {
    if (this.sprite) this.sprite.destroy();
    if (this.graphics) this.graphics.destroy();
    if (this.nameText) this.nameText.destroy();
  }
}
