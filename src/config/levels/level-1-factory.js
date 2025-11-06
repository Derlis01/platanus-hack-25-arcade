// =============================================================================
// LEVEL 1: LA FÁBRICA
// =============================================================================
// Tema: Diseño en "U" - DEBES subir por la izquierda, cruzar arriba, y bajar
const LEVEL_1_FACTORY = {
  id: 1,
  name: "La Fábrica",
  bg: 0x1a0a2a,
  ideaStage: 1,
  platforms: [
    // Piso principal
    { x: 0, y: 560, w: 800, h: 40 },

    // === LADO IZQUIERDO: ASCENSO (simplificado) ===
    { x: 0, y: 500, w: 140, h: 20 },       // Base inicio (más ancha)
    { x: 40, y: 430, w: 120, h: 20 },      // Escalón 1 (más ancho, menos alto)
    { x: 80, y: 360, w: 180, h: 20 },      // Escalón 2 (más ancho, extendido a la derecha)
    { x: 40, y: 290, w: 120, h: 20 },      // Escalón 3 (más ancho)
    { x: 80, y: 220, w: 140, h: 20 },      // Tope izquierdo (más ancho, menos escalones)

    // === PASILLO SUPERIOR: CRUCE (simplificado) ===
    { x: 220, y: 180, w: 180, h: 20 },     // Pasillo antes del ojo (más ancho y bajo)
    { x: 410, y: 180, w: 180, h: 20 },     // Pasillo después del ojo (más ancho, sin desnivel)

    // === LADO DERECHO: DESCENSO (simplificado) ===
    { x: 600, y: 240, w: 140, h: 20 },     // Tope derecho (más ancho)
    { x: 640, y: 330, w: 120, h: 20 },     // Escalón 1 (más ancho, menos escalones)
    { x: 600, y: 420, w: 140, h: 20 },     // Escalón 2 (más ancho)
    { x: 660, y: 500, w: 140, h: 20 },     // Casi en el piso (más ancho)

    // === BARRERA CENTRAL: Bloquea atajos ===
    { x: 300, y: 560, w: 20, h: 200 },     // Muro vertical central más alto
  ],
  enemies: [
    // Bug #1: Patrulla en escalón 2 (izquierda) - más lento, recorre toda la plataforma
    { type: 'bug', x: 120, y: 340, patrol: [90, 240], name: 'Complejidad' },

    // Café #1: Recuperación en escalón 3 (lado izquierdo)
    { type: 'coffee', x: 90, y: 270, name: 'Cafe' },

    // OJO LETAL: Vigila el pasillo central (más lento)
    { type: 'eye', x: 400, y: 100, rotSpeed: 1.2, name: 'Fecha Limite' },

    // Café #2: Recuperación en el pasillo
    { type: 'coffee', x: 500, y: 160, name: 'Cafe' },

    // Bug #2: Patrulla en descenso derecho - más lento
    { type: 'bug', x: 650, y: 400, patrol: [600, 720], name: 'Scope Creep' },

    // Café #3: Recuperación antes del final
    { type: 'coffee', x: 700, y: 310, name: 'Cafe' },
  ],
  start: { x: 50, y: 480 },
  exit: { x: 740, y: 480 }
};
