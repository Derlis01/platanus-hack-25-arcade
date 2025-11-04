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

    // Cuerpo (rectángulo redondeado simulado)
    this.graphics.fillStyle(0xff6b35, 1);
    this.graphics.fillRect(x - 8, y - 5, 16, 20);

    // Cabeza (círculo)
    this.graphics.fillStyle(0xff6b35, 1);
    this.graphics.fillCircle(x, y - 15, 8);

    // Brazos simples (líneas)
    this.graphics.lineStyle(2, 0xff6b35, 1);
    this.graphics.lineBetween(x - 8, y - 5, x - 14, y - 3);  // Brazo izquierdo
    this.graphics.lineBetween(x + 8, y - 5, x + 14, y - 3);  // Brazo derecho

    // Ojos (pequeños círculos blancos)
    this.graphics.fillStyle(0xffffff, 1);
    this.graphics.fillCircle(x - 3, y - 17, 2);
    this.graphics.fillCircle(x + 3, y - 17, 2);

    // Pupilas (pequeños círculos oscuros)
    this.graphics.fillStyle(0x1a1a2e, 1);
    this.graphics.fillCircle(x - 3, y - 17, 1);
    this.graphics.fillCircle(x + 3, y - 17, 1);
  }

  destroy() {
    if (this.sprite) this.sprite.destroy();
    if (this.graphics) this.graphics.destroy();
    if (this.nameText) this.nameText.destroy();
  }
}
