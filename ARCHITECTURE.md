# 🎮 Vestigium - Architecture Documentation

## 📋 Overview
This game is built using a **modular architecture** during development but compiles to a **single file** (`game.js`) for submission. This approach allows for:

- ✅ Easy iteration on specific game components
- ✅ Reduced token usage when making changes with LLMs
- ✅ Clean separation of concerns
- ✅ Simple build process to combine everything

---

## 🏗️ Project Structure

```
platanus-hack-25-arcade/
├── src/                          # Source code (modular)
│   ├── config/                   # Configuration files
│   │   ├── constants.js         # Game constants (GAME_WIDTH, GRAVITY, speeds, etc.)
│   │   ├── controls.js          # Arcade controls mapping
│   │   ├── texts.js             # All game text content
│   │   └── levels/              # Level definitions (one file per level)
│   │       ├── level-0-garage.js
│   │       ├── level-1-factory.js
│   │       └── level-2-market.js
│   │
│   ├── systems/                 # Game systems
│   │   ├── PathRecorder.js     # Records player path for idea follower
│   │   └── FocusSystem.js      # Focus bar UI and management
│   │
│   ├── entities/                # Player and game entities
│   │   ├── Founder.js          # Player character
│   │   └── Idea.js             # The idea that follows the player
│   │
│   ├── enemies/                 # All enemy types
│   │   ├── Enemy.js            # Base enemy class + factory function
│   │   ├── Magnet.js           # Procrastinación (couch/magnet)
│   │   ├── Shadow.js           # Síndrome del Impostor (freezes on idle)
│   │   ├── Bug.js              # Patrol enemy
│   │   ├── Eye.js              # Rotating freeze eye
│   │   ├── Cannon.js           # Shoots at idea
│   │   └── Bubble.js           # Bouncing obstacle
│   │
│   ├── game/                    # Core game logic
│   │   ├── state.js            # Global game state management
│   │   ├── lifecycle.js        # Phaser lifecycle (preload, create, update)
│   │   └── screens.js          # UI screens (intro, level intro, game over, ending)
│   │
│   └── main.js                  # Phaser config and game initialization
│
├── scripts/
│   └── build.js                 # Build script to combine all src/ files
│
├── game.js                      # 🎯 OUTPUT: Combined game file (auto-generated)
├── metadata.json                # Game metadata
├── cover.png                    # Game cover image
└── ARCHITECTURE.md              # This file

```

---

## 🔧 Development Workflow

### Making Changes

1. **Edit source files** in `src/` directory
   - Modify specific levels: `src/config/levels/level-X-name.js`
   - Modify enemies: `src/enemies/EnemyType.js`
   - Modify game behavior: `src/game/lifecycle.js` or `src/systems/`

2. **Build the game**
   ```bash
   pnpm build
   ```
   This combines all `src/` files into `game.js` in the correct order.

3. **Check restrictions**
   ```bash
   pnpm check-restrictions
   ```
   Or use the combo command:
   ```bash
   pnpm check
   ```
   This builds and checks restrictions in one step.

4. **Test in browser**
   ```bash
   pnpm dev
   ```
   Opens dev server at `http://localhost:5173`

---

## 📦 Build System

The build script ([scripts/build.js](scripts/build.js)) combines files in this order:

1. **Configuration** - Constants, controls, texts, levels
2. **Systems** - PathRecorder, FocusSystem
3. **Entities** - Founder, Idea
4. **Enemies** - Base class + all enemy types
5. **Game Logic** - State, lifecycle, screens
6. **Main** - Phaser initialization

**Important:** The build order matters! Dependencies must be loaded before they're used.

---

## 🎯 Common Modifications

### Modify a Level

**File:** `src/config/levels/level-X-name.js`

Each level file contains:
- `platforms[]` - Platform positions and sizes
- `enemies[]` - Enemy configurations
- `start` - Player starting position
- `exit` - Level exit position
- `bg` - Background color
- `ideaStage` - Idea appearance (0=spark, 1=prototype, 2=product)

**Example:**
```javascript
const LEVEL_0_GARAGE = {
  id: 0,
  name: "El Garaje",
  bg: 0x1a1a2e,
  ideaStage: 0,
  platforms: [
    { x: 0, y: 560, w: 800, h: 40 },
    // Add more platforms...
  ],
  enemies: [
    { type: 'magnet', x: 300, y: 510, w: 60, h: 60 },
    // Add more enemies...
  ],
  start: { x: 50, y: 500 },
  exit: { x: 720, y: 130 }
};
```

### Modify an Enemy

**Files:** `src/enemies/EnemyType.js`

Each enemy class has:
- `constructor(scene, config)` - Setup
- `update(delta)` - Per-frame behavior
- `checkCollision(founder, idea, focusSystem)` - Collision logic
- `destroy()` - Cleanup

**Example: Modify Magnet (Sofa)**
```javascript
// Make the idea stick to the magnet
checkCollision(founder, idea, focusSystem) {
  // Add your custom behavior here
}
```

### Add a New Enemy Type

1. Create `src/enemies/NewEnemy.js`
2. Extend the `Enemy` base class
3. Add to `createEnemy()` factory in `src/enemies/Enemy.js`
4. Add to build order in `scripts/build.js`
5. Run `pnpm build`

### Modify Game Constants

**File:** `src/config/constants.js`

Change physics, speeds, distances, etc.:
```javascript
const PLAYER_SPEED = 180;      // Player movement speed
const JUMP_VELOCITY = -400;    // Jump strength
const MAX_DISTANCE = 250;      // Max distance before focus drains
const DISTANCE_DRAIN_RATE = 0.18; // Focus drain rate
```

### Modify Controls

**File:** `src/config/controls.js`

Map keyboard keys to arcade controls:
```javascript
const ARCADE_CONTROLS = {
  'P1U': ['w'],           // Player 1 Up
  'P1L': ['a'],           // Player 1 Left
  'P1R': ['d'],           // Player 1 Right
  'P1A': ['u'],           // Player 1 Action A (jump)
  // ...
};
```

### Modify Game Text

**File:** `src/config/texts.js`

All game text content (intro, levels, ending):
```javascript
const TEXTS = {
  intro: {
    title: "Vestigium",
    subtitle: "...",
    start: "[Presiona para empezar]"
  },
  levels: [
    { day: "DÍA 1: EL GARAJE", text: "...", ideaName: "La Chispa" },
    // ...
  ],
  ending: [
    "Llegaste.",
    // ...
  ]
};
```

---

## 🧩 Key Systems Explained

### PathRecorder (`src/systems/PathRecorder.js`)

Records the player's position history so the idea can follow with a delay.

- Maintains a circular buffer of positions
- Samples every few frames (controlled by `PATH_SAMPLE_RATE`)
- Provides delayed position for the idea to follow

### FocusSystem (`src/systems/FocusSystem.js`)

Manages the focus bar and game over condition.

- Drains focus when player and idea are too far apart
- Handles damage from enemies
- Shows visual feedback (shake, color changes)
- Triggers game over when focus reaches 0

### Founder (`src/entities/Founder.js`)

The player character.

- Physics-based movement (gravity, jumping, collisions)
- Procedurally drawn rectangle with border
- Responds to keyboard/arcade controls

### Idea (`src/entities/Idea.js`)

The idea that follows the player.

- Follows delayed position from PathRecorder
- Appearance changes per level stage (spark → prototype → product)
- No physics, smoothly interpolates position

---

## 🚀 Tips for LLMs

When asked to modify the game:

1. **Identify the relevant file(s)** using the structure above
2. **Read only those specific files** - don't read the entire `game.js`
3. **Make targeted changes** to source files in `src/`
4. **Test with `pnpm build && pnpm check-restrictions`**
5. **Avoid modifying `game.js` directly** - it's auto-generated

### Example Workflow for LLM

**User:** "Make the sofa trap the idea when it gets close"

**LLM Should:**
1. Identify file: `src/enemies/Magnet.js`
2. Read that file only
3. Modify `checkCollision()` method
4. Build: `pnpm build`
5. Check: `pnpm check-restrictions`

**LLM Should NOT:**
1. Read the entire `game.js`
2. Modify `game.js` directly
3. Create new files without updating build script

---

## 📝 Final Submission

When the game is complete:

1. Run `pnpm build` one final time
2. Verify with `pnpm check-restrictions`
3. Test with `pnpm dev`
4. Submit these files:
   - `game.js` (auto-generated from build)
   - `metadata.json`
   - `cover.png`
   - `index.html` (if modified)

The `src/` directory is for development only and won't be submitted.

---

## 🎨 Game Design Notes

The game is a metaphor for a founder's journey:

- **Level 0 (Garage):** Birth of an idea
  - Enemy: Procrastination (magnetic sofa)
  - Enemy: Imposter syndrome (freezes on idle)

- **Level 1 (Factory):** Building the prototype
  - Enemies: Bugs (code errors)
  - Enemy: Scrutiny (rotating eye)

- **Level 2 (Market):** Launching the product
  - Enemies: Critics (cannons shooting at idea)
  - Enemies: Distractions (bouncing bubbles)

**Core Mechanic:** Keep the idea close to maintain focus. Lose focus → game over.

---

## 🛠️ NPM Scripts Reference

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start development server |
| `pnpm build` | Build game.js from src/ |
| `pnpm check-restrictions` | Verify game meets constraints |
| `pnpm check` | Build + check (combo) |

---

## 📚 Additional Resources

- **Phaser Docs:** See `docs/phaser-quick-start.md` and `docs/phaser-api.md`
- **Project Instructions:** See `CLAUDE.md` and `AGENTS.md`
- **Restrictions:** Must be ≤50KB minified, no imports, no external URLs

---

**Happy coding! 🎮✨**
