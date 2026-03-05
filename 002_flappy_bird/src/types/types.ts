export interface Assets {
  backgroundDay: HTMLImageElement;
  backgroundNight: HTMLImageElement;
  base: HTMLImageElement;
  // birdUP: HTMLImageElement;
  // birdMID: HTMLImageElement;
  // birdDOWN: HTMLImageElement;
  birdFrames: HTMLImageElement[];
  pipeUP: HTMLImageElement;
  pipeDOWN: HTMLImageElement;
}

export interface Constants {
  canvasWidth: number;
  canvasHeight: number;
  dayDurationMs: number;
  nightDurationMs: number;
  baseHeight: number;
  birdSpawnX: number;
  birdSpawnY: number;
  screenSpeed: number;
}

export interface Controls {
  click: MouseEvent;
}

export interface GameState {
  menu: string;
  play: string;
  death: string;
}
