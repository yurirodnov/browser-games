export interface Assets {
  backgroundDay: HTMLImageElement;
  backgroundNight: HTMLImageElement;
  base: HTMLImageElement;
  birdUP: HTMLImageElement;
  birdMID: HTMLImageElement;
  birdDOWN: HTMLImageElement;
}

export interface Constants {
  canvasWidth: number;
  canvasHeight: number;
  dayDurationMs: number;
  nightDurationMs: number;
  baseHeight: number;
  birdSpawnX: number;
  birdSpawnY: number;
}

export interface Keys {
  space: boolean;
}
