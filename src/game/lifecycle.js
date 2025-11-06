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
