// =============================================================================
// FocusSystem
// =============================================================================
class FocusSystem {
  constructor(scene) {
    this.scene = scene;
    this.focus = 100;
    this.maxFocus = 100;
    this.isShaking = false;
    this.createUI();
  }

  createUI() {
    this.barBg = this.scene.add.rectangle(GAME_WIDTH / 2, 30, 300, 24, 0x0a0a1a);
    this.barBg.setAlpha(0.8);
    this.bar = this.scene.add.rectangle(GAME_WIDTH / 2 - 148, 30, 296, 20, NEON.CYAN);
    this.bar.setOrigin(0, 0.5);
    this.barBorder = this.scene.add.rectangle(GAME_WIDTH / 2, 30, 300, 24);
    this.barBorder.setStrokeStyle(3, NEON.CYAN);
    this.label = this.scene.add.text(GAME_WIDTH / 2, 30, 'FOCO', {
      fontSize: '14px',
      fontFamily: 'Arial',
      color: '#00ffff',
      fontStyle: 'bold'
    }).setOrigin(0.5);
  }

  update(founder, idea, delta) {
    if (!founder || !founder.sprite || !idea || !idea.sprite) return;

    const dist = Phaser.Math.Distance.Between(
      founder.sprite.x, founder.sprite.y,
      idea.sprite.x, idea.sprite.y
    );

    if (dist > MAX_DISTANCE) {
      this.drain(DISTANCE_DRAIN_RATE * delta / 16);
      if (!this.isShaking) this.startShake();
    } else if (this.isShaking) {
      this.stopShake();
    }

    const width = (this.focus / this.maxFocus) * 296;
    this.bar.width = width;

    if (this.focus < 30) {
      this.bar.fillColor = NEON.RED;
      this.barBorder.setStrokeStyle(3, NEON.RED);
    } else if (this.focus < 60) {
      this.bar.fillColor = NEON.ORANGE;
      this.barBorder.setStrokeStyle(3, NEON.ORANGE);
    } else {
      this.bar.fillColor = NEON.CYAN;
      this.barBorder.setStrokeStyle(3, NEON.CYAN);
    }
  }

  drain(amount) {
    this.focus = Math.max(0, this.focus - amount);
    if (this.focus === 0 && gameState.currentState === GAME_STATE.PLAYING) {
      changeGameState(GAME_STATE.GAMEOVER);
    }
  }

  damage(amount) {
    this.drain(amount);
    this.showDamageText(amount);
    this.flashBar();
  }

  heal(amount) {
    this.focus = Math.min(this.maxFocus, this.focus + amount);
    this.showHealText(amount);
    this.flashBarGreen();
  }

  showDamageText(amount) {
    const txt = this.scene.add.text(GAME_WIDTH / 2, 60, `-${Math.floor(amount)}`, {
      fontSize: '24px',
      fontFamily: 'Arial',
      color: '#ff0000',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    this.scene.tweens.add({
      targets: txt,
      y: txt.y - 40,
      alpha: 0,
      duration: 800,
      onComplete: () => txt.destroy()
    });
  }

  showHealText(amount) {
    const txt = this.scene.add.text(GAME_WIDTH / 2, 60, `+${Math.floor(amount)}`, {
      fontSize: '24px',
      fontFamily: 'Arial',
      color: '#00ff00',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    this.scene.tweens.add({
      targets: txt,
      y: txt.y - 40,
      alpha: 0,
      duration: 800,
      onComplete: () => txt.destroy()
    });
  }

  flashBar() {
    this.scene.tweens.add({
      targets: this.bar,
      alpha: 0.3,
      duration: 100,
      yoyo: true,
      repeat: 2
    });
  }

  flashBarGreen() {
    const originalColor = this.bar.fillColor;
    this.bar.setFillStyle(0x00ff00);
    this.scene.tweens.add({
      targets: this.bar,
      alpha: 0.3,
      duration: 100,
      yoyo: true,
      repeat: 2,
      onComplete: () => {
        this.bar.setFillStyle(originalColor);
        this.bar.alpha = 1;
      }
    });
  }

  startShake() {
    this.isShaking = true;
    this.scene.cameras.main.shake(100000, 0.003, false);
    playTone(this.scene, 440, 0.1);
  }

  stopShake() {
    if (!this.isShaking) return;
    this.isShaking = false;
    this.scene.cameras.main.resetFX();
  }

  destroy() {
    if (this.isShaking) this.stopShake();
    if (this.barBg) this.barBg.destroy();
    if (this.bar) this.bar.destroy();
    if (this.barBorder) this.barBorder.destroy();
    if (this.label) this.label.destroy();
  }
}
