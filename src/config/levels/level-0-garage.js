// =============================================================================
// LEVEL 0: EL GARAJE
// =============================================================================
const LEVEL_0_GARAGE = {
  id: 0,
  name: "El Garaje",
  bg: 0x0a0a1a,
  ideaStage: 0,
  platforms: [
    // Base (piso principal)
    { x: 0, y: 560, w: 800, h: 40 },

    // ZONA 1: Salida inicial - Plataformas pequeñas para ganar altura
    { x: 40, y: 490, w: 80, h: 18 },      // Plat 1: Pequeña, requiere precisión
    { x: 130, y: 450, w: 70, h: 18 },     // Plat 2: Más pequeña, brecha más grande
    { x: 210, y: 410, w: 90, h: 18 },     // Plat 3: Un poco más ancha para respiro

    // ZONA 2: Área del primer sofá - Movimiento lateral con peligro
    { x: 310, y: 360, w: 60, h: 18 },     // Plat 4: Estrecha, junto al sofá
    { x: 390, y: 330, w: 80, h: 18 },     // Plat 5: Salto diagonal para evitar sofá
    { x: 480, y: 310, w: 75, h: 18 },     // Plat 6: Aterrizaje preciso

    // ZONA 3: Subida rápida - Plataformas más generosas
    { x: 540, y: 270, w: 100, h: 18 },    // Plat 7: Más ancha para estabilidad
    { x: 620, y: 230, w: 90, h: 18 },     // Plat 8: Diagonal pero amplia
    { x: 580, y: 190, w: 95, h: 18 },     // Plat 9: Buena zona de aterrizaje

    // ZONA 4: Recta final hacia la salida (SIMPLIFICADA)
    { x: 650, y: 150, w: 100, h: 18 },    // Plat 10: Plataforma ancha para respirar
    { x: 700, y: 110, w: 100, h: 50 }     // Plat 11: Salida generosa y fácil
  ],
  enemies: [
    // Sofá #1: "Procrastinación" - Posicionado estratégicamente en zona 2
    // Fuerza al jugador a saltar con precisión para evitarlo
    { type: 'magnet', x: 300, y: 380, w: 60, h: 50, name: 'Procrastinaciones' },

    // Sofá #2: "Distracción" - En la zona 3, crea peligro en la subida rápida
    // Requiere planificación de ruta
    { type: 'magnet', x: 600, y: 270, w: 55, h: 50, name: 'Distracciones' }
  ],
  start: { x: 50, y: 500 },
  exit: { x: 750, y: 80 }
};
