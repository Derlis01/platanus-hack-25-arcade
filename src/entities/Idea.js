// =============================================================================
// Idea
// =============================================================================
class Idea {
  constructor(scene, x, y, stage, name = 'Idea') {
    this.scene = scene;
    this.stage = stage;
    this.sprite = scene.physics.add.sprite(x, y, null);
    this.sprite.setSize(16, 16);
    this.sprite.setGravityY(0);
    this.sprite.setVisible(false);
    this.graphics = scene.add.graphics();
    this.particleTimer = 0;
    this.animTime = 0;  // Para animaciones

    // Sistema de fuerzas externas (para atracciones magnéticas, etc.)
    this.externalForceX = 0;
    this.externalForceY = 0;

    // Estado de trampa - cuando la idea es atrapada permanentemente
    this.isTrapped = false;
    this.trapSource = null; // Referencia al objeto que la atrapa

    // Color del nombre según el stage
    let nameColor = '#ffff00'; // Amarillo para chispa (stage 0)
    if (stage === 1) nameColor = '#00ffff'; // Celeste para prototipo
    if (stage === 2) nameColor = '#ff6b35'; // Naranja para producto

    this.nameText = scene.add.text(x, y - 30, name, {
      fontSize: '12px',
      fontFamily: 'Arial',
      color: nameColor,
      fontStyle: 'bold'
    }).setOrigin(0.5);
  }

  update(delta, targetPos) {
    // Si no está atrapada, levitar al lado izquierdo del jugador
    if (!this.isTrapped) {
      // Posición objetivo: lado izquierdo del jugador a la misma altura
      const offsetX = -25;  // 25 píxeles a la izquierda
      const offsetY = 0;    // Misma altura que el jugador

      const targetX = targetPos.x + offsetX;
      const targetY = targetPos.y + offsetY;

      const dx = targetX - this.sprite.x;
      const dy = targetY - this.sprite.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      // Deadzone de 2px para suavidad
      if (dist > 2) {
        const speed = 3.5;  // Velocidad de seguimiento suave
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
    this.animTime += delta;  // Incrementar tiempo de animación
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
    const t = (this.animTime % 1000) / 1000;  // Ciclo de 1 segundo

    if (this.stage === 0) {
      // Chispa pulsante (stage 0)
      const pulse = 1 + Math.sin(t * Math.PI * 2) * 0.3;
      const size = 8 * pulse;

      // Aura externa (pulsante)
      this.graphics.fillStyle(0xffff00, 0.2);
      this.graphics.fillCircle(x, y, 14 * pulse);

      // Núcleo amarillo
      this.graphics.fillStyle(0xffff00, 1);
      this.graphics.fillCircle(x, y, size);

      // Centro blanco brillante
      this.graphics.fillStyle(0xffffff, 0.8);
      this.graphics.fillCircle(x, y, size * 0.5);
    } else if (this.stage === 1) {
      // Prototipo rotante (stage 1)
      const angle = t * Math.PI * 2;

      // Cuadrados giratorios
      this.graphics.save();
      this.graphics.translateCanvas(x, y);
      this.graphics.rotateCanvas(angle);

      this.graphics.lineStyle(2, 0x00ffff, 1);
      this.graphics.strokeRect(-8, -8, 16, 16);
      this.graphics.strokeRect(-5, -5, 10, 10);

      // Líneas diagonales que rotan
      this.graphics.lineBetween(-8, -8, -4, -4);
      this.graphics.lineBetween(8, -8, 4, -4);
      this.graphics.lineBetween(-8, 8, -4, 4);
      this.graphics.lineBetween(8, 8, 4, 4);

      this.graphics.restore();
    } else {
      // Producto premium (stage 2)
      const pulse = 1 + Math.sin(t * Math.PI * 2) * 0.1;
      const shine = Math.sin(t * Math.PI * 2);

      // Aura de éxito (glow exterior)
      this.graphics.fillStyle(0xff6b35, 0.15);
      this.graphics.fillCircle(x, y, 18 * pulse);
      this.graphics.fillStyle(0xff6b35, 0.25);
      this.graphics.fillCircle(x, y, 13 * pulse);

      // Cuadrado principal con gradiente visual
      this.graphics.fillStyle(0xff6b35, 1);
      this.graphics.fillRect(x - 10, y - 10, 20, 20);

      // Detalles internos (cruz central)
      this.graphics.lineStyle(1.5, 0xffaa66, 0.8);
      this.graphics.lineBetween(x, y - 8, x, y + 8);
      this.graphics.lineBetween(x - 8, y, x + 8, y);

      // Borde doble (premium)
      this.graphics.lineStyle(2, 0xffffff, 1);
      this.graphics.strokeRect(x - 10, y - 10, 20, 20);
      this.graphics.lineStyle(1, 0xffcc88, 0.6);
      this.graphics.strokeRect(x - 8, y - 8, 16, 16);

      // Destellos en las esquinas
      const cornerShine = Math.max(0.3, Math.abs(shine) * 0.9);
      this.graphics.fillStyle(0xffffff, cornerShine);
      this.graphics.fillCircle(x - 8, y - 8, 2);
      this.graphics.fillCircle(x + 8, y - 8, 2);
      this.graphics.fillCircle(x - 8, y + 8, 2);
      this.graphics.fillCircle(x + 8, y + 8, 2);

      // Estrella de éxito (centro pulsante)
      this.graphics.fillStyle(0xffffff, 0.7 * pulse);
      this.graphics.fillCircle(x, y, 3);
    }
  }

  destroy() {
    if (this.sprite) this.sprite.destroy();
    if (this.graphics) this.graphics.destroy();
    if (this.nameText) this.nameText.destroy();
  }
}
