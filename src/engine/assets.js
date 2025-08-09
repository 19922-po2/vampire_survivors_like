export class AssetStore {
  constructor() {
    this.images = new Map();
  }

  async loadImages(map) {
    const entries = Object.entries(map);
    await Promise.all(entries.map(([key, src]) => this._loadImage(key, src)));
  }

  _loadImage(key, src) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        this.images.set(key, img);
        resolve();
      };
      img.onerror = reject;
      img.src = src;
    });
  }

  img(key) {
    const img = this.images.get(key);
    if (!img) throw new Error(`Image not loaded: ${key}`);
    return img;
  }
}


