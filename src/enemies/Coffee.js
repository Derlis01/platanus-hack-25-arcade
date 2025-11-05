// =============================================================================
// Coffee - Recupera focus (vida)
// =============================================================================
class Coffee extends Enemy {
  constructor(scene, config) {
    super(scene, config);
    this.x = config.x;
    this.y = config.y;
    this.collected = false;
    this.bobTime = 0;
    this.createNameText(config.x, config.y - 35);
  }

  update(delta) {
    if (this.collected) return;
    
    this.bobTime += delta;
    const bob = Math.sin(this.bobTime * 0.003) * 3;
    
    this.graphics.clear();
    
    // Taza de café (vista desde arriba)
    const cy = this.y + bob;
    
    // Plato/base
    this.graphics.fillStyle(0x8B4513, 1);
    this.graphics.fillCircle(this.x, cy + 2, 14);
    
    // Taza principal
    this.graphics.fillStyle(0xD2691E, 1);
    this.graphics.fillCircle(this.x, cy, 12);
    
    // Café caliente (líquido oscuro)
    this.graphics.fillStyle(0x3E2723, 1);
    this.graphics.fillCircle(this.x, cy, 8);
    
    // Vapor/brillo (puntos brillantes que suben)
    const steam1 = Math.sin(this.bobTime * 0.005) * 3;
    const steam2 = Math.sin(this.bobTime * 0.005 + 1) * 3;
    this.graphics.fillStyle(0xFFFFFF, 0.6);
    this.graphics.fillCircle(this.x - 3 + steam1, cy - 15, 1.5);
    this.graphics.fillCircle(this.x + 3 + steam2, cy - 18, 1.5);
    
    // Brillo en el café
    this.graphics.fillStyle(0x8B4513, 0.5);
    this.graphics.fillCircle(this.x - 2, cy - 2, 3);
    
    // Actualizar nombre
    this.updateNamePosition(this.x, cy - 20);
  }

  checkCollision(founder, idea, focusSystem) {
    if (this.collected) return;
    if (!founder || !founder.sprite) return;
    
    const dist = Phaser.Math.Distance.Between(
      founder.sprite.x,
      founder.sprite.y,
      this.x,
      this.y
    );
    
    // Si el jugador toca el café
    if (dist < 30) {
      this.collected = true;
      
      // Recuperar 30 puntos de focus
      if (focusSystem) {
        focusSystem.heal(30);
      }
      
      // Sonido de recolección
      playTone(this.scene, 660, 0.15);
      
      // Ocultar el café
      this.graphics.clear();
      if (this.nameText) this.nameText.setVisible(false);
    }
  }

  destroy() {
    if (this.graphics) this.graphics.destroy();
    if (this.nameText) this.nameText.destroy();
  }
}
