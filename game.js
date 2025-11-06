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
const MAX_DISTANCE = 160;
const DISTANCE_DRAIN_RATE = 1.7;

const GAME_STATE = {
  INTRO: 'INTRO',
  LEVEL_INTRO: 'LEVEL_INTRO',
  PLAYING: 'PLAYING',
  GAMEOVER: 'GAMEOVER',
  LEVEL_COMPLETE: 'LEVEL_COMPLETE',
  ENDING: 'ENDING'
};

// NEON PALETTE - Synthwave/Cyberpunk colors
const NEON = {
  CYAN: 0x00ffff,
  MAGENTA: 0xff00ff,
  YELLOW: 0xffff00,
  ORANGE: 0xff6600,
  PINK: 0xff1493,
  PURPLE: 0x9900ff,
  GREEN: 0x00ff00,
  BLUE: 0x0099ff,
  RED: 0xff0033,
  WHITE: 0xffffff
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
      day: "EL GARAJE",
      text: "Una chispa nace en la oscuridad.\nNo la dejes apagar.",
      ideaName: "La Chispa"
    },
    {
      day: "LA CONSTRUCCIÓN",
      text: "Tu prototipo toma forma.",
      ideaName: "El Prototipo"
    },
    {
      day: "EL LANZAMIENTO",
      text: "El mundo es cruel con lo nuevo.\nDefiende lo que construiste.",
      ideaName: "El Producto"
    }
  ],
  ending: [
    "Victoria.",
    "",
    "El juego terminó.",
    "",
    "Ahora continúa...",
    "",
    "en la vida real."
  ],
  gameOver: [
    {
      title: "LA CHISPA SE APAGÓ",
      message: "La duda ganó. La idea nunca comenzó."
    },
    {
      title: "PROTOTIPO FALLIDO",
      message: "Los errores fueron demasiados. Abandonaste."
    },
    {
      title: "BURNOUT",
      message: "El mundo era demasiado cruel. Te rendiste."
    }
  ]
};


// =============================================================================
// LEVEL 0: EL GARAJE
// =============================================================================
const LEVEL_0_GARAGE = {
  id: 0,
  name: "El Garaje",
  bg: 0x0a0a1a,
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
  bg: 0x1a0a2a,
  ideaStage: 1,
  platforms: [
    // Piso principal
    { x: 0, y: 560, w: 800, h: 40 },

    // === LADO IZQUIERDO: ASCENSO (simplificado) ===
    { x: 0, y: 500, w: 140, h: 20 },       // Base inicio (más ancha)
    { x: 40, y: 430, w: 120, h: 20 },      // Escalón 1 (más ancho, menos alto)
    { x: 80, y: 360, w: 180, h: 20 },      // Escalón 2 (más ancho, extendido a la derecha)
    { x: 40, y: 290, w: 120, h: 20 },      // Escalón 3 (más ancho)
    { x: 80, y: 220, w: 140, h: 20 },      // Tope izquierdo (más ancho, menos escalones)

    // === PASILLO SUPERIOR: CRUCE (simplificado) ===
    { x: 220, y: 180, w: 180, h: 20 },     // Pasillo antes del ojo (más ancho y bajo)
    { x: 410, y: 180, w: 180, h: 20 },     // Pasillo después del ojo (más ancho, sin desnivel)

    // === LADO DERECHO: DESCENSO (simplificado) ===
    { x: 600, y: 240, w: 140, h: 20 },     // Tope derecho (más ancho)
    { x: 640, y: 330, w: 120, h: 20 },     // Escalón 1 (más ancho, menos escalones)
    { x: 600, y: 420, w: 140, h: 20 },     // Escalón 2 (más ancho)
    { x: 660, y: 500, w: 140, h: 20 },     // Casi en el piso (más ancho)

    // === BARRERA CENTRAL: Bloquea atajos ===
    { x: 300, y: 560, w: 20, h: 200 },     // Muro vertical central más alto
  ],
  enemies: [
    // Bug #1: Patrulla en escalón 2 (izquierda) - más lento, recorre toda la plataforma
    { type: 'bug', x: 120, y: 340, patrol: [90, 240], name: 'Complejidad' },

    // Café #1: Recuperación en escalón 3 (lado izquierdo)
    { type: 'coffee', x: 90, y: 270, name: 'Cafe' },

    // OJO LETAL: Vigila el pasillo central (más lento)
    { type: 'eye', x: 400, y: 100, rotSpeed: 1.2, name: 'Fecha Limite' },

    // Café #2: Recuperación en el pasillo
    { type: 'coffee', x: 500, y: 160, name: 'Cafe' },

    // Bug #2: Patrulla en descenso derecho - más lento
    { type: 'bug', x: 650, y: 400, patrol: [600, 720], name: 'Scope Creep' },

    // Café #3: Recuperación antes del final
    { type: 'coffee', x: 700, y: 310, name: 'Cafe' },
  ],
  start: { x: 50, y: 480 },
  exit: { x: 740, y: 480 }
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
  bg: 0x0a1a1a,
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
    // { x: 350, y: 380, w: 110, h: 20 },     // Plataforma de transición
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
    { type: 'bubble', x: 150, y: 420, bouncing: true, name: 'Ruido' },
    { type: 'bubble', x: 200, y: 260, bouncing: true, name: 'Distracción' },
    { type: 'bubble', x: 120, y: 340, bouncing: true, name: 'Ruido' },

    // CAFÉ 1: Después de sobrevivir al ruido inicial
    { type: 'coffee', x: 220, y: 210 },

    // === ZONA 2: LA COMPETENCIA ===
    // Solo 2 cannons (antes 3) - menos fuego cruzado
    { type: 'cannon', x: 320, y: 10, targetIdea: true, name: 'Crítico' },
    { type: 'cannon', x: 530, y: 560, targetIdea: true, name: 'Competencia' },

    // Solo 1 eye (antes 2) - más espacio para maniobrar
    { type: 'eye', x: 430, y: 270, radius: 70, name: 'Vigilancia' },

    // CAFÉ 2: Antes de la zona final (crítico)
    { type: 'coffee', x: 520, y: 120 },

    // === ZONA 3: LA TENTACIÓN FINAL ===
    // Magnet más pequeño y alejado
    { type: 'magnet', x: 600, y: 230, w: 55, h: 55, name: 'Zona de Comfort' },

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
    this.barBg = this.scene.add.rectangle(GAME_WIDTH / 2, 30, 300, 24, 0x0a0a1a);
    this.barBg.setAlpha(0.8);
    this.bar = this.scene.add.rectangle(GAME_WIDTH / 2 - 148, 30, 296, 20, NEON.CYAN);
    this.bar.setOrigin(0, 0.5);
    this.barBorder = this.scene.add.rectangle(GAME_WIDTH / 2, 30, 300, 24);
    this.barBorder.setStrokeStyle(3, NEON.CYAN);
    this.label = this.scene.add.text(GAME_WIDTH / 2, 30, 'FOCO', {
      fontSize: '14px',
      fontFamily: 'Arial',
      color: '#00ffff',
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
      this.bar.fillColor = NEON.RED;
      this.barBorder.setStrokeStyle(3, NEON.RED);
    } else if (this.focus < 60) {
      this.bar.fillColor = NEON.ORANGE;
      this.barBorder.setStrokeStyle(3, NEON.ORANGE);
    } else {
      this.bar.fillColor = NEON.CYAN;
      this.barBorder.setStrokeStyle(3, NEON.CYAN);
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

    // Glow exterior del ojo
    this.graphics.fillStyle(NEON.PURPLE, 0.3);
    this.graphics.fillCircle(this.x, this.y, 18);

    // Cuerpo del ojo neon
    this.graphics.fillStyle(NEON.PURPLE, 0.7);
    this.graphics.fillCircle(this.x, this.y, 15);

    // Borde brillante
    this.graphics.lineStyle(2, NEON.PURPLE, 1);
    this.graphics.strokeCircle(this.x, this.y, 15);

    // Pupila que rota
    const px = this.x + Math.cos(this.angle) * 5;
    const py = this.y + Math.sin(this.angle) * 5;
    this.graphics.fillStyle(NEON.RED, 1);
    this.graphics.fillCircle(px, py, 5);
    this.graphics.fillStyle(NEON.WHITE, 0.8);
    this.graphics.fillCircle(px, py, 2);

    // Rayo de visión neon
    const rayColor = this.freezeTimer > 0 ? NEON.RED : NEON.CYAN;
    const rayAlpha = this.freezeTimer > 0 ? 1 : 0.7;
    this.graphics.lineStyle(4, rayColor, rayAlpha);
    this.graphics.lineBetween(
      this.x,
      this.y,
      this.x + Math.cos(this.angle) * this.range,
      this.y + Math.sin(this.angle) * this.range
    );

    // Glow del rayo
    this.graphics.lineStyle(2, rayColor, rayAlpha * 0.3);
    this.graphics.lineBetween(
      this.x,
      this.y,
      this.x + Math.cos(this.angle) * this.range,
      this.y + Math.sin(this.angle) * this.range
    );

    // Si está congelando, añadir círculo pulsante
    if (this.freezeTimer > 0) {
      const pulse = 1 + Math.sin(Date.now() * 0.01) * 0.3;
      this.graphics.lineStyle(3, NEON.RED, 0.8);
      this.graphics.strokeCircle(this.x, this.y, 25 * pulse);
      this.graphics.lineStyle(1, NEON.RED, 0.4);
      this.graphics.strokeCircle(this.x, this.y, 28 * pulse);
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
    this.createNameText(config.x, config.y);
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

    // Cañón con estilo neon
    this.graphics.fillStyle(NEON.RED, 0.5);
    this.graphics.fillRect(this.x - 10, this.y - 5, 20, 10);

    // Borde brillante
    this.graphics.lineStyle(2, NEON.RED, 1);
    this.graphics.strokeRect(this.x - 10, this.y - 5, 20, 10);

    // Proyectiles neon con glow
    this.projectiles.forEach(p => {
      // Glow exterior
      this.graphics.fillStyle(NEON.RED, 0.3);
      this.graphics.fillCircle(p.x, p.y, 8);
      // Proyectil brillante
      this.graphics.fillStyle(NEON.RED, 1);
      this.graphics.fillCircle(p.x, p.y, 5);
      // Centro blanco
      this.graphics.fillStyle(NEON.WHITE, 0.8);
      this.graphics.fillCircle(p.x, p.y, 2);
    });

    this.updateNamePosition(this.x, this.y);
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
    this.createNameText(config.x, config.y);
  }

  update(delta, idea) {
    this.graphics.clear();

    // Glow exterior
    this.graphics.fillStyle(NEON.PINK, 0.2);
    this.graphics.fillCircle(this.sprite.x, this.sprite.y, 16);

    // Borde neon brillante
    this.graphics.lineStyle(3, NEON.PINK, 1);
    this.graphics.strokeCircle(this.sprite.x, this.sprite.y, 12);

    // Interior translúcido
    this.graphics.fillStyle(NEON.PINK, 0.3);
    this.graphics.fillCircle(this.sprite.x, this.sprite.y, 12);

    // Reflejo brillante
    this.graphics.fillStyle(NEON.WHITE, 0.8);
    this.graphics.fillCircle(this.sprite.x - 4, this.sprite.y - 4, 3);

    this.updateNamePosition(this.sprite.x, this.sprite.y);
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
      const platform = scene.add.rectangle(p.x + p.w / 2, p.y + p.h / 2, p.w, p.h, 0x1a1a2e);
      platform.setStrokeStyle(3, NEON.MAGENTA);
      platform.setAlpha(0.6);
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
  const gameOverData = TEXTS.gameOver[gameState.currentLevel];

  const overlay = scene.add.rectangle(GAME_WIDTH / 2, GAME_HEIGHT / 2, GAME_WIDTH, GAME_HEIGHT, 0x000000, 0.85);
  overlay.setDepth(1000).setScrollFactor(0);

  const title = scene.add.text(GAME_WIDTH / 2, 250, gameOverData.title, {
    fontSize: '64px', fontFamily: 'Arial', color: '#ff0000', fontStyle: 'bold'
  }).setOrigin(0.5).setDepth(1001).setScrollFactor(0);

  const subtitle = scene.add.text(GAME_WIDTH / 2, 350, gameOverData.message, {
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

  // Limpiar cualquier texto residual
  scene.children.list.forEach(child => {
    if (child.type === 'Text' || child.type === 'Graphics' || child.type === 'Sprite') {
      child.destroy();
    }
  });

  // Pantalla negra limpia
  scene.cameras.main.setBackgroundColor(0x000000);
  const overlay = scene.add.rectangle(GAME_WIDTH / 2, GAME_HEIGHT / 2, GAME_WIDTH, GAME_HEIGHT, 0x000000);

  let y = 160;

  // Función para efecto typewriter elegante
  function typewriterEffect(scene, text, x, yPos, fontSize, delay, isFinal = false) {
    let displayedText = '';
    const textObj = scene.add.text(x, yPos, '', {
      fontSize: fontSize,
      fontFamily: 'Arial',
      color: '#ffffff',
      align: 'center'
    }).setOrigin(0.5).setDepth(1001);

    let charIndex = 0;
    scene.time.delayedCall(delay, () => {
      const charEvent = scene.time.addEvent({
        delay: 40,
        callback: () => {
          if (charIndex < text.length) {
            displayedText += text[charIndex];
            textObj.setText(displayedText);
            charIndex++;
          } else {
            charEvent.remove();
          }
        },
        loop: true
      });
    });

    return textObj;
  }

  // "Victoria." - aparece inmediatamente
  typewriterEffect(scene, 'Victoria.', GAME_WIDTH / 2, y, '48px', 0);
  y += 100;

  // "El juego terminó." - después de silencio
  typewriterEffect(scene, 'El juego terminó.', GAME_WIDTH / 2, y, '28px', 2000);
  y += 80;

  // "Ahora continúa..." - más pausa
  typewriterEffect(scene, 'Ahora continúa...', GAME_WIDTH / 2, y, '28px', 4500);
  y += 80;

  // "en la vida real." - final
  typewriterEffect(scene, 'en la vida real.', GAME_WIDTH / 2, y, '32px', 6800, true);

  // Un solo sonido elegante al final
  scene.time.delayedCall(7500, () => playTone(scene, 440, 0.1));
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


