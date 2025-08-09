export class Input {
  constructor(canvas) {
    this.keysDown = new Set();
    this.mouseDown = false;
    this.mouseScreenX = 0;
    this.mouseScreenY = 0;
    this._bind(canvas);
  }

  _bind(canvas) {
    window.addEventListener('keydown', (e) => {
      this.keysDown.add(e.code);
    });
    window.addEventListener('keyup', (e) => {
      this.keysDown.delete(e.code);
    });
    canvas.addEventListener('mousedown', () => {
      this.mouseDown = true;
    });
    window.addEventListener('mouseup', () => {
      this.mouseDown = false;
    });
    canvas.addEventListener('mousemove', (e) => {
      const rect = canvas.getBoundingClientRect();
      this.mouseScreenX = (e.clientX - rect.left) * (canvas.width / rect.width);
      this.mouseScreenY = (e.clientY - rect.top) * (canvas.height / rect.height);
    });
    // prevent context menu for better feel
    canvas.addEventListener('contextmenu', (e) => e.preventDefault());
  }

  getMoveVector() {
    const up = this.keysDown.has('KeyW') || this.keysDown.has('ArrowUp');
    const down = this.keysDown.has('KeyS') || this.keysDown.has('ArrowDown');
    const left = this.keysDown.has('KeyA') || this.keysDown.has('ArrowLeft');
    const right = this.keysDown.has('KeyD') || this.keysDown.has('ArrowRight');
    let x = 0;
    let y = 0;
    if (left) x -= 1;
    if (right) x += 1;
    if (up) y -= 1;
    if (down) y += 1;
    const len = Math.hypot(x, y) || 1;
    return { x: x / len, y: y / len };
  }
}


