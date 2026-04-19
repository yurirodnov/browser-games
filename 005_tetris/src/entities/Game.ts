// 005_tetris/src/entities/Game.ts

import type { GameAssets, GameConstants, GameScreenState } from "../types/types";
import type { Brick } from "./Brick";
import { Background } from "./Background";
import { HUD } from "./HUD";

export class Game {
  private assets: GameAssets;
  private constants: GameConstants;
  private gameCtx: CanvasRenderingContext2D;
  private hudCtx: CanvasRenderingContext2D;
  private isRunningGameplay: boolean = true;
  private gameScreenState: GameScreenState = "menu";
  private animationID: number = 0;
  private lastAnimationFrameTime: number = 0;
  private bricks: Brick[] = [];

  private background: Background;
  private HUD: HUD;

  constructor(
    assets: GameAssets,
    constants: GameConstants,
    gameCtx: CanvasRenderingContext2D,
    hudCtx: CanvasRenderingContext2D,
  ) {
    this.assets = assets;
    this.constants = constants;
    this.gameCtx = gameCtx;
    this.hudCtx = hudCtx;

    this.background = new Background(
      this.assets.picsAssets.background,
      0,
      0,
      this.gameCtx.canvas.width,
      this.gameCtx.canvas.height,
    );

    this.HUD = new HUD(this.assets.picsAssets.HUD, 0, 0, this.hudCtx.canvas.width, this.hudCtx.canvas.height);

    window.addEventListener("keydown", (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        console.log("Left");
      }
    });
    window.addEventListener("keydown", (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") {
        console.log("Right");
      }
    });
    window.addEventListener("keydown", (e: KeyboardEvent) => {
      if (e.key === "ArrowUp") {
        console.log("Rotate");
      }
    });
    window.addEventListener("keydown", (e: KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        console.log("Fall");
      }
    });

    window.addEventListener("keydown", (e: KeyboardEvent) => {});

    window.addEventListener("keydown", (e: KeyboardEvent) => {});

    window.addEventListener("keydown", (e: KeyboardEvent) => {});

    this.isRunningGameplay = true;
    this.loop(0);
  }

  public createFigure(): void {}

  public drawUI(): void {}

  public start(): void {
    this.isRunningGameplay = true;
  }

  public stop(): void {
    this.isRunningGameplay = false;
  }

  public loop = (timestamp: number): void => {
    if (!this.isRunningGameplay) {
      return;
    }

    // DRAW OBJECTS
    this.background.draw(this.gameCtx);
    this.HUD.draw(this.hudCtx);

    this.animationID = requestAnimationFrame(this.loop);
  };
}
