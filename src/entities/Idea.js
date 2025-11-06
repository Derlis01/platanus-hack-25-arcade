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
      // CHISPA NEON (stage 0) - Amarillo/Pink
      const pulse = 1 + Math.sin(t * Math.PI * 2) * 0.4;
      const size = 8 * pulse;

      // Aura externa multicolor
      this.graphics.fillStyle(NEON.YELLOW, 0.15);
      this.graphics.fillCircle(x, y, 20 * pulse);
      this.graphics.fillStyle(NEON.PINK, 0.2);
      this.graphics.fillCircle(x, y, 16 * pulse);
      this.graphics.fillStyle(NEON.YELLOW, 0.3);
      this.graphics.fillCircle(x, y, 12 * pulse);

      // Núcleo amarillo brillante
      this.graphics.fillStyle(NEON.YELLOW, 1);
      this.graphics.fillCircle(x, y, size);

      // Borde brillante
      this.graphics.lineStyle(2, NEON.YELLOW, 1);
      this.graphics.strokeCircle(x, y, size);

      // Centro blanco ultra brillante
      this.graphics.fillStyle(NEON.WHITE, 0.9);
      this.graphics.fillCircle(x, y, size * 0.4);

      // Partículas flotantes
      for (let i = 0; i < 4; i++) {
        const angle = (t + i * 0.25) * Math.PI * 2;
        const dist = 12 + Math.sin(t * 2 + i) * 3;
        const px = x + Math.cos(angle) * dist;
        const py = y + Math.sin(angle) * dist;
        this.graphics.fillStyle(NEON.PINK, 0.6);
        this.graphics.fillCircle(px, py, 2);
      }
    } else if (this.stage === 1) {
      // PROTOTIPO NEON (stage 1) - Magenta/Purple
      const angle = t * Math.PI * 2;

      // Aura rotante exterior
      this.graphics.fillStyle(NEON.MAGENTA, 0.2);
      this.graphics.fillCircle(x, y, 18);
      this.graphics.fillStyle(NEON.PURPLE, 0.3);
      this.graphics.fillCircle(x, y, 14);

      // Cuadrados giratorios con glow
      this.graphics.save();
      this.graphics.translateCanvas(x, y);
      this.graphics.rotateCanvas(angle);

      // Cuadrado exterior brillante
      this.graphics.lineStyle(3, NEON.MAGENTA, 1);
      this.graphics.strokeRect(-8, -8, 16, 16);

      // Glow del cuadrado exterior
      this.graphics.lineStyle(1, NEON.MAGENTA, 0.4);
      this.graphics.strokeRect(-10, -10, 20, 20);

      // Cuadrado interior
      this.graphics.lineStyle(2, NEON.PURPLE, 1);
      this.graphics.strokeRect(-5, -5, 10, 10);
      this.graphics.fillStyle(NEON.PURPLE, 0.3);
      this.graphics.fillRect(-5, -5, 10, 10);

      // Líneas diagonales que rotan
      this.graphics.lineStyle(2, NEON.MAGENTA, 0.8);
      this.graphics.lineBetween(-8, -8, -4, -4);
      this.graphics.lineBetween(8, -8, 4, -4);
      this.graphics.lineBetween(-8, 8, -4, 4);
      this.graphics.lineBetween(8, 8, 4, 4);

      // Puntos brillantes en esquinas
      this.graphics.fillStyle(NEON.WHITE, 0.9);
      this.graphics.fillCircle(-8, -8, 2);
      this.graphics.fillCircle(8, -8, 2);
      this.graphics.fillCircle(-8, 8, 2);
      this.graphics.fillCircle(8, 8, 2);

      this.graphics.restore();
    } else {
      // PRODUCTO NEON (stage 2) - Cyan/Green
      const pulse = 1 + Math.sin(t * Math.PI * 2) * 0.15;
      const shine = Math.sin(t * Math.PI * 2);

      // Aura de éxito multicolor (glow exterior)
      this.graphics.fillStyle(NEON.CYAN, 0.15);
      this.graphics.fillCircle(x, y, 22 * pulse);
      this.graphics.fillStyle(NEON.GREEN, 0.2);
      this.graphics.fillCircle(x, y, 18 * pulse);
      this.graphics.fillStyle(NEON.CYAN, 0.3);
      this.graphics.fillCircle(x, y, 14 * pulse);

      // Cuadrado principal brillante
      this.graphics.fillStyle(NEON.CYAN, 0.6);
      this.graphics.fillRect(x - 10, y - 10, 20, 20);

      // Borde exterior brillante
      this.graphics.lineStyle(3, NEON.CYAN, 1);
      this.graphics.strokeRect(x - 10, y - 10, 20, 20);

      // Glow del borde
      this.graphics.lineStyle(1, NEON.CYAN, 0.4);
      this.graphics.strokeRect(x - 12, y - 12, 24, 24);

      // Borde interior verde
      this.graphics.lineStyle(2, NEON.GREEN, 1);
      this.graphics.strokeRect(x - 8, y - 8, 16, 16);

      // Cruz central de energía
      this.graphics.lineStyle(2, NEON.GREEN, 0.9);
      this.graphics.lineBetween(x, y - 8, x, y + 8);
      this.graphics.lineBetween(x - 8, y, x + 8, y);

      // Destellos en las esquinas (pulsantes)
      const cornerShine = Math.max(0.4, Math.abs(shine) * 0.95);
      this.graphics.fillStyle(NEON.WHITE, cornerShine);
      this.graphics.fillCircle(x - 8, y - 8, 3);
      this.graphics.fillCircle(x + 8, y - 8, 3);
      this.graphics.fillCircle(x - 8, y + 8, 3);
      this.graphics.fillCircle(x + 8, y + 8, 3);

      // Glow de destellos
      this.graphics.fillStyle(NEON.CYAN, cornerShine * 0.5);
      this.graphics.fillCircle(x - 8, y - 8, 5);
      this.graphics.fillCircle(x + 8, y - 8, 5);
      this.graphics.fillCircle(x - 8, y + 8, 5);
      this.graphics.fillCircle(x + 8, y + 8, 5);

      // Estrella de éxito (centro ultra brillante)
      this.graphics.fillStyle(NEON.WHITE, 0.9 * pulse);
      this.graphics.fillCircle(x, y, 4);
      this.graphics.fillStyle(NEON.GREEN, 0.5 * pulse);
      this.graphics.fillCircle(x, y, 6);
    }
  }

  destroy() {
    if (this.sprite) this.sprite.destroy();
    if (this.graphics) this.graphics.destroy();
    if (this.nameText) this.nameText.destroy();
  }
}
