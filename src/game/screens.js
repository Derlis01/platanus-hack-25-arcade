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
