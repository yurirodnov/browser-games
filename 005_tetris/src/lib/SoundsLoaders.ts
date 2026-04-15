export class SoundsLoader {
  private static sounds: Map<string, HTMLAudioElement> = new Map();

  static async loadAssets(key: string, src: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const audio = new Audio();

      audio.onload = () => {
        this.sounds.set(key, audio);
        return resolve();
      };

      audio.onerror = () => {
        console.log(`Loading sound ${src} error`);
        return reject();
      };

      audio.src = src;
    });
  }
}
