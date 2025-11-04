// =============================================================================
// PHASER LIFECYCLE FUNCTIONS
// =============================================================================
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

    gameState.exitCircle = scene.add.circle(level.exit.x, level.exit.y, 50, 0x00ff00, 0.3);
    gameState.exitBorder = scene.add.circle(level.exit.x, level.exit.y, 50);
    gameState.exitBorder.setStrokeStyle(3, 0x00ff00);

    // Agregar nombre a la meta según el nivel
    const exitNames = {
      0: 'Lanza tu Idea',
      1: 'Comercializa',
      2: 'Impacta Mundo'
    };
    const exitText = scene.add.text(level.exit.x, level.exit.y - 70, exitNames[levelIndex] || 'Objetivo', {
      fontSize: '12px',
      fill: '#00ff00',
      fontFamily: 'monospace',
      fontStyle: 'bold',
      backgroundColor: '#000000',
      padding: { x: 5, y: 3 }
    }).setOrigin(0.5);
    gameState.exitText = exitText;
    scene.tweens.add({
      targets: [gameState.exitCircle, gameState.exitBorder],
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

  if (gameState.exitCircle) {
    gameState.exitCircle.destroy();
    gameState.exitCircle = null;
  }
  if (gameState.exitBorder) {
    gameState.exitBorder.destroy();
    gameState.exitBorder = null;
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
