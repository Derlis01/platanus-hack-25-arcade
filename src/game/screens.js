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
