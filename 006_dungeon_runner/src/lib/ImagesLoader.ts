export class ImagesLoader {
  private static images: Map<string, HTMLImageElement> = new Map();

  static async loadImage(key: string, src: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const image = new Image();

      image.onload = () => {
        this.images.set(key, image);
        return resolve();
      };

      image.onerror = () => {
        console.log(`Image ${src} loading error`);
        return reject();
      };

      image.src = src;
    });
  }

  static getImage(key: string): HTMLImageElement {
    const image = this.images.get(key);

    if (!image) {
      throw new Error(`No image ${key}`);
    }

    return image;
  }
}
