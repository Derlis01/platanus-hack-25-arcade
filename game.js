// =============================================================================
// CONSTANTS
// =============================================================================
const GAME_WIDTH = 800;
const GAME_HEIGHT = 600;
const GRAVITY = 800;
const PLAYER_SPEED = 180;
const JUMP_VELOCITY = -400;
const PATH_SAMPLE_RATE = 3;
const PATH_DELAY_FRAMES = 10;
const MAX_DISTANCE = 130;
const DISTANCE_DRAIN_RATE = 1.7;

const GAME_STATE = {
  INTRO: 'INTRO',
  LEVEL_INTRO: 'LEVEL_INTRO',
  PLAYING: 'PLAYING',
  GAMEOVER: 'GAMEOVER',
  LEVEL_COMPLETE: 'LEVEL_COMPLETE',
  ENDING: 'ENDING'
};


// =============================================================================
// ARCADE CONTROLS
// =============================================================================
const ARCADE_CONTROLS = {
  'P1U': ['w'],
  'P1D': ['s'],
  'P1L': ['a'],
  'P1R': ['d'],
  'P1DL': null,
  'P1DR': null,
  'P1A': ['u'],
  'P1B': ['i'],
  'P1C': ['o'],
  'P1X': ['j'],
  'P1Y': ['k'],
  'P1Z': ['l'],
  'START1': ['1', 'Enter'],
  'P2U': ['ArrowUp'],
  'P2D': ['ArrowDown'],
  'P2L': ['ArrowLeft'],
  'P2R': ['ArrowRight'],
  'P2DL': null,
  'P2DR': null,
  'P2A': ['r'],
  'P2B': ['t'],
  'P2C': ['y'],
  'P2X': ['f'],
  'P2Y': ['g'],
  'P2Z': ['h'],
  'START2': ['2']
};

const KEYBOARD_TO_ARCADE = {};
for (const [arcadeCode, keyboardKeys] of Object.entries(ARCADE_CONTROLS)) {
  if (keyboardKeys) {
    const keys = Array.isArray(keyboardKeys) ? keyboardKeys : [keyboardKeys];
    keys.forEach(key => { KEYBOARD_TO_ARCADE[key] = arcadeCode; });
  }
}


// =============================================================================
// TEXTS
// =============================================================================
const TEXTS = {
  intro: {
    title: "Vestigium",
    subtitle: "Protege tu Idea a través del caos.\n Un juego simbólico sobre el viaje de un fundador.",
    start: "[Presiona para empezar]"
  },
  levels: [
    {
      day: "DÍA 1: EL GARAJE",
      text: "Una chispa nace en la oscuridad.\nNo la dejes apagar.",
      ideaName: "La Chispa"
    },
    {
      day: "DÍA 100: LA CONSTRUCCIÓN",
      text: "Tu prototipo toma forma.\nCada paso cuenta. Cada error duele.",
      ideaName: "El Prototipo"
    },
    {
      day: "DÍA 365: EL LANZAMIENTO",
      text: "El mundo es cruel con lo nuevo.\nDefiende lo que construiste.",
      ideaName: "El Producto"
    }
  ],
  ending: [
    "FELICITACIONES",
    "",
    "",
    "Protegiste la Idea.",
    "Guiaste el Prototipo.",
    "Defendiste el Producto.",
    "",
    "",
    "",
    "",
    "Pero esto...",
    "",
    "fue solo el juego.",
    "",
    "",
    "",
    "",
    "Ahora,",
    "",
    "te toca a vos.",
    "",
    "",
    "",
    "...en el mundo real."
  ]
};


// =============================================================================
// LEVEL 0: EL GARAJE
// =============================================================================
const LEVEL_0_GARAGE = {
  id: 0,
  name: "El Garaje",
  bg: 0x1a1a2e,
  ideaStage: 0,
  platforms: [
    // Base (piso principal)
    { x: 0, y: 560, w: 800, h: 40 },

    // ZONA 1: Salida inicial - Plataformas pequeñas para ganar altura
    { x: 40, y: 490, w: 80, h: 18 },      // Plat 1: Pequeña, requiere precisión
    { x: 130, y: 450, w: 70, h: 18 },     // Plat 2: Más pequeña, brecha más grande
    { x: 210, y: 410, w: 90, h: 18 },     // Plat 3: Un poco más ancha para respiro

    // ZONA 2: Área del primer sofá - Movimiento lateral con peligro
    { x: 310, y: 360, w: 60, h: 18 },     // Plat 4: Estrecha, junto al sofá
    { x: 390, y: 330, w: 80, h: 18 },     // Plat 5: Salto diagonal para evitar sofá
    { x: 480, y: 310, w: 75, h: 18 },     // Plat 6: Aterrizaje preciso

    // ZONA 3: Subida rápida - Plataformas más generosas
    { x: 540, y: 270, w: 100, h: 18 },    // Plat 7: Más ancha para estabilidad
    { x: 620, y: 230, w: 90, h: 18 },     // Plat 8: Diagonal pero amplia
    { x: 580, y: 190, w: 95, h: 18 },     // Plat 9: Buena zona de aterrizaje

    // ZONA 4: Recta final hacia la salida (SIMPLIFICADA)
    { x: 650, y: 150, w: 100, h: 18 },    // Plat 10: Plataforma ancha para respirar
    { x: 700, y: 110, w: 100, h: 50 }     // Plat 11: Salida generosa y fácil
  ],
  enemies: [
    // Sofá #1: "Procrastinación" - Posicionado estratégicamente en zona 2
    // Fuerza al jugador a saltar con precisión para evitarlo
    { type: 'magnet', x: 300, y: 380, w: 60, h: 50, name: 'Procrastinaciones' },

    // Sofá #2: "Distracción" - En la zona 3, crea peligro en la subida rápida
    // Requiere planificación de ruta
    { type: 'magnet', x: 600, y: 270, w: 55, h: 50, name: 'Distracciones' }
  ],
  start: { x: 50, y: 500 },
  exit: { x: 750, y: 80 }
};


// =============================================================================
// LEVEL 1: LA FÁBRICA
// =============================================================================
// Tema: Diseño en "U" - DEBES subir por la izquierda, cruzar arriba, y bajar
const LEVEL_1_FACTORY = {
  id: 1,
  name: "La Fábrica",
  bg: 0x2a2a4e,
  ideaStage: 1,
  platforms: [
    // Piso principal
    { x: 0, y: 560, w: 800, h: 40 },

    // === LADO IZQUIERDO: ASCENSO (con Bugs) ===
    { x: 0, y: 500, w: 120, h: 20 },       // Base inicio
    { x: 40, y: 450, w: 100, h: 20 },      // Escalón 1
    { x: 80, y: 400, w: 100, h: 20 },      // Escalón 2 - Bug #1
    { x: 40, y: 350, w: 100, h: 20 },      // Escalón 3
    { x: 80, y: 300, w: 100, h: 20 },      // Escalón 4 - Bug #2
    { x: 40, y: 250, w: 100, h: 20 },      // Escalón 5
    { x: 80, y: 200, w: 120, h: 20 },      // Tope izquierdo

    // === PASILLO SUPERIOR: CRUCE (con Escrutinio) ===
    { x: 200, y: 180, w: 150, h: 20 },     // Pasillo antes del ojo
    { x: 360, y: 160, w: 90, h: 20 },      // Plataforma BAJO el Escrutinio
    { x: 460, y: 180, w: 150, h: 20 },     // Pasillo después del ojo

    // === LADO DERECHO: DESCENSO (con más obstáculos) ===
    { x: 620, y: 200, w: 120, h: 20 },     // Tope derecho
    { x: 660, y: 250, w: 100, h: 20 },     // Escalón 1
    { x: 620, y: 300, w: 100, h: 20 },     // Escalón 2
    { x: 660, y: 350, w: 100, h: 20 },     // Escalón 3 - Bug #3
    { x: 620, y: 400, w: 100, h: 20 },     // Escalón 4
    { x: 680, y: 450, w: 120, h: 20 },     // Casi en el piso

    // === BARRERA CENTRAL: Bloquea atajos ===
    { x: 300, y: 560, w: 20, h: 180 },     // Muro vertical central (impide atajos)
  ],
  enemies: [
    // Bug #1: Patrulla en escalón 2 (izquierda)
    { type: 'bug', x: 120, y: 380, patrol: [80, 160], name: 'Complejidad' },

    // Café #1: Recuperación en escalón 3 (lado izquierdo)
    { type: 'coffee', x: 90, y: 330, name: 'Cafe' },

    // Bug #2: Patrulla en escalón 4 (izquierda)
    { type: 'bug', x: 120, y: 280, patrol: [80, 160], name: 'Deuda Tecnica' },

    // OJO LETAL #1: Vigila el pasillo izquierdo del centro (MUERTE INSTANTÁNEA)
    { type: 'eye', x: 275, y: 100, rotSpeed: 1.8, name: 'Fecha Limite' },

    // Café #2: Recuperación justo antes del segundo ojo
    { type: 'coffee', x: 405, y: 140, name: 'Cafe' },

    // OJO LETAL #2: Vigila el pasillo derecho del centro (MUERTE INSTANTÁNEA)
    { type: 'eye', x: 535, y: 100, rotSpeed: 1.5, name: 'Perfeccionismo' },

    // Bug #3: Patrulla en escalón 3 (derecha)
    { type: 'bug', x: 680, y: 330, patrol: [630, 730], name: 'Scope Creep' },

    // Café #3: Recuperación antes del final
    { type: 'coffee', x: 690, y: 280, name: 'Cafe' },

    // Síndrome del Impostor: En el piso inferior (zona de muerte si caes)
    { type: 'shadow', x: 500, y: 530, idle: 2000, name: 'Burnout' },
  ],
  start: { x: 50, y: 480 },
  exit: { x: 730, y: 430 }
};


// =============================================================================
// LEVEL 2: EL MERCADO
// El nivel final - un recorrido épico a través del caos del mercado
// Zona 1: El Ruido (bubbles caóticas)
// Zona 2: La Competencia (cannons + eyes)
// Zona 3: La Tentación Final (magnet gigante + shadow)
// Plataformas ajustadas: saltos máximos de ~90px (alcanzables con JUMP_VELOCITY -400)
// Cafés estratégicos para recuperar focus en puntos críticos
// =============================================================================
const LEVEL_2_MARKET = {
  id: 2,
  name: "El Mercado",
  bg: 0x4a2a4e,
  ideaStage: 2,
  platforms: [
    // Piso base
    { x: 0, y: 560, w: 800, h: 40 },
    
    // ZONA 1: EL RUIDO (izquierda - sección inicial)
    { x: 50, y: 470, w: 120, h: 20 },      // -90px desde piso
    { x: 200, y: 390, w: 100, h: 20 },     // -80px
    { x: 80, y: 310, w: 100, h: 20 },      // -80px
    { x: 220, y: 240, w: 90, h: 20 },      // -70px
    
    // ZONA 2: LA COMPETENCIA (centro - sección media)
    { x: 350, y: 380, w: 110, h: 20 },     // Plataforma de transición
    { x: 500, y: 300, w: 100, h: 20 },     // -80px
    { x: 360, y: 220, w: 100, h: 20 },     // -80px
    { x: 500, y: 150, w: 90, h: 20 },      // -70px
    
    // ZONA 3: EL FINAL (derecha-arriba - sección final)
    { x: 630, y: 270, w: 120, h: 20 },     // Plataforma de transición
    { x: 580, y: 190, w: 100, h: 20 },     // -80px
    { x: 680, y: 110, w: 100, h: 20 }      // -80px (salida arriba)
  ],
  enemies: [
    // === ZONA 1: EL RUIDO ===
    // Solo 3 bubbles (antes 5) - menos caos
    { type: 'bubble', x: 150, y: 420, bouncing: true },
    { type: 'bubble', x: 200, y: 260, bouncing: true },
    { type: 'bubble', x: 120, y: 340, bouncing: true },
    
    // CAFÉ 1: Después de sobrevivir al ruido inicial
    { type: 'coffee', x: 220, y: 210 },
    
    // === ZONA 2: LA COMPETENCIA ===
    // Solo 2 cannons (antes 3) - menos fuego cruzado
    { type: 'cannon', x: 320, y: 10, targetIdea: true },
    { type: 'cannon', x: 530, y: 560, targetIdea: true },
    
    // Solo 1 eye (antes 2) - más espacio para maniobrar
    { type: 'eye', x: 430, y: 270, radius: 70 },
    
    // CAFÉ 2: Antes de la zona final (crítico)
    { type: 'coffee', x: 520, y: 120 },
    
    // === ZONA 3: LA TENTACIÓN FINAL ===
    // Magnet más pequeño y alejado
    { type: 'magnet', x: 600, y: 230, w: 55, h: 55 },
    
    // Sin shadow - una amenaza menos
    
    // CAFÉ 3: Recompensa antes del salto final
    { type: 'coffee', x: 630, y: 160 }
  ],
  start: { x: 50, y: 500 },
  exit: { x: 720, y: 70 } // Arriba a la derecha - ajustado para estar en plataforma
};


// =============================================================================
// PathRecorder
// =============================================================================
class PathRecorder {
  constructor() {
    this.path = new Array(PATH_DELAY_FRAMES);
    this.head = 0;
    this.frameCount = 0;
    for (let i = 0; i < PATH_DELAY_FRAMES; i++) {
      this.path[i] = { x: 0, y: 0 };
    }
  }

  record(x, y) {
    this.frameCount++;
    if (this.frameCount % PATH_SAMPLE_RATE === 0) {
      this.path[this.head] = { x, y };
      this.head = (this.head + 1) % PATH_DELAY_FRAMES;
    }
  }

  getDelayedPosition() {
    return { ...this.path[this.head] };
  }

  reset(x, y) {
    for (let i = 0; i < PATH_DELAY_FRAMES; i++) {
      this.path[i] = { x, y };
    }
    this.head = 0;
    this.frameCount = 0;
  }
}


// =============================================================================
// FocusSystem
// =============================================================================
class FocusSystem {
  constructor(scene) {
    this.scene = scene;
    this.focus = 100;
    this.maxFocus = 100;
    this.isShaking = false;
    this.createUI();
  }

  createUI() {
    this.barBg = this.scene.add.rectangle(GAME_WIDTH / 2, 30, 300, 24, 0x333333);
    this.bar = this.scene.add.rectangle(GAME_WIDTH / 2 - 148, 30, 296, 20, 0xff6b35);
    this.bar.setOrigin(0, 0.5);
    this.barBorder = this.scene.add.rectangle(GAME_WIDTH / 2, 30, 300, 24);
    this.barBorder.setStrokeStyle(3, 0xffffff);
    this.label = this.scene.add.text(GAME_WIDTH / 2, 30, 'FOCO', {
      fontSize: '14px',
      fontFamily: 'Arial',
      color: '#ffffff',
      fontStyle: 'bold'
    }).setOrigin(0.5);
  }

  update(founder, idea, delta) {
    if (!founder || !founder.sprite || !idea || !idea.sprite) return;

    const dist = Phaser.Math.Distance.Between(
      founder.sprite.x, founder.sprite.y,
      idea.sprite.x, idea.sprite.y
    );

    if (dist > MAX_DISTANCE) {
      this.drain(DISTANCE_DRAIN_RATE * delta / 16);
      if (!this.isShaking) this.startShake();
    } else if (this.isShaking) {
      this.stopShake();
    }

    const width = (this.focus / this.maxFocus) * 296;
    this.bar.width = width;

    if (this.focus < 30) {
      this.bar.fillColor = 0xff0000;
    } else if (this.focus < 60) {
      this.bar.fillColor = 0xff9900;
    } else {
      this.bar.fillColor = 0xff6b35;
    }
  }

  drain(amount) {
    this.focus = Math.max(0, this.focus - amount);
    if (this.focus === 0 && gameState.currentState === GAME_STATE.PLAYING) {
      changeGameState(GAME_STATE.GAMEOVER);
    }
  }

  damage(amount) {
    this.drain(amount);
    this.showDamageText(amount);
    this.flashBar();
  }

  heal(amount) {
    this.focus = Math.min(this.maxFocus, this.focus + amount);
    this.showHealText(amount);
    this.flashBarGreen();
  }

  showDamageText(amount) {
    const txt = this.scene.add.text(GAME_WIDTH / 2, 60, `-${Math.floor(amount)}`, {
      fontSize: '24px',
      fontFamily: 'Arial',
      color: '#ff0000',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    this.scene.tweens.add({
      targets: txt,
      y: txt.y - 40,
      alpha: 0,
      duration: 800,
      onComplete: () => txt.destroy()
    });
  }

  showHealText(amount) {
    const txt = this.scene.add.text(GAME_WIDTH / 2, 60, `+${Math.floor(amount)}`, {
      fontSize: '24px',
      fontFamily: 'Arial',
      color: '#00ff00',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    this.scene.tweens.add({
      targets: txt,
      y: txt.y - 40,
      alpha: 0,
      duration: 800,
      onComplete: () => txt.destroy()
    });
  }

  flashBar() {
    this.scene.tweens.add({
      targets: this.bar,
      alpha: 0.3,
      duration: 100,
      yoyo: true,
      repeat: 2
    });
  }

  flashBarGreen() {
    const originalColor = this.bar.fillColor;
    this.bar.setFillStyle(0x00ff00);
    this.scene.tweens.add({
      targets: this.bar,
      alpha: 0.3,
      duration: 100,
      yoyo: true,
      repeat: 2,
      onComplete: () => {
        this.bar.setFillStyle(originalColor);
        this.bar.alpha = 1;
      }
    });
  }

  startShake() {
    this.isShaking = true;
    this.scene.cameras.main.shake(100000, 0.003, false);
    playTone(this.scene, 440, 0.1);
  }

  stopShake() {
    if (!this.isShaking) return;
    this.isShaking = false;
    this.scene.cameras.main.resetFX();
  }

  destroy() {
    if (this.isShaking) this.stopShake();
    if (this.barBg) this.barBg.destroy();
    if (this.bar) this.bar.destroy();
    if (this.barBorder) this.barBorder.destroy();
    if (this.label) this.label.destroy();
  }
}


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
      // Producto con brillo (stage 2)
      const shine = Math.sin(t * Math.PI * 2);

      // Cuadrado principal
      this.graphics.fillStyle(0xff6b35, 1);
      this.graphics.fillRect(x - 10, y - 10, 20, 20);

      // Borde blanco
      this.graphics.lineStyle(2.5, 0xffffff, 1);
      this.graphics.strokeRect(x - 10, y - 10, 20, 20);

      // Destello que brilla (esquina)
      this.graphics.fillStyle(0xffffff, Math.max(0.2, shine * 0.7));
      this.graphics.fillRect(x - 8, y - 8, 8, 8);

      // Pequeño punto de luz moviéndose
      const lightX = x - 6 + Math.sin(t * Math.PI * 4) * 4;
      const lightY = y - 6 + Math.cos(t * Math.PI * 4) * 4;
      this.graphics.fillStyle(0xffffff, 0.6);
      this.graphics.fillCircle(lightX, lightY, 2);
    }
  }

  destroy() {
    if (this.sprite) this.sprite.destroy();
    if (this.graphics) this.graphics.destroy();
    if (this.nameText) this.nameText.destroy();
  }
}


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

    // Dibujar sofá con forma más realista
    const centerX = this.x + this.w / 2;
    const centerY = this.y + this.h / 2;
    const armWidth = this.w * 0.15;
    const seatHeight = this.h * 0.6;
    const backHeight = this.h * 0.5;

    // Color base del sofá
    this.graphics.fillStyle(0x8B4789, 1);

    // Asiento principal
    this.graphics.fillRect(this.x + armWidth, centerY - seatHeight / 2, this.w - 2 * armWidth, seatHeight);

    // Brazos izquierdo y derecho (más oscuro)
    this.graphics.fillStyle(0x663366, 1);
    this.graphics.fillRect(this.x, centerY - seatHeight / 2, armWidth, seatHeight);
    this.graphics.fillRect(this.x + this.w - armWidth, centerY - seatHeight / 2, armWidth, seatHeight);

    // Respaldo (atrás)
    this.graphics.fillStyle(0x9966cc, 1);
    this.graphics.fillRect(this.x + armWidth * 0.5, this.y - backHeight / 2, this.w - armWidth, backHeight);

    // Efecto de atracción (pulso)
    const pulse = Math.sin(this.pulseTimer * 0.003) * 0.3 + 0.7;
    this.graphics.fillStyle(0x9966cc, 0.15 * pulse);
    this.graphics.fillCircle(centerX, centerY, this.radius);
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


// =============================================================================
// Shadow Enemy (Síndrome del Impostor)
// =============================================================================
class Shadow extends Enemy {
  constructor(scene, config) {
    super(scene, config);
    this.idleTimer = 0;
    this.frozen = false;
    this.shadow = null;
  }

  update(delta, founder) {
    if (!founder || !founder.sprite || !founder.sprite.body) return;

    const vel = founder.sprite.body.velocity;
    if (Math.abs(vel.x) < 1 && Math.abs(vel.y) < 1) {
      this.idleTimer += delta;
      if (this.idleTimer > 3000 && !this.frozen) {
        this.frozen = true;
        founder.sprite.setVelocityX(0);
        founder.sprite.setVelocityY(0);
        this.shadow = this.scene.add.graphics();
        playTone(this.scene, 200, 0.3);
        this.scene.time.delayedCall(1000, () => {
          this.frozen = false;
          if (this.shadow) {
            this.shadow.destroy();
            this.shadow = null;
          }
          this.idleTimer = 0;
        });
      }
    } else {
      this.idleTimer = 0;
      if (this.shadow) {
        this.shadow.destroy();
        this.shadow = null;
      }
    }

    if (this.shadow) {
      this.shadow.clear();
      this.shadow.fillStyle(0x000000, 0.7);
      this.shadow.fillCircle(founder.sprite.x, founder.sprite.y, 40);
    }
  }

  checkCollision(founder, idea, focusSystem) {
    if (this.frozen && founder && founder.sprite && founder.sprite.body) {
      founder.sprite.setVelocityX(0);
      founder.sprite.setVelocityY(0);
    }
  }

  destroy() {
    if (this.shadow) this.shadow.destroy();
    if (this.graphics) this.graphics.destroy();
  }
}


// =============================================================================
// Bug Enemy
// =============================================================================
class Bug extends Enemy {
  constructor(scene, config) {
    super(scene, config);
    this.sprite = scene.physics.add.sprite(config.x, config.y, null);
    this.sprite.setSize(15, 15);
    this.sprite.setGravityY(GRAVITY);
    this.patrolMin = config.patrol[0];
    this.patrolMax = config.patrol[1];
    this.speed = 50;
    this.direction = 1;
    this.createNameText(config.x, config.y);
  }

  update(delta) {
    if (this.sprite.x >= this.patrolMax) this.direction = -1;
    else if (this.sprite.x <= this.patrolMin) this.direction = 1;
    this.sprite.setVelocityX(this.speed * this.direction);

    this.graphics.clear();
    this.graphics.fillStyle(0xff0000, 1);
    this.graphics.fillCircle(this.sprite.x, this.sprite.y, 8);
    this.graphics.lineStyle(2, 0xffff00, 1);
    this.graphics.strokeCircle(this.sprite.x, this.sprite.y, 10);

    this.updateNamePosition(this.sprite.x, this.sprite.y);
  }

  checkCollision(founder, idea, focusSystem) {
    if (!focusSystem) return;
    if (founder && founder.sprite) {
      const fdist = Phaser.Math.Distance.Between(founder.sprite.x, founder.sprite.y, this.sprite.x, this.sprite.y);
      if (fdist < 20) {
        focusSystem.damage(10);
        playTone(this.scene, 150, 0.1);
      }
    }
  }
}


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


// =============================================================================
// Cannon Enemy
// =============================================================================
class Cannon extends Enemy {
  constructor(scene, config) {
    super(scene, config);
    this.x = config.x;
    this.y = config.y;
    this.fireTimer = 0;
    this.fireRate = 2000;
    this.projectiles = [];
  }

  update(delta, idea) {
    this.fireTimer += delta;
    if (this.fireTimer >= this.fireRate && idea && idea.sprite) {
      const dx = idea.sprite.x - this.x;
      const dy = idea.sprite.y - this.y;
      const dist = Math.sqrt(dx*dx + dy*dy);
      this.projectiles.push({
        x: this.x,
        y: this.y,
        vx: (dx / dist) * 3,
        vy: (dy / dist) * 3
      });
      playTone(this.scene, 300, 0.1);
      this.fireTimer = 0;
    }

    this.projectiles = this.projectiles.filter(p => {
      p.x += p.vx * delta * 0.06;
      p.y += p.vy * delta * 0.06;
      return p.x > 0 && p.x < GAME_WIDTH && p.y > 0 && p.y < GAME_HEIGHT;
    });

    this.graphics.clear();
    this.graphics.fillStyle(0x444444, 1);
    this.graphics.fillRect(this.x - 10, this.y - 5, 20, 10);
    this.graphics.fillStyle(0xff0000, 1);
    this.projectiles.forEach(p => this.graphics.fillCircle(p.x, p.y, 5));
  }

  checkCollision(founder, idea, focusSystem) {
    if (!focusSystem) return;
    this.projectiles.forEach(p => {
      if (idea && idea.sprite) {
        const idist = Phaser.Math.Distance.Between(idea.sprite.x, idea.sprite.y, p.x, p.y);
        if (idist < 15) {
          focusSystem.damage(15);
          playTone(this.scene, 200, 0.2);
          p.x = -1000;
        }
      }
    });
  }
}


// =============================================================================
// Bubble Enemy
// =============================================================================
class Bubble extends Enemy {
  constructor(scene, config) {
    super(scene, config);
    this.sprite = scene.physics.add.sprite(config.x, config.y, null);
    this.sprite.setSize(20, 20);
    this.sprite.setGravityY(0);
    this.sprite.setBounce(1, 1);
    this.sprite.setCollideWorldBounds(true);
    this.bouncing = config.bouncing !== undefined ? config.bouncing : true;
    if (this.bouncing) {
      const angle = Math.random() * Math.PI * 2;
      this.sprite.setVelocity(Math.cos(angle) * 80, Math.sin(angle) * 80);
    }
  }

  update(delta, idea) {
    this.graphics.clear();
    this.graphics.lineStyle(3, 0x888888, 1);
    this.graphics.strokeCircle(this.sprite.x, this.sprite.y, 12);
    this.graphics.fillStyle(0xcccccc, 0.3);
    this.graphics.fillCircle(this.sprite.x, this.sprite.y, 12);
    this.graphics.fillStyle(0xffffff, 0.6);
    this.graphics.fillCircle(this.sprite.x - 4, this.sprite.y - 4, 3);
  }

  checkCollision(founder, idea, focusSystem) {
    if (founder && founder.sprite && founder.sprite.body) {
      const fdist = Phaser.Math.Distance.Between(founder.sprite.x, founder.sprite.y, this.sprite.x, this.sprite.y);
      if (fdist < 25) {
        const dx = founder.sprite.x - this.sprite.x;
        const dy = founder.sprite.y - this.sprite.y;
        const dist = Math.sqrt(dx*dx + dy*dy);
        if (dist > 0) founder.sprite.setVelocityX(founder.sprite.body.velocity.x + (dx/dist) * 100);
      }
    }
    if (idea && idea.sprite && focusSystem) {
      const idist = Phaser.Math.Distance.Between(idea.sprite.x, idea.sprite.y, this.sprite.x, this.sprite.y);
      if (idist < 25) {
        focusSystem.damage(8);
        playTone(this.scene, 250, 0.1);
      }
    }
  }
}


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


// =============================================================================
// GLOBAL STATE
// =============================================================================
// DESARROLLO: Cambia esto para saltarte directamente a un nivel
// Valores: null (mostrar intro), 0 (Garaje), 1 (Fábrica), 2 (Mercado)
const FORCE_START_LEVEL = 2;

const gameState = {
  currentState: GAME_STATE.INTRO,
  currentLevel: 0,
  founder: null,
  idea: null,
  pathRecorder: null,
  focusSystem: null,
  platforms: null,
  enemies: [],
  cursors: null,
  keys: {},
  currentScene: null,
  exitCircle: null,
  exitBorder: null
};

// Array of levels
const LEVELS = [
  LEVEL_0_GARAGE,
  LEVEL_1_FACTORY,
  LEVEL_2_MARKET
];

// =============================================================================
// STATE MANAGEMENT
// =============================================================================
function changeGameState(newState) {
  gameState.currentState = newState;
  if (newState === GAME_STATE.GAMEOVER) {
    showGameOver(gameState.currentScene);
  } else if (newState === GAME_STATE.LEVEL_COMPLETE) {
    handleLevelComplete(gameState.currentScene);
  } else if (newState === GAME_STATE.ENDING) {
    showEnding(gameState.currentScene);
  }
}


// =============================================================================
// PHASER LIFECYCLE FUNCTIONS
// =============================================================================
function preload() {}

function create() {
  gameState.currentScene = this;
  // DESARROLLO: Si FORCE_START_LEVEL está configurado, salta directamente a ese nivel
  if (FORCE_START_LEVEL !== null && FORCE_START_LEVEL >= 0 && FORCE_START_LEVEL < LEVELS.length) {
    startLevel(this, FORCE_START_LEVEL);
  } else {
    showIntroScreen(this);
  }
}

function update(time, delta) {
  if (gameState.currentState !== GAME_STATE.PLAYING) return;
  if (!gameState.founder || !gameState.founder.sprite || !gameState.founder.sprite.body) return;
  if (!gameState.idea || !gameState.idea.sprite) return;
  if (!gameState.pathRecorder || !gameState.focusSystem) return;

  gameState.pathRecorder.record(gameState.founder.sprite.x, gameState.founder.sprite.y);
  const targetPos = gameState.pathRecorder.getDelayedPosition();

  // Actualizar portal animado
  if (gameState.exitPortal) gameState.exitPortal.update(delta);

  // Primero los enemigos aplican sus fuerzas externas a la idea
  gameState.enemies.forEach(enemy => {
    if (enemy.type === 'shadow') enemy.update(delta, gameState.founder);
    else if (enemy.type === 'cannon') enemy.update(delta, gameState.idea);
    else if (enemy.type === 'bubble') enemy.update(delta, gameState.idea);
    else enemy.update(delta);
    enemy.checkCollision(gameState.founder, gameState.idea, gameState.focusSystem);
  });

  // Luego la idea se actualiza, aplicando las fuerzas externas acumuladas
  gameState.idea.update(delta, targetPos);
  gameState.focusSystem.update(gameState.founder, gameState.idea, delta);
  gameState.founder.update();

  handleInput(this, delta);
  checkLevelComplete(this);
}

// =============================================================================
// INPUT HANDLING
// =============================================================================
function handleInput(scene, delta) {
  if (!gameState.founder || !gameState.founder.sprite || !gameState.founder.sprite.body) return;

  const founder = gameState.founder.sprite;
  let moveLeft = false, moveRight = false, jump = false;

  const keysPressed = scene.input.keyboard.keys;
  for (const key in keysPressed) {
    if (keysPressed[key].isDown) {
      const arcadeCode = KEYBOARD_TO_ARCADE[keysPressed[key].originalEvent?.key];
      if (arcadeCode === 'P1L') moveLeft = true;
      if (arcadeCode === 'P1R') moveRight = true;
      if (arcadeCode === 'P1U' || arcadeCode === 'P1A') jump = true;
    }
  }

  if (gameState.keys.a.isDown || gameState.cursors.left.isDown) moveLeft = true;
  if (gameState.keys.d.isDown || gameState.cursors.right.isDown) moveRight = true;
  if (gameState.keys.w.isDown || gameState.keys.space.isDown || gameState.cursors.up.isDown || gameState.keys.u.isDown) jump = true;

  if (moveLeft) founder.setVelocityX(-PLAYER_SPEED);
  else if (moveRight) founder.setVelocityX(PLAYER_SPEED);
  else founder.setVelocityX(0);

  if (jump && founder.body.touching.down) {
    founder.setVelocityY(JUMP_VELOCITY);
    playTone(scene, 330, 0.1);
  }
}

// =============================================================================
// LEVEL MANAGEMENT
// =============================================================================
function startLevel(scene, levelIndex) {
  cleanupLevel(scene);

  gameState.currentLevel = levelIndex;
  const level = LEVELS[levelIndex];
  scene.cameras.main.setBackgroundColor(level.bg);

  gameState.currentState = GAME_STATE.LEVEL_INTRO;
  showLevelIntro(scene, levelIndex, () => {
    gameState.currentState = GAME_STATE.PLAYING;

    gameState.platforms = scene.physics.add.staticGroup();
    level.platforms.forEach(p => {
      const platform = scene.add.rectangle(p.x + p.w / 2, p.y + p.h / 2, p.w, p.h, 0x666666);
      platform.setStrokeStyle(2, 0x888888);
      scene.physics.add.existing(platform, true);
      gameState.platforms.add(platform);
    });

    gameState.founder = new Founder(scene, level.start.x, level.start.y);
    const ideaName = TEXTS.levels[levelIndex].ideaName || 'Idea';
    gameState.idea = new Idea(scene, level.start.x, level.start.y, level.ideaStage, ideaName);
    gameState.pathRecorder = new PathRecorder();
    gameState.pathRecorder.reset(level.start.x, level.start.y);
    gameState.focusSystem = new FocusSystem(scene);

    scene.physics.add.collider(gameState.founder.sprite, gameState.platforms);
    scene.cameras.main.startFollow(gameState.founder.sprite);
    scene.cameras.main.setBounds(0, 0, GAME_WIDTH, GAME_HEIGHT);

    gameState.cursors = scene.input.keyboard.createCursorKeys();
    gameState.keys = {
      w: scene.input.keyboard.addKey('W'),
      a: scene.input.keyboard.addKey('A'),
      s: scene.input.keyboard.addKey('S'),
      d: scene.input.keyboard.addKey('D'),
      space: scene.input.keyboard.addKey('SPACE'),
      u: scene.input.keyboard.addKey('U')
    };

    level.enemies.forEach(eConfig => {
      const enemy = createEnemy(scene, eConfig);
      if (enemy) {
        gameState.enemies.push(enemy);
        if (enemy.sprite) scene.physics.add.collider(enemy.sprite, gameState.platforms);
      }
    });

    // Agregar guía amigable en la esquina superior izquierda (solo en nivel 0)
    gameState.guideText = null;
    if (levelIndex === 0) {
      gameState.guideText = scene.add.text(10, 10, '! Cuidado sofas !\nPasa rapido', {
        fontSize: '12px',
        fill: '#ffff00',
        fontFamily: 'monospace',
        fontStyle: 'bold',
        backgroundColor: '#000000',
        padding: { x: 6, y: 4 }
      }).setScrollFactor(0).setDepth(1000);
    }

    // Portal verde estilo Rick & Morty (simple, sin movimiento)
    gameState.exitPortal = {
      x: level.exit.x,
      y: level.exit.y,
      time: 0,
      graphics: scene.add.graphics(),
      update: function(delta) {
        this.time += delta;
        this.graphics.clear();

        const t = (this.time % 2000) / 2000; // Ciclo de animación

        // Aura verde exterior (glow pulsante)
        const glowAlpha = 0.15 + Math.sin(t * Math.PI * 2) * 0.1;
        this.graphics.fillStyle(0x00ff00, glowAlpha);
        this.graphics.fillCircle(this.x, this.y, 50);

        // Anillo verde brillante exterior
        const outerAlpha = 0.6 + Math.sin(t * Math.PI * 2) * 0.2;
        this.graphics.lineStyle(3, 0x00ff00, outerAlpha);
        this.graphics.strokeCircle(this.x, this.y, 40);

        // Relleno verde semitransparente (portal interior)
        this.graphics.fillStyle(0x00ff00, 0.25);
        this.graphics.fillCircle(this.x, this.y, 35);

        // Anillo verde medio
        this.graphics.lineStyle(2, 0x00ff00, 0.9);
        this.graphics.strokeCircle(this.x, this.y, 28);

        // Partículas verdes que giran (único movimiento circular)
        for (let i = 0; i < 6; i++) {
          const angle = (t + i / 6) * Math.PI * 2;
          const px = this.x + Math.cos(angle) * 32;
          const py = this.y + Math.sin(angle) * 32;
          this.graphics.fillStyle(0x00ff00, 0.7);
          this.graphics.fillCircle(px, py, 2);
        }

        // Centro brillante blanco
        this.graphics.fillStyle(0xffffff, 0.9);
        this.graphics.fillCircle(this.x, this.y, 5);
      },
      destroy: function() {
        this.graphics.destroy();
      }
    };

    // Texto debajo del portal
    const exitNames = {
      0: 'Lanzar',
      1: 'Comercializar',
      2: 'Impactar'
    };
    const exitText = scene.add.text(level.exit.x, level.exit.y + 55, exitNames[levelIndex] || 'Meta', {
      fontSize: '13px',
      fill: '#00ff00',
      fontFamily: 'Arial',
      fontStyle: 'bold',
      stroke: '#000000',
      strokeThickness: 3
    }).setOrigin(0.5);
    gameState.exitText = exitText;

    playTone(scene, 440, 0.1);
  });
}

function cleanupLevel(scene) {
  scene.cameras.main.stopFollow();
  scene.cameras.main.resetFX();
  scene.tweens.killAll();
  scene.time.removeAllEvents();

  if (gameState.exitPortal) {
    gameState.exitPortal.destroy();
    gameState.exitPortal = null;
  }
  if (gameState.exitText) {
    gameState.exitText.destroy();
    gameState.exitText = null;
  }
  if (gameState.guideText) {
    gameState.guideText.destroy();
    gameState.guideText = null;
  }
  if (gameState.focusSystem) {
    gameState.focusSystem.destroy();
    gameState.focusSystem = null;
  }
  if (gameState.idea) {
    gameState.idea.destroy();
    gameState.idea = null;
  }
  if (gameState.founder) {
    gameState.founder.destroy();
    gameState.founder = null;
  }
  if (gameState.platforms) {
    gameState.platforms.clear(true, true);
    gameState.platforms = null;
  }
  gameState.enemies.forEach(e => { if (e && e.destroy) e.destroy(); });
  gameState.enemies = [];
  gameState.pathRecorder = null;
}

function checkLevelComplete(scene) {
  if (!gameState.founder || !gameState.founder.sprite) return;
  const level = LEVELS[gameState.currentLevel];
  const dist = Phaser.Math.Distance.Between(
    gameState.founder.sprite.x,
    gameState.founder.sprite.y,
    level.exit.x,
    level.exit.y
  );
  if (dist < 50) changeGameState(GAME_STATE.LEVEL_COMPLETE);
}

function handleLevelComplete(scene) {
  if (gameState.focusSystem && gameState.focusSystem.isShaking) {
    gameState.focusSystem.stopShake();
  }
  playTone(scene, 880, 0.3);
  scene.time.delayedCall(500, () => {
    if (gameState.currentLevel < LEVELS.length - 1) {
      startLevel(scene, gameState.currentLevel + 1);
    } else {
      changeGameState(GAME_STATE.ENDING);
    }
  });
}

// =============================================================================
// AUDIO
// =============================================================================
function playTone(scene, frequency, duration) {
  const audioContext = scene.sound.context;
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();
  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);
  oscillator.frequency.value = frequency;
  oscillator.type = 'square';
  gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
  oscillator.start(audioContext.currentTime);
  oscillator.stop(audioContext.currentTime + duration);
}


// =============================================================================
// GAME SCREENS
// =============================================================================
function showIntroScreen(scene) {
  gameState.currentState = GAME_STATE.INTRO;

  const overlay = scene.add.rectangle(GAME_WIDTH / 2, GAME_HEIGHT / 2, GAME_WIDTH, GAME_HEIGHT, 0x000000);
  const title = scene.add.text(GAME_WIDTH / 2, 200, TEXTS.intro.title, {
    fontSize: '64px', fontFamily: 'Arial', color: '#ff6b35', fontStyle: 'bold'
  }).setOrigin(0.5);
  const subtitle = scene.add.text(GAME_WIDTH / 2, 300, TEXTS.intro.subtitle, {
    fontSize: '24px', fontFamily: 'Arial', color: '#ffffff', align: 'center'
  }).setOrigin(0.5);
  const startText = scene.add.text(GAME_WIDTH / 2, 450, TEXTS.intro.start, {
    fontSize: '20px', fontFamily: 'Arial', color: '#ffff00'
  }).setOrigin(0.5);

  scene.tweens.add({
    targets: startText,
    alpha: 0.3,
    duration: 600,
    yoyo: true,
    repeat: -1
  });

  scene.input.keyboard.once('keydown', () => {
    overlay.destroy();
    title.destroy();
    subtitle.destroy();
    startText.destroy();
    startLevel(scene, 0);
  });
}

function showLevelIntro(scene, levelIndex, callback) {
  const levelData = TEXTS.levels[levelIndex];
  const overlay = scene.add.rectangle(GAME_WIDTH / 2, GAME_HEIGHT / 2, GAME_WIDTH, GAME_HEIGHT, 0x000000, 0.9);
  const day = scene.add.text(GAME_WIDTH / 2, 200, levelData.day, {
    fontSize: '48px', fontFamily: 'Arial', color: '#ff6b35', fontStyle: 'bold'
  }).setOrigin(0.5);
  const text = scene.add.text(GAME_WIDTH / 2, 300, levelData.text, {
    fontSize: '24px', fontFamily: 'Arial', color: '#ffffff', align: 'center'
  }).setOrigin(0.5);

  scene.time.delayedCall(3000, () => {
    overlay.destroy();
    day.destroy();
    text.destroy();
    callback();
  });
}

function showGameOver(scene) {
  const overlay = scene.add.rectangle(GAME_WIDTH / 2, GAME_HEIGHT / 2, GAME_WIDTH, GAME_HEIGHT, 0x000000, 0.85);
  overlay.setDepth(1000).setScrollFactor(0);

  const title = scene.add.text(GAME_WIDTH / 2, 250, 'BURNOUT', {
    fontSize: '64px', fontFamily: 'Arial', color: '#ff0000', fontStyle: 'bold'
  }).setOrigin(0.5).setDepth(1001).setScrollFactor(0);

  const subtitle = scene.add.text(GAME_WIDTH / 2, 350, 'Tu Idea se perdió en la oscuridad', {
    fontSize: '24px', fontFamily: 'Arial', color: '#ffffff'
  }).setOrigin(0.5).setDepth(1001).setScrollFactor(0);

  const restart = scene.add.text(GAME_WIDTH / 2, 450, '[Presiona para reintentar]', {
    fontSize: '20px', fontFamily: 'Arial', color: '#ffff00'
  }).setOrigin(0.5).setDepth(1001).setScrollFactor(0);

  playTone(scene, 220, 0.5);

  scene.input.keyboard.once('keydown', () => {
    overlay.destroy();
    title.destroy();
    subtitle.destroy();
    restart.destroy();
    startLevel(scene, gameState.currentLevel);
  });
}

function showEnding(scene) {
  // Limpiar completamente el nivel
  cleanupLevel(scene);
  
  // Limpiar cualquier texto residual (como el -8)
  scene.children.list.forEach(child => {
    if (child.type === 'Text' || child.type === 'Graphics' || child.type === 'Sprite') {
      child.destroy();
    }
  });
  
  // Pantalla negra limpia
  scene.cameras.main.setBackgroundColor(0x000000);
  const overlay = scene.add.rectangle(GAME_WIDTH / 2, GAME_HEIGHT / 2, GAME_WIDTH, GAME_HEIGHT, 0x000000);

  let y = 100;
  const lineConfig = [
    { delay: 0, size: '56px', color: '#ff6b35', bold: true, spacing: 60 },      // FELICITACIONES
    { delay: 2500, size: '28px', color: '#ffffff', bold: false, spacing: 40 },  // Protegiste la Idea
    { delay: 3500, size: '28px', color: '#ffffff', bold: false, spacing: 40 },  // Guiaste el Prototipo
    { delay: 4500, size: '28px', color: '#ffffff', bold: false, spacing: 40 },  // Defendiste el Producto
    { delay: 7000, size: '32px', color: '#aaaaaa', bold: false, spacing: 30 },  // Pero esto...
    { delay: 8500, size: '32px', color: '#aaaaaa', bold: false, spacing: 50 },  // fue solo el juego
    { delay: 11000, size: '40px', color: '#ffffff', bold: true, spacing: 30 },  // Ahora,
    { delay: 12500, size: '40px', color: '#ffffff', bold: true, spacing: 50 },  // te toca a vos
    { delay: 15000, size: '36px', color: '#ff6b35', bold: true, spacing: 0 }    // ...en el mundo real
  ];

  let configIndex = 0;
  TEXTS.ending.forEach((line, i) => {
    if (line !== '') {
      const config = lineConfig[configIndex];
      scene.time.delayedCall(config.delay, () => {
        const text = scene.add.text(GAME_WIDTH / 2, y, line, {
          fontSize: config.size,
          fontFamily: 'Arial',
          color: config.color,
          align: 'center',
          fontStyle: config.bold ? 'bold' : 'normal'
        }).setOrigin(0.5).setAlpha(0).setDepth(1001);
        
        scene.tweens.add({ 
          targets: text, 
          alpha: 1, 
          duration: 1000,
          ease: 'Power2'
        });
        
        y += config.spacing;
      });
      configIndex++;
    }
  });

  // Música emotiva
  playTone(scene, 440, 0.2);
  scene.time.delayedCall(500, () => playTone(scene, 554, 0.2));
  scene.time.delayedCall(1000, () => playTone(scene, 659, 0.3));
}


// =============================================================================
// EL HACEDOR - Platanus Hack 25
// Un juego sobre proteger tu Idea a través del caos
// =============================================================================

// =============================================================================
// PHASER
// =============================================================================
const config = {
  type: Phaser.AUTO,
  width: GAME_WIDTH,
  height: GAME_HEIGHT,
  backgroundColor: '#000000',
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0 },
      debug: false
    }
  },
  scene: {
    preload: preload,
    create: create,
    update: update
  }
};

const game = new Phaser.Game(config);


