export class AssetsLoader {
  private static images: Map<string, HTMLImageElement> = new Map();

  static async loadAssets(key: string, src: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const img = new Image();

      img.onload = () => {
        this.images.set(key, img);
        return resolve();
      };

      img.onerror = () => {
        console.log(`Loading image ${src} error`);
        return reject();
      };

      img.src = src;
    });
  }
}
