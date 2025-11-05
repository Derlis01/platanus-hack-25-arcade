// =============================================================================
// LEVEL 2: EL MERCADO
// El nivel final - un recorrido épico a través del caos del mercado
// Zona 1: El Ruido (bubbles caóticas)
// Zona 2: La Competencia (cannons + eyes)
// Zona 3: La Tentación Final (magnet gigante + shadow)
// Plataformas ajustadas: saltos máximos de ~90px (alcanzables con JUMP_VELOCITY -400)
// Cafés estratégicos para recuperar focus en puntos críticos
// =============================================================================
const LEVEL_2_MARKET = {
  id: 2,
  name: "El Mercado",
  bg: 0x4a2a4e,
  ideaStage: 2,
  platforms: [
    // Piso base
    { x: 0, y: 560, w: 800, h: 40 },
    
    // ZONA 1: EL RUIDO (izquierda - sección inicial)
    { x: 50, y: 470, w: 120, h: 20 },      // -90px desde piso
    { x: 200, y: 390, w: 100, h: 20 },     // -80px
    { x: 80, y: 310, w: 100, h: 20 },      // -80px
    { x: 220, y: 240, w: 90, h: 20 },      // -70px
    
    // ZONA 2: LA COMPETENCIA (centro - sección media)
    { x: 350, y: 380, w: 110, h: 20 },     // Plataforma de transición
    { x: 500, y: 300, w: 100, h: 20 },     // -80px
    { x: 360, y: 220, w: 100, h: 20 },     // -80px
    { x: 500, y: 150, w: 90, h: 20 },      // -70px
    
    // ZONA 3: EL FINAL (derecha-arriba - sección final)
    { x: 630, y: 270, w: 120, h: 20 },     // Plataforma de transición
    { x: 580, y: 190, w: 100, h: 20 },     // -80px
    { x: 680, y: 110, w: 100, h: 20 }      // -80px (salida arriba)
  ],
  enemies: [
    // === ZONA 1: EL RUIDO ===
    // Solo 3 bubbles (antes 5) - menos caos
    { type: 'bubble', x: 150, y: 420, bouncing: true, name: 'Ruido' },
    { type: 'bubble', x: 200, y: 260, bouncing: true, name: 'Distracción' },
    { type: 'bubble', x: 120, y: 340, bouncing: true, name: 'Ruido' },

    // CAFÉ 1: Después de sobrevivir al ruido inicial
    { type: 'coffee', x: 220, y: 210 },

    // === ZONA 2: LA COMPETENCIA ===
    // Solo 2 cannons (antes 3) - menos fuego cruzado
    { type: 'cannon', x: 320, y: 10, targetIdea: true, name: 'Crítico' },
    { type: 'cannon', x: 530, y: 560, targetIdea: true, name: 'Competencia' },

    // Solo 1 eye (antes 2) - más espacio para maniobrar
    { type: 'eye', x: 430, y: 270, radius: 70, name: 'Vigilancia' },

    // CAFÉ 2: Antes de la zona final (crítico)
    { type: 'coffee', x: 520, y: 120 },

    // === ZONA 3: LA TENTACIÓN FINAL ===
    // Magnet más pequeño y alejado
    { type: 'magnet', x: 600, y: 230, w: 55, h: 55, name: 'Zona de Comfort' },

    // Sin shadow - una amenaza menos

    // CAFÉ 3: Recompensa antes del salto final
    { type: 'coffee', x: 630, y: 160 }
  ],
  start: { x: 50, y: 500 },
  exit: { x: 720, y: 70 } // Arriba a la derecha - ajustado para estar en plataforma
};
