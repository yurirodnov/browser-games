export class AudioLoader {
  private static sounds: Map<string, HTMLAudioElement> = new Map();

  static async loadAsset(key: string, src: string): Promise<void> {
    return new Promise((reject, resolve) => {
      const audio = new Audio();

      audio.onload = () => {
        this.sounds.set(key, audio);
        return resolve();
      };

      audio.onerror = () => {
        console.log(`Loading audio ${src} error!`);
        return reject();
      };

      audio.src = src;
    });
  }

  static getAsset(key: string): HTMLAudioElement {
    const audio = this.sounds.get(key);

    if (!audio) {
      throw new Error(`No ${key} sound!`);
    }

    return audio;
  }
}
