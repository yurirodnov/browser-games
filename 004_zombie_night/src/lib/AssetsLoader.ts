export class AssetsLoader {
  private static images: Map<string, HTMLImageElement> = new Map();

  static async loadAsset(key: string, src: string): Promise<void> {
    return new Promise((reject, resolve) => {
      const img = new Image();

      img.onload = () => {
        this.images.set(key, img);
        return resolve();
      };

      img.onerror = () => {
        console.error(`Loading image ${src} error`);
        return reject();
      };
    });
  }

  static getAsset(key: string) {
    const img = this.images.get(key);
    if (!img) {
      return new Error("No such image");
    }

    return img;
  }
}
