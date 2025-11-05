// =============================================================================
// Eye Enemy
// =============================================================================
class Eye extends Enemy {
  constructor(scene, config) {
    super(scene, config);
    this.x = config.x;
    this.y = config.y;
    this.angle = 0;
    this.rotSpeed = config.rotSpeed || 1;
    this.range = 150;
    this.freezeTimer = 0;
    this.createNameText(config.x, config.y);
  }

  update(delta) {
    this.angle += this.rotSpeed * delta * 0.001;
    if (this.freezeTimer > 0) this.freezeTimer -= delta;

    this.graphics.clear();

    // Cuerpo del ojo (gris)
    this.graphics.fillStyle(0x666666, 1);
    this.graphics.fillCircle(this.x, this.y, 15);

    // Pupila roja que rota
    this.graphics.fillStyle(0xff0000, 1);
    const px = this.x + Math.cos(this.angle) * 5;
    const py = this.y + Math.sin(this.angle) * 5;
    this.graphics.fillCircle(px, py, 5);

    // Rayo de visión (rojo cuando congela, azul cuando busca)
    const rayColor = this.freezeTimer > 0 ? 0xff0000 : 0x00ffff;
    const rayAlpha = this.freezeTimer > 0 ? 0.8 : 0.5;
    this.graphics.lineStyle(3, rayColor, rayAlpha);
    this.graphics.lineBetween(
      this.x,
      this.y,
      this.x + Math.cos(this.angle) * this.range,
      this.y + Math.sin(this.angle) * this.range
    );

    // Si está congelando, añadir un círculo pulsante de alerta
    if (this.freezeTimer > 0) {
      const pulse = 1 + Math.sin(Date.now() * 0.01) * 0.3;
      this.graphics.lineStyle(2, 0xff0000, 0.6);
      this.graphics.strokeCircle(this.x, this.y, 25 * pulse);
    }

    this.updateNamePosition(this.x, this.y);
  }

  checkCollision(founder, idea, focusSystem) {
    if (!founder || !founder.sprite || !founder.sprite.body) return;
    
    // Si ya estamos congelando, seguir congelando al jugador
    if (this.freezeTimer > 0) {
      founder.sprite.setVelocityX(0);
      founder.sprite.setVelocityY(Math.min(founder.sprite.body.velocity.y, 0)); // Permitir caer pero no saltar
      return;
    }
    
    // Calcular distancia y ángulo al fundador
    const fx = founder.sprite.x - this.x;
    const fy = founder.sprite.y - this.y;
    const fdist = Math.sqrt(fx * fx + fy * fy);
    const fangle = Math.atan2(fy, fx);
    
    // Diferencia angular (normalizada entre -PI y PI)
    let angleDiff = fangle - this.angle;
    while (angleDiff > Math.PI) angleDiff -= 2 * Math.PI;
    while (angleDiff < -Math.PI) angleDiff += 2 * Math.PI;
    angleDiff = Math.abs(angleDiff);
    
    // Si está en rango y el ángulo coincide (cono de 0.3 radianes ≈ 17 grados)
    if (fdist < this.range && angleDiff < 0.3) {
      this.freezeTimer = 3000; // Congela por 3 segundos
      playTone(this.scene, 800, 0.2);
      
      // MUERTE INSTANTÁNEA - daño de 100 (toda la vida)
      if (focusSystem) focusSystem.damage(100);
    }
  }
}
