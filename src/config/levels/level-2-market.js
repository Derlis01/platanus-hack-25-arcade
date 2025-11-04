// =============================================================================
// LEVEL 2: EL MERCADO
// =============================================================================
const LEVEL_2_MARKET = {
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
};
