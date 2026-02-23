// 01_space_invasion/src/entities/Game.ts

import type { Assets, Constants } from "../types/types";
import { Background } from "./Background";
import { Spaceship } from "./Spaceship";
import { Projectile } from "./Projectile";

export class Game {
  // game assets
  private assets: Assets;

  // game state
  private isRunning: boolean = false;
  private animationId: number | null = null;
  private ctx: CanvasRenderingContext2D;
  private canvasWidth: number;
  private canvasHeight: number;
  private frameCount: number = 0;
  private shootInterval: number = 40;

  // game entities
  private background: Background;
  private spaceship: Spaceship;
  private projectiles: Projectile[] = [];

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
    this.assets = assets;

    this.background = new Background(
      0,
      0,
      ctx.canvas.width,
      ctx.canvas.height,
      this.assets.background,
    );

    this.spaceship = new Spaceship(
      this.assets.spaceship,
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
    this.projectiles = [];
    this.frameCount = 0;
  }

  private shoot(): void {
    const projectile = new Projectile(
      this.assets.projectile,
      this.spaceship.getCoordX(),
      this.spaceship.getCoordY(),
      this.spaceship.getSizeX(),
      this.spaceship.getSizeY(),
      30,
      30,
    );
    this.projectiles.push(projectile);
  }

  // endless game loop method
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

    this.projectiles.forEach((p) => p.draw(this.ctx));

    // auto-shoot
    this.frameCount += 1;
    if (this.frameCount >= this.shootInterval) {
      this.shoot();
      this.frameCount = 0;
    }

    this.projectiles = this.projectiles.filter((p) => {
      p.update(); // Сначала обновляем позицию
      return !p.isOffScreen(); // Возвращаем true, если пуля должна ОСТАТЬСЯ (не offScreen)
    });

    this.animationId = requestAnimationFrame(this.loop);
  };
}
