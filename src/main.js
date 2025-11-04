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
