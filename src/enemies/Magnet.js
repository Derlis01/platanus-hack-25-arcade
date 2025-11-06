// =============================================================================
// Magnet Enemy (Procrastinación - Sofá)
// =============================================================================
class Magnet extends Enemy {
  constructor(scene, config) {
    super(scene, config);
    this.x = config.x;
    this.y = config.y;
    this.w = config.w || 80;
    this.h = config.h || 80;
    this.radius = 120;
    this.pulseTimer = 0;
    this.trapTimer = 0; // Tiempo acumulado que la idea está en el radio
    this.name = config.name || 'Sofá';
    
    // Crear texto con el nombre - mejor contraste
    this.nameText = scene.add.text(
      this.x + this.w/2,
      this.y - 15,
      this.name,
      { 
        fontSize: '13px', 
        fill: '#ffffff',
        fontFamily: 'monospace',
        stroke: '#663366',
        strokeThickness: 4,
        fontStyle: 'bold'
      }
    ).setOrigin(0.5);
  }

  update(delta) {
    this.pulseTimer += delta;
    this.graphics.clear();

    const centerX = this.x + this.w / 2;
    const centerY = this.y + this.h / 2;
    const armWidth = this.w * 0.15;
    const seatHeight = this.h * 0.6;
    const backHeight = this.h * 0.5;

    // Efecto de atracción (pulso) - ANTES para que quede detrás
    const pulse = Math.sin(this.pulseTimer * 0.003) * 0.3 + 0.7;
    this.graphics.fillStyle(NEON.PURPLE, 0.15 * pulse);
    this.graphics.fillCircle(centerX, centerY, this.radius);
    this.graphics.fillStyle(NEON.MAGENTA, 0.1 * pulse);
    this.graphics.fillCircle(centerX, centerY, this.radius * 0.7);

    // Asiento principal neon
    this.graphics.fillStyle(NEON.PURPLE, 0.6);
    this.graphics.fillRect(this.x + armWidth, centerY - seatHeight / 2, this.w - 2 * armWidth, seatHeight);
    this.graphics.lineStyle(2, NEON.PURPLE, 1);
    this.graphics.strokeRect(this.x + armWidth, centerY - seatHeight / 2, this.w - 2 * armWidth, seatHeight);

    // Brazos neon
    this.graphics.fillStyle(NEON.PURPLE, 0.7);
    this.graphics.fillRect(this.x, centerY - seatHeight / 2, armWidth, seatHeight);
    this.graphics.fillRect(this.x + this.w - armWidth, centerY - seatHeight / 2, armWidth, seatHeight);
    this.graphics.lineStyle(2, NEON.MAGENTA, 1);
    this.graphics.strokeRect(this.x, centerY - seatHeight / 2, armWidth, seatHeight);
    this.graphics.strokeRect(this.x + this.w - armWidth, centerY - seatHeight / 2, armWidth, seatHeight);

    // Respaldo neon
    this.graphics.fillStyle(NEON.MAGENTA, 0.5);
    this.graphics.fillRect(this.x + armWidth * 0.5, this.y - backHeight / 2, this.w - armWidth, backHeight);
    this.graphics.lineStyle(2, NEON.MAGENTA, 1);
    this.graphics.strokeRect(this.x + armWidth * 0.5, this.y - backHeight / 2, this.w - armWidth, backHeight);
  }

  checkCollision(founder, idea, focusSystem) {
    const centerX = this.x + this.w/2;
    const centerY = this.y + this.h/2;

    // SOLO afectar a la idea - NO al fundador
    if (idea && idea.sprite && idea.applyForce) {
      const ideaDist = Phaser.Math.Distance.Between(
        idea.sprite.x, idea.sprite.y,
        centerX, centerY
      );

      // Si ya está atrapada, mantenerla en el centro del magnet
      if (idea.isTrapped) {
        const dx = centerX - idea.sprite.x;
        const dy = centerY - idea.sprite.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist > 0.1) {
          // Fuerza muy fuerte para mantenerla pegada al centro
          const pullStrength = 8;
          const forceX = (dx / dist) * pullStrength;
          const forceY = (dy / dist) * pullStrength;
          idea.applyForce(forceX, forceY);
        }
        return; // No calcular más si ya está atrapada
      }

      if (ideaDist < this.radius) {
        // Aumentar el timer mientras la idea está dentro del radio
        this.trapTimer += 16; // ~16ms por frame a 60fps

        const timeInSeconds = this.trapTimer / 1000;

        // TRAMPA PERMANENTE después de 3 segundos
        if (timeInSeconds >= 3.0) {
          idea.isTrapped = true;
          idea.trapSource = this;
          return; // La lógica de trampa activa se maneja arriba
        }

        // La fuerza aumenta progresivamente mientras más tiempo pasa en el radio
        // Fase 1 (0-0.8s): Atracción débil, se puede escapar fácilmente
        // Fase 2 (0.8-2s): Atracción media-fuerte, difícil escapar
        // Fase 3 (2-3s): Atracción muy fuerte, muy difícil escapar
        let timeMultiplier;

        if (timeInSeconds < 0.8) {
          timeMultiplier = timeInSeconds / 0.8 * 0.6; // 0 a 0.6 (60%)
        } else if (timeInSeconds < 2.0) {
          timeMultiplier = 0.6 + (timeInSeconds - 0.8) / 1.2 * 0.8; // 0.6 a 1.4 (60% a 140%)
        } else {
          timeMultiplier = 1.4 + (timeInSeconds - 2.0) * 2; // 1.4 a 3.4 (140% a 340%)
        }

        const normalizedDist = ideaDist / this.radius;
        const basePull = Math.pow(1 - normalizedDist, 2) * 15;
        const pullStrength = basePull * timeMultiplier;

        // Calcular dirección hacia el centro del sofá
        const dx = centerX - idea.sprite.x;
        const dy = centerY - idea.sprite.y;

        // Aplicar la fuerza
        const forceX = (dx / ideaDist) * pullStrength;
        const forceY = (dy / ideaDist) * pullStrength;
        idea.applyForce(forceX, forceY);
      } else {
        // Resetear el timer si la idea sale del radio
        this.trapTimer = 0;
      }
    }
  }

  destroy() {
    if (this.nameText) this.nameText.destroy();
    super.destroy();
  }
}
