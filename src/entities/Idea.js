// =============================================================================
// Idea
// =============================================================================
class Idea {
  constructor(scene, x, y, stage) {
    this.scene = scene;
    this.stage = stage;
    this.sprite = scene.physics.add.sprite(x, y, null);
    this.sprite.setSize(16, 16);
    this.sprite.setGravityY(0);
    this.graphics = scene.add.graphics();
    this.particleTimer = 0;

    // Sistema de fuerzas externas (para atracciones magnéticas, etc.)
    this.externalForceX = 0;
    this.externalForceY = 0;

    // Estado de trampa - cuando la idea es atrapada permanentemente
    this.isTrapped = false;
    this.trapSource = null; // Referencia al objeto que la atrapa

    this.nameText = scene.add.text(x, y - 30, 'Idea', {
      fontSize: '12px',
      fontFamily: 'Arial',
      color: '#ffff00',
      fontStyle: 'bold'
    }).setOrigin(0.5);
  }

  update(delta, targetPos) {
    // Si no está atrapada, seguir el targetPos normalmente
    if (!this.isTrapped) {
      const dx = targetPos.x - this.sprite.x;
      const dy = targetPos.y - this.sprite.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      // Deadzone de 5px para evitar vibración cuando la idea está quieta
      if (dist > 5) {
        const speed = 5;
        this.sprite.x += (dx / dist) * speed;
        this.sprite.y += (dy / dist) * speed;
      }
    }

    // Aplicar fuerzas externas (atracciones magnéticas, etc.)
    // Esto SIEMPRE se aplica, incluso si está atrapada
    this.sprite.x += this.externalForceX;
    this.sprite.y += this.externalForceY;

    // Resetear fuerzas para el próximo frame
    this.externalForceX = 0;
    this.externalForceY = 0;

    this.particleTimer += delta;
    this.draw();
    this.nameText.setPosition(this.sprite.x, this.sprite.y - 30);
  }
  
  // Método para aplicar fuerza externa (llamado por enemigos)
  applyForce(fx, fy) {
    this.externalForceX += fx;
    this.externalForceY += fy;
  }

  draw() {
    this.graphics.clear();
    const x = this.sprite.x;
    const y = this.sprite.y;

    if (this.stage === 0) {
      this.graphics.fillStyle(0xffff00, 1);
      this.graphics.fillCircle(x, y, 8);
      this.graphics.fillStyle(0xffffff, 0.7);
      this.graphics.fillCircle(x, y, 4);
      this.graphics.fillStyle(0xffff00, 0.2);
      this.graphics.fillCircle(x, y, 12);
    } else if (this.stage === 1) {
      this.graphics.lineStyle(2, 0x00ffff, 1);
      this.graphics.strokeRect(x - 8, y - 8, 16, 16);
      this.graphics.strokeRect(x - 6, y - 6, 12, 12);
      this.graphics.lineBetween(x - 8, y - 8, x - 6, y - 6);
      this.graphics.lineBetween(x + 8, y - 8, x + 6, y - 6);
      this.graphics.lineBetween(x - 8, y + 8, x - 6, y + 6);
      this.graphics.lineBetween(x + 8, y + 8, x + 6, y + 6);
    } else {
      this.graphics.fillStyle(0xff6b35, 1);
      this.graphics.fillRect(x - 10, y - 10, 20, 20);
      this.graphics.lineStyle(2, 0xffffff, 1);
      this.graphics.strokeRect(x - 10, y - 10, 20, 20);
      this.graphics.fillStyle(0xffffff, 0.3);
      this.graphics.fillRect(x - 8, y - 8, 6, 6);
    }
  }

  destroy() {
    if (this.sprite) this.sprite.destroy();
    if (this.graphics) this.graphics.destroy();
    if (this.nameText) this.nameText.destroy();
  }
}
