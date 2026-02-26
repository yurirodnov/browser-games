// 02_flappy_bird/src/entities/Game.ts

import type { Assets, Constants } from "../types/types";
import { Background } from "./Background";

export class Game {
  // game state
  private ctx: CanvasRenderingContext2D;
  private assets: Assets;
  private constants: Constants;
  private isRunning: boolean = false;
  private animationID: number | null = null;

  // game entitens
  private background: Background;

  constructor(
    ctx: CanvasRenderingContext2D,
    assets: Assets,
    constants: Constants,
  ) {
    this.ctx = ctx;
    this.assets = assets;
    this.constants = constants;

    // create classes instnces
    this.background = new Background(this.assets.background, 0, 0, 600, 1200);
  }

  private loop = (): void => {
    if (!this.isRunning) {
      return;
    }

    // clear canvas
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);

    // draw objects
    this.background.draw(this.ctx);

    // endless game loop
    this.animationID = requestAnimationFrame(this.loop);
  };

  start() {
    if (this.isRunning) return;
    this.isRunning = true;
    this.loop();
  }
}
