// =============================================================================
// EL HACEDOR - Platanus Hack 25
// Un juego sobre proteger tu Idea a través del caos
// =============================================================================

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
// CONSTANTS
// =============================================================================
const GAME_WIDTH = 800;
const GAME_HEIGHT = 600;
const GRAVITY = 800;
const PLAYER_SPEED = 180;
const JUMP_VELOCITY = -400;
const PATH_SAMPLE_RATE = 3;
const PATH_DELAY_FRAMES = 30;
const MAX_DISTANCE = 250;
const DISTANCE_DRAIN_RATE = 0.18;

const GAME_STATE = {
  INTRO: 'INTRO',
  LEVEL_INTRO: 'LEVEL_INTRO',
  PLAYING: 'PLAYING',
  GAMEOVER: 'GAMEOVER',
  LEVEL_COMPLETE: 'LEVEL_COMPLETE',
  ENDING: 'ENDING'
};

// =============================================================================
// DATA
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
    "Llegaste.",
    "Protegiste la Chispa.",
    "Guiaste el Prototipo.",
    "Defendiste el Producto.",
    "",
    "Felicidades, Fundador.",
    "Has completado la simulación.",
    "",
    "Ahora, el desafío real.",
    "",
    "PLATANUS HACK '25",
    "NOS VEMOS EN EL MUNDO REAL."
  ]
};

const LEVELS = [
  {
    id: 0,
    name: "El Garaje",
    bg: 0x1a1a2e,
    ideaStage: 0,
    platforms: [
      { x: 0, y: 560, w: 800, h: 40 },
      { x: 120, y: 480, w: 120, h: 20 },
      { x: 280, y: 400, w: 120, h: 20 },
      { x: 450, y: 320, w: 130, h: 20 },
      { x: 600, y: 240, w: 150, h: 20 },
      { x: 680, y: 160, w: 120, h: 20 }
    ],
    enemies: [
      { type: 'magnet', x: 300, y: 510, w: 60, h: 60, name: 'Procrastinación' },
      { type: 'shadow', x: 0, y: 0, name: 'Síndrome del Impostor' }
    ],
    start: { x: 50, y: 500 },
    exit: { x: 720, y: 130 }
  },
  {
    id: 1,
    name: "La Fábrica",
    bg: 0x2a2a4e,
    ideaStage: 1,
    platforms: [
      { x: 0, y: 560, w: 200, h: 40 },
      { x: 300, y: 480, w: 150, h: 20 },
      { x: 500, y: 380, w: 100, h: 20 },
      { x: 200, y: 280, w: 150, h: 20, falling: true },
      { x: 400, y: 180, w: 150, h: 20 },
      { x: 600, y: 120, w: 180, h: 20 }
    ],
    enemies: [
      { type: 'bug', x: 300, y: 460, patrol: [300, 430] },
      { type: 'eye', x: 400, y: 300, rotSpeed: 1.5 },
      { type: 'bug', x: 600, y: 100, patrol: [600, 750] }
    ],
    start: { x: 50, y: 500 },
    exit: { x: 700, y: 80 }
  },
  {
    id: 2,
    name: "El Mercado",
    bg: 0x4a2a4e,
    ideaStage: 2,
    platforms: [
      { x: 0, y: 560, w: 800, h: 40 },
      { x: 100, y: 450, w: 100, h: 80 },
      { x: 400, y: 450, w: 100, h: 80 },
      { x: 600, y: 450, w: 100, h: 80 }
    ],
    enemies: [
      { type: 'cannon', x: 50, y: 50, targetIdea: true },
      { type: 'cannon', x: 750, y: 50, targetIdea: true },
      { type: 'cannon', x: 400, y: 0, targetIdea: true },
      { type: 'bubble', x: 200, y: 300, bouncing: true },
      { type: 'bubble', x: 600, y: 300, bouncing: true }
    ],
    start: { x: 400, y: 500 },
    exit: { x: 400, y: 100 }
  }
];

// =============================================================================
// GLOBAL STATE
// =============================================================================
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
  currentScene: null
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

  flashBar() {
    this.scene.tweens.add({
      targets: this.bar,
      alpha: 0.3,
      duration: 100,
      yoyo: true,
      repeat: 2
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
    this.graphics.fillStyle(0xff6b35, 1);
    this.graphics.fillRect(x - 10, y - 15, 20, 30);
    this.graphics.lineStyle(2, 0xffffff, 1);
    this.graphics.strokeRect(x - 10, y - 15, 20, 30);
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
  constructor(scene, x, y, stage) {
    this.scene = scene;
    this.stage = stage;
    this.sprite = scene.physics.add.sprite(x, y, null);
    this.sprite.setSize(16, 16);
    this.sprite.setGravityY(0);
    this.graphics = scene.add.graphics();
    this.particleTimer = 0;

    this.nameText = scene.add.text(x, y - 30, 'Idea', {
      fontSize: '12px',
      fontFamily: 'Arial',
      color: '#ffff00',
      fontStyle: 'bold'
    }).setOrigin(0.5);
  }

  update(delta, targetPos) {
    const dx = targetPos.x - this.sprite.x;
    const dy = targetPos.y - this.sprite.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist > 1) {
      const speed = 5;
      this.sprite.x += (dx / dist) * speed;
      this.sprite.y += (dy / dist) * speed;
    }

    this.particleTimer += delta;
    this.draw();
    this.nameText.setPosition(this.sprite.x, this.sprite.y - 30);
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

// =============================================================================
// Enemies
// =============================================================================
class Enemy {
  constructor(scene, config) {
    this.scene = scene;
    this.config = config;
    this.type = config.type;
    this.graphics = scene.add.graphics();
  }
  update(delta) {}
  checkCollision(founder, idea, focusSystem) {}
  destroy() {
    if (this.graphics) this.graphics.destroy();
    if (this.sprite) this.sprite.destroy();
  }
}

class Magnet extends Enemy {
  constructor(scene, config) {
    super(scene, config);
    this.x = config.x;
    this.y = config.y;
    this.w = config.w || 80;
    this.h = config.h || 80;
    this.radius = 120;
    this.pulseTimer = 0;
  }

  update(delta) {
    this.pulseTimer += delta;
    this.graphics.clear();
    this.graphics.fillStyle(0x663366, 1);
    this.graphics.fillRect(this.x, this.y, this.w, this.h);
    const pulse = Math.sin(this.pulseTimer * 0.003) * 0.3 + 0.7;
    this.graphics.fillStyle(0x9966cc, 0.2 * pulse);
    this.graphics.fillCircle(this.x + this.w/2, this.y + this.h/2, this.radius);
  }

  checkCollision(founder, idea, focusSystem) {
    if (founder && founder.sprite && founder.sprite.body) {
      const fdist = Phaser.Math.Distance.Between(
        founder.sprite.x, founder.sprite.y,
        this.x + this.w/2, this.y + this.h/2
      );
      if (fdist < this.radius) {
        const dx = this.x + this.w/2 - founder.sprite.x;
        const dy = this.y + this.h/2 - founder.sprite.y;
        const force = Math.max(0, 1 - fdist / this.radius) * 3;
        founder.sprite.setVelocityX(founder.sprite.body.velocity.x + dx * force);
        founder.sprite.setVelocityY(founder.sprite.body.velocity.y + dy * force);
      }
    }
  }
}

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

class Eye extends Enemy {
  constructor(scene, config) {
    super(scene, config);
    this.x = config.x;
    this.y = config.y;
    this.angle = 0;
    this.rotSpeed = config.rotSpeed || 1;
    this.range = 150;
    this.freezeTimer = 0;
  }

  update(delta) {
    this.angle += this.rotSpeed * delta * 0.001;
    if (this.freezeTimer > 0) this.freezeTimer -= delta;

    this.graphics.clear();
    this.graphics.fillStyle(0x666666, 1);
    this.graphics.fillCircle(this.x, this.y, 15);
    this.graphics.fillStyle(0xff0000, 1);
    const px = this.x + Math.cos(this.angle) * 5;
    const py = this.y + Math.sin(this.angle) * 5;
    this.graphics.fillCircle(px, py, 5);
    this.graphics.lineStyle(2, this.freezeTimer > 0 ? 0xff0000 : 0x00ffff, 0.5);
    this.graphics.lineBetween(this.x, this.y, this.x + Math.cos(this.angle) * this.range, this.y + Math.sin(this.angle) * this.range);
  }

  checkCollision(founder, idea, focusSystem) {
    if (!founder || !founder.sprite || !founder.sprite.body) return;
    if (this.freezeTimer > 0) {
      founder.sprite.setVelocityX(0);
      founder.sprite.setVelocityY(0);
      return;
    }
    const fx = founder.sprite.x - this.x;
    const fy = founder.sprite.y - this.y;
    const fdist = Math.sqrt(fx*fx + fy*fy);
    const fangle = Math.atan2(fy, fx);
    const angleDiff = Math.abs(((fangle - this.angle + Math.PI) % (2*Math.PI)) - Math.PI);
    if (fdist < this.range && angleDiff < 0.2) {
      this.freezeTimer = 3000;
      playTone(this.scene, 800, 0.2);
    }
  }
}

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

function createEnemy(scene, config) {
  switch (config.type) {
    case 'magnet': return new Magnet(scene, config);
    case 'shadow': return new Shadow(scene, config);
    case 'bug': return new Bug(scene, config);
    case 'eye': return new Eye(scene, config);
    case 'cannon': return new Cannon(scene, config);
    case 'bubble': return new Bubble(scene, config);
    default: return null;
  }
}

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

function preload() {}

function create() {
  gameState.currentScene = this;
  showIntroScreen(this);
}

function update(time, delta) {
  if (gameState.currentState !== GAME_STATE.PLAYING) return;
  if (!gameState.founder || !gameState.founder.sprite || !gameState.founder.sprite.body) return;
  if (!gameState.idea || !gameState.idea.sprite) return;
  if (!gameState.pathRecorder || !gameState.focusSystem) return;

  gameState.pathRecorder.record(gameState.founder.sprite.x, gameState.founder.sprite.y);
  const targetPos = gameState.pathRecorder.getDelayedPosition();
  gameState.idea.update(delta, targetPos);
  gameState.focusSystem.update(gameState.founder, gameState.idea, delta);
  gameState.founder.update();

  gameState.enemies.forEach(enemy => {
    if (enemy.type === 'shadow') enemy.update(delta, gameState.founder);
    else if (enemy.type === 'cannon') enemy.update(delta, gameState.idea);
    else if (enemy.type === 'bubble') enemy.update(delta, gameState.idea);
    else enemy.update(delta);
    enemy.checkCollision(gameState.founder, gameState.idea, gameState.focusSystem);
  });

  handleInput(this, delta);
  checkLevelComplete(this);
}

// =============================================================================
// GAME FUNCTIONS
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
    gameState.idea = new Idea(scene, level.start.x, level.start.y, level.ideaStage);
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

    const exitCircle = scene.add.circle(level.exit.x, level.exit.y, 50, 0x00ff00, 0.3);
    const exitBorder = scene.add.circle(level.exit.x, level.exit.y, 50);
    exitBorder.setStrokeStyle(3, 0x00ff00);
    scene.tweens.add({
      targets: [exitCircle, exitBorder],
      scale: { from: 1, to: 1.2 },
      alpha: { from: 0.5, to: 0.8 },
      duration: 1000,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });

    playTone(scene, 440, 0.1);
  });
}

function cleanupLevel(scene) {
  scene.cameras.main.stopFollow();
  scene.cameras.main.resetFX();
  scene.tweens.killAll();
  scene.time.removeAllEvents();

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
    startLevel(scene, 0);
  });
}

function showEnding(scene) {
  cleanupLevel(scene);
  scene.cameras.main.setBackgroundColor(0x000000);

  let y = 150;
  TEXTS.ending.forEach((line, i) => {
    scene.time.delayedCall(i * 1000, () => {
      const text = scene.add.text(GAME_WIDTH / 2, y, line, {
        fontSize: line.length < 20 ? '32px' : '24px',
        fontFamily: 'Arial',
        color: line.includes('PLATANUS') ? '#ff6b35' : '#ffffff',
        align: 'center',
        fontStyle: line.includes('PLATANUS') ? 'bold' : 'normal'
      }).setOrigin(0.5).setAlpha(0);
      scene.tweens.add({ targets: text, alpha: 1, duration: 500 });
      if (line !== '') y += 40;
    });
  });

  playTone(scene, 440, 0.2);
  scene.time.delayedCall(500, () => playTone(scene, 554, 0.2));
  scene.time.delayedCall(1000, () => playTone(scene, 659, 0.3));
}

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
