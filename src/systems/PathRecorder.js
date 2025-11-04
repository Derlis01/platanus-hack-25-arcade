// =============================================================================
// PathRecorder
// =============================================================================
class PathRecorder {
  constructor() {
    this.path = new Array(PATH_DELAY_FRAMES);
    this.head = 0;
    this.frameCount = 0;
    for (let i = 0; i < PATH_DELAY_FRAMES; i++) {
      this.path[i] = { x: 0, y: 0 };
    }
  }

  record(x, y) {
    this.frameCount++;
    if (this.frameCount % PATH_SAMPLE_RATE === 0) {
      this.path[this.head] = { x, y };
      this.head = (this.head + 1) % PATH_DELAY_FRAMES;
    }
  }

  getDelayedPosition() {
    return { ...this.path[this.head] };
  }

  reset(x, y) {
    for (let i = 0; i < PATH_DELAY_FRAMES; i++) {
      this.path[i] = { x, y };
    }
    this.head = 0;
    this.frameCount = 0;
  }
}
