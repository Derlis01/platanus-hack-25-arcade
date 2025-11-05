// =============================================================================
// GLOBAL STATE
// =============================================================================
// DESARROLLO: Cambia esto para saltarte directamente a un nivel
// Valores: null (mostrar intro), 0 (Garaje), 1 (Fábrica), 2 (Mercado)
const FORCE_START_LEVEL = 1;

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
