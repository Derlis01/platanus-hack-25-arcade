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
