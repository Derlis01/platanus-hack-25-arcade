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
