import type { Assets, Constants } from "../types/types";
import { Background } from "./Background";
import { Spaceship } from "./Spaceship";

export class Game {
  // game state
  private isRunning: boolean = false;
  private animationId: number | null = null;
  private ctx: CanvasRenderingContext2D;
  private canvasWidth: number;
  private canvasHeight: number;

  // game entities
  private background: Background;
  private spaceship: Spaceship;

  // game keyboard
  private keys = {
    ArrowLeft: false,
    ArrowRight: false,
  };

  constructor(
    ctx: CanvasRenderingContext2D,
    assets: Assets,
    constants: Constants,
  ) {
    this.ctx = ctx;
    this.canvasWidth = constants.canvasWidth;
    this.canvasHeight = constants.canvasHeight;

    this.background = new Background(
      0,
      0,
      ctx.canvas.width,
      ctx.canvas.height,
      assets.background,
    );

    this.spaceship = new Spaceship(
      assets.spaceship,
      constants.canvasWidth,
      constants.canvasHeight,
      50,
      50,
    );

    window.addEventListener("keydown", (e) => {
      if (e.code === "ArrowLeft" || e.code === "ArrowRight") {
        this.keys[e.code as keyof typeof this.keys] = true;
      }
    });
    window.addEventListener("keyup", (e) => {
      if (e.code === "ArrowLeft" || e.code === "ArrowRight") {
        this.keys[e.code as keyof typeof this.keys] = false;
      }
    });
  }

  start(): void {
    if (this.isRunning) return;
    this.isRunning = true;
    this.loop();
  }

  stop(): void {
    this.isRunning = false;
    if (this.animationId !== null) {
      cancelAnimationFrame(this.animationId);
    }
  }

  restart(): void {
    this.stop();
    this.start();
  }

  private loop = (): void => {
    if (!this.isRunning) return;
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);

    // update objects
    this.spaceship.update(
      this.keys.ArrowLeft,
      this.keys.ArrowRight,
      this.canvasWidth,
    );

    //  draw objects
    this.background.draw(this.ctx);
    this.spaceship.draw(this.ctx);
    this.animationId = requestAnimationFrame(this.loop);
  };
}
