// =============================================================================
// LEVEL 1: LA FÁBRICA
// =============================================================================
// Tema: Diseño en "U" - DEBES subir por la izquierda, cruzar arriba, y bajar
const LEVEL_1_FACTORY = {
  id: 1,
  name: "La Fábrica",
  bg: 0x2a2a4e,
  ideaStage: 1,
  platforms: [
    // Piso principal
    { x: 0, y: 560, w: 800, h: 40 },

    // === LADO IZQUIERDO: ASCENSO (con Bugs) ===
    { x: 0, y: 500, w: 120, h: 20 },       // Base inicio
    { x: 40, y: 450, w: 100, h: 20 },      // Escalón 1
    { x: 80, y: 400, w: 100, h: 20 },      // Escalón 2 - Bug #1
    { x: 40, y: 350, w: 100, h: 20 },      // Escalón 3
    { x: 80, y: 300, w: 100, h: 20 },      // Escalón 4 - Bug #2
    { x: 40, y: 250, w: 100, h: 20 },      // Escalón 5
    { x: 80, y: 200, w: 120, h: 20 },      // Tope izquierdo

    // === PASILLO SUPERIOR: CRUCE (con Escrutinio) ===
    { x: 200, y: 180, w: 150, h: 20 },     // Pasillo antes del ojo
    { x: 360, y: 160, w: 90, h: 20 },      // Plataforma BAJO el Escrutinio
    { x: 460, y: 180, w: 150, h: 20 },     // Pasillo después del ojo

    // === LADO DERECHO: DESCENSO (con más obstáculos) ===
    { x: 620, y: 200, w: 120, h: 20 },     // Tope derecho
    { x: 660, y: 250, w: 100, h: 20 },     // Escalón 1
    { x: 620, y: 300, w: 100, h: 20 },     // Escalón 2
    { x: 660, y: 350, w: 100, h: 20 },     // Escalón 3 - Bug #3
    { x: 620, y: 400, w: 100, h: 20 },     // Escalón 4
    { x: 680, y: 450, w: 120, h: 20 },     // Casi en el piso

    // === BARRERA CENTRAL: Bloquea atajos ===
    { x: 300, y: 560, w: 20, h: 180 },     // Muro vertical central (impide atajos)
  ],
  enemies: [
    // Bug #1: Patrulla en escalón 2 (izquierda)
    { type: 'bug', x: 120, y: 380, patrol: [80, 160], name: 'Complejidad' },

    // Café #1: Recuperación en escalón 3 (lado izquierdo)
    { type: 'coffee', x: 90, y: 330, name: 'Cafe' },

    // Bug #2: Patrulla en escalón 4 (izquierda)
    { type: 'bug', x: 120, y: 280, patrol: [80, 160], name: 'Deuda Tecnica' },

    // OJO LETAL #1: Vigila el pasillo izquierdo del centro (MUERTE INSTANTÁNEA)
    { type: 'eye', x: 275, y: 100, rotSpeed: 1.8, name: 'Fecha Limite' },

    // Café #2: Recuperación justo antes del segundo ojo
    { type: 'coffee', x: 405, y: 140, name: 'Cafe' },

    // OJO LETAL #2: Vigila el pasillo derecho del centro (MUERTE INSTANTÁNEA)
    { type: 'eye', x: 535, y: 100, rotSpeed: 1.5, name: 'Perfeccionismo' },

    // Bug #3: Patrulla en escalón 3 (derecha)
    { type: 'bug', x: 680, y: 330, patrol: [630, 730], name: 'Scope Creep' },

    // Café #3: Recuperación antes del final
    { type: 'coffee', x: 690, y: 280, name: 'Cafe' },

    // Síndrome del Impostor: En el piso inferior (zona de muerte si caes)
    { type: 'shadow', x: 500, y: 530, idle: 2000, name: 'Burnout' },
  ],
  start: { x: 50, y: 480 },
  exit: { x: 730, y: 430 }
};
