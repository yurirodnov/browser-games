export interface Assets {
  survivorLeft: HTMLImageElement;
  survivorKnifeLeft: HTMLImageElement;
  survivorWalk1Left: HTMLImageElement;
  survivorWalk2Left: HTMLImageElement;
  survivorRight: HTMLImageElement;
  survivorKnifeRight: HTMLImageElement;
  survivorWalk1Right: HTMLImageElement;
  survivorWalk2Right: HTMLImageElement;
  ground: HTMLImageElement;
  background: HTMLImageElement;
  bullet: HTMLImageElement;
  life: HTMLImageElement;
}

export interface Constants {
  tileSize: number;
  playerWidth: number;
  playerHeight: number;
}

export type GameState = "menu" | "play" | "gameOver";

export type MovementState = "left" | "right" | "stop";
