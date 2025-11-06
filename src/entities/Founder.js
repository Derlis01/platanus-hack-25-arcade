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
    this.sprite.setVisible(false);
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

    // NEON GLOW exterior
    this.graphics.fillStyle(NEON.CYAN, 0.15);
    this.graphics.fillRect(x - 12, y - 9, 24, 28);
    this.graphics.fillStyle(NEON.CYAN, 0.3);
    this.graphics.fillRect(x - 10, y - 7, 20, 24);

    // Cuerpo principal - cyan brillante
    this.graphics.fillStyle(NEON.CYAN, 0.8);
    this.graphics.fillRect(x - 8, y - 5, 16, 20);

    // Borde neon brillante del cuerpo
    this.graphics.lineStyle(2, NEON.CYAN, 1);
    this.graphics.strokeRect(x - 8, y - 5, 16, 20);

    // Líneas de detalle (scanlines)
    this.graphics.lineStyle(1, NEON.WHITE, 0.6);
    this.graphics.lineBetween(x - 7, y, x + 7, y);
    this.graphics.lineBetween(x - 7, y + 5, x + 7, y + 5);

    // GLOW cabeza
    this.graphics.fillStyle(NEON.CYAN, 0.2);
    this.graphics.fillCircle(x, y - 15, 11);

    // Cabeza principal
    this.graphics.fillStyle(NEON.CYAN, 0.8);
    this.graphics.fillCircle(x, y - 15, 8);

    // Borde neon cabeza
    this.graphics.lineStyle(2, NEON.CYAN, 1);
    this.graphics.strokeCircle(x, y - 15, 8);

    // Brazos neon
    this.graphics.lineStyle(3, NEON.CYAN, 1);
    this.graphics.lineBetween(x - 8, y - 5, x - 14, y - 3);
    this.graphics.lineBetween(x + 8, y - 5, x + 14, y - 3);

    // Ojos brillantes
    this.graphics.fillStyle(NEON.YELLOW, 1);
    this.graphics.fillCircle(x - 3, y - 17, 2);
    this.graphics.fillCircle(x + 3, y - 17, 2);

    // Glow ojos
    this.graphics.fillStyle(NEON.YELLOW, 0.4);
    this.graphics.fillCircle(x - 3, y - 17, 3);
    this.graphics.fillCircle(x + 3, y - 17, 3);
  }

  destroy() {
    if (this.sprite) this.sprite.destroy();
    if (this.graphics) this.graphics.destroy();
    if (this.nameText) this.nameText.destroy();
  }
}
