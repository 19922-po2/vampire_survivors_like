export function startGameLoop({ update, render }) {
  let last = performance.now();
  const step = 1 / 60;
  let acc = 0;

  function frame(now) {
    const dt = Math.min(0.25, (now - last) / 1000);
    last = now;
    acc += dt;
    while (acc >= step) {
      update(step);
      acc -= step;
    }
    render();
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}


