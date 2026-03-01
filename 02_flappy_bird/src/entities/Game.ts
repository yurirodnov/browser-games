// 02_flappy_bird/src/entities/Game.ts

import type { Assets, Constants } from "../types/types";
import { Background } from "./Background";
import { Bird } from "./Bird";

export class Game {
  // GAME STATE
  private ctx: CanvasRenderingContext2D;
  private assets: Assets;
  private constants: Constants;
  private isRunning: boolean = false;
  private animationID: number | null = null;
  private lastFrameTime: number = 0;
  private dayDuration: number;
  private nightDuration: number;
  private lastDaySwitchedTime: number = 0;
  private isDay: boolean = false;

  // GAME ENTITIES
  private background: Background;

  constructor(
    ctx: CanvasRenderingContext2D,
    assets: Assets,
    constants: Constants,
  ) {
    this.ctx = ctx;
    this.assets = assets;
    this.constants = constants;

    this.dayDuration = constants.dayDurationMs;
    this.nightDuration = constants.nightDurationMs;

    // CREATE CLASSES INTANCES
    this.background = new Background(
      this.assets.backgroundDay,
      0,
      0,
      this.constants.canvasWidth,
      this.constants.canvasHeight,
    );

    // this.base = new Base();
    // this.bird = new Bird(this.assets.bird, 100, 300, 60, 60);
  }

  private loop = (timestamp: number): void => {
    if (!this.isRunning) {
      return;
    }

    // CALCULATE DELTA
    if (this.lastFrameTime === 0) {
      this.lastFrameTime = timestamp;
      this.animationID = requestAnimationFrame(this.loop);
      return;
    }

    const deltaTimeMs: number = timestamp - this.lastFrameTime;

    let deltaTime: number = deltaTimeMs / 1000;

    if (deltaTime > 0.1) {
      deltaTime = 0.1;
    }

    this.lastFrameTime = deltaTime;
    // CLEAR CANVAS
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);

    // GET CURRENT TIME
    const now = Date.now();

    // DAY SWITCHING LOGIC
    if (!this.isDay && now - this.lastDaySwitchedTime > this.dayDuration) {
      this.isDay = true;
      this.lastDaySwitchedTime = now;
    } else if (
      this.isDay &&
      now - this.lastDaySwitchedTime > this.nightDuration
    ) {
      this.isDay = false;
      this.lastDaySwitchedTime = now;
    }

    // SWITCHING DAY/NIGHT BACKGROUND IMAGE
    if (this.isDay) {
      this.background.setImage(this.assets.backgroundDay);
    } else {
      this.background.setImage(this.assets.backgroundNight);
    }

    // DRAW OBJECTS IN A LOOP
    this.background.draw(this.ctx);

    // this.base.draw(this.ctx);
    // this.bird.draw(this.ctx);

    // ENDLESS GAME LOOP
    this.animationID = requestAnimationFrame(this.loop);
  };

  public restart(): void {}

  public start(): void {
    if (this.isRunning) return;
    this.isRunning = true;
    this.lastFrameTime = 0;
    this.loop(0);
  }
}
