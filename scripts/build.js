#!/usr/bin/env node

/**
 * Build Script - Combines modular source files into a single game.js
 *
 * This script reads all source files from src/ directory in the correct order
 * and combines them into a single game.js file for the Platanus Hack challenge.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define the order of file concatenation
const FILE_ORDER = [
  // Config files
  'src/config/constants.js',
  'src/config/controls.js',
  'src/config/texts.js',

  // Levels
  'src/config/levels/level-0-garage.js',
  'src/config/levels/level-1-factory.js',
  'src/config/levels/level-2-market.js',

  // Systems
  'src/systems/PathRecorder.js',
  'src/systems/FocusSystem.js',

  // Entities
  'src/entities/Founder.js',
  'src/entities/Idea.js',

  // Enemies
  'src/enemies/Enemy.js',
  'src/enemies/Magnet.js',
  'src/enemies/Shadow.js',
  'src/enemies/Bug.js',
  'src/enemies/Eye.js',
  'src/enemies/Cannon.js',
  'src/enemies/Bubble.js',

  // Game logic
  'src/game/state.js',
  'src/game/lifecycle.js',
  'src/game/screens.js',

  // Main entry point
  'src/main.js'
];

const OUTPUT_FILE = 'game.js';
const ROOT_DIR = path.join(__dirname, '..');

console.log('🎮 Building game.js from modular sources...\n');

try {
  let combinedContent = '';

  // Read and combine all files
  FILE_ORDER.forEach((filePath, index) => {
    const fullPath = path.join(ROOT_DIR, filePath);

    if (!fs.existsSync(fullPath)) {
      console.error(`❌ Error: File not found: ${filePath}`);
      process.exit(1);
    }

    console.log(`   [${index + 1}/${FILE_ORDER.length}] Reading ${filePath}`);
    const content = fs.readFileSync(fullPath, 'utf8');

    // Add content with a newline separator
    combinedContent += content + '\n\n';
  });

  // Write the combined content to game.js
  const outputPath = path.join(ROOT_DIR, OUTPUT_FILE);
  fs.writeFileSync(outputPath, combinedContent, 'utf8');

  const sizeKB = (fs.statSync(outputPath).size / 1024).toFixed(2);

  console.log('\n✅ Build successful!');
  console.log(`📦 Output: ${OUTPUT_FILE}`);
  console.log(`📊 Size: ${sizeKB} KB (before minification)\n`);
  console.log('💡 Run "pnpm check-restrictions" to verify constraints');

} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}
