import type { GameAssets, GameConstants, GameScreenState } from "../types/types";
import type { Brick } from "./Brick";
import { Background } from "./Background";

export class Game {
  private assets: GameAssets;
  private constants: GameConstants;
  private ctx: CanvasRenderingContext2D;
  private isRunningGameplay: boolean = true;
  private gameScreenState: GameScreenState = "menu";
  private animationID: number = 0;
  private lastAnimationFrameTime: number = 0;
  private bricks: Brick[] = [];

  private background: Background;

  constructor(assets: GameAssets, constants: GameConstants, ctx: CanvasRenderingContext2D) {
    this.assets = assets;
    this.constants = constants;
    this.ctx = ctx;

    this.background = new Background(
      this.assets.picsAssets.background,
      0,
      0,
      this.ctx.canvas.width,
      this.ctx.canvas.height,
    );

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
    this.background.draw(this.ctx);

    this.animationID = requestAnimationFrame(this.loop);
  };
}
