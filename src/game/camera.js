export function updateCamera(state, canvas) {
  // Center camera on player
  state.camera.x = state.player.x - canvas.width / 2;
  state.camera.y = state.player.y - canvas.height / 2;
}

export function worldToScreen(camera, x, y) {
  return { x: x - camera.x, y: y - camera.y };
}

export function screenToWorld(camera, x, y) {
  return { x: x + camera.x, y: y + camera.y };
}


