export class AssetsLoader {
  private static images: Map<string, HTMLImageElement> = new Map();

  static async loadAsset(key: string, src: string): Promise<void> {
    return new Promise((resolve) => {
      const img = new Image();

      img.onload = () => {
        AssetsLoader.images.set(key, img);
        return resolve();
      };

      img.onerror = () => {
        console.error(`Loading image ${src} error`);
        return resolve();
      };

      img.src = src;
    });
  }

  static getAsset(key: string): HTMLImageElement {
    const img = this.images.get(key);

    if (!img) {
      throw new Error("No such image");
    }

    return img;
  }
}
