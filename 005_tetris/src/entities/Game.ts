import type { GameAssets, GameConstants, GameScreenState } from "../types/types";
import type { Brick } from "./Brick";

export class Game {
  private assets: GameAssets;
  private constants: GameConstants;
  private ctx: CanvasRenderingContext2D;
  private isRunningGameplay: boolean = true;
  private gameScreenState: GameScreenState = "menu";
  private animationID: number = 0;
  private lastAnimationFrameTime: number = 0;
  private bricks: Brick[] = [];

  constructor(assets: GameAssets, constants: GameConstants, ctx: CanvasRenderingContext2D) {
    this.assets = assets;
    this.constants = constants;
    this.ctx = ctx;

    window.addEventListener("keydown", (e: KeyboardEvent) => {});

    window.addEventListener("keydown", (e: KeyboardEvent) => {});

    window.addEventListener("keydown", (e: KeyboardEvent) => {});

    window.addEventListener("keydown", (e: KeyboardEvent) => {});
  }

  public createFigure(): void {}

  public drawUI(): void {}

  public start(): void {
    this.isRunningGameplay = true;
  }

  public stop(): void {
    this.isRunningGameplay = false;
  }

  public loop(timestamp: number): void {
    if (!this.isRunningGameplay) {
      return;
    }

    this.animationID = requestAnimationFrame(this.loop);
  }
}
