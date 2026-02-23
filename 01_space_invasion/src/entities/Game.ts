// 01_space_invasion/src/entities/Game.ts

import type { Assets, Constants } from "../types/types";
import { Background } from "./Background";
import { Spaceship } from "./Spaceship";
import { Projectile } from "./Projectile";
import { Enemy } from "./Enemy";

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
  private shootInterval: number = 30;
  private enemySpawnInterwal: number = 30;

  // game entities
  private background: Background;
  private spaceship: Spaceship;
  private projectiles: Projectile[] = [];
  private enemies: Enemy[] = [];

  // enemy spawn grid
  private columsCount: number = 10;
  private columnWidth: number = 0;
  private occupiedColumns: boolean[] = [];

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

    // calculate column with
    this.columnWidth = this.canvasWidth / this.columsCount;

    // init all columns with false
    this.occupiedColumns = new Array(this.columsCount).fill(false);

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

    this.projectiles = [];
    this.enemies = [];
    this.frameCount = 0;
    this.occupiedColumns.fill(false);
    this.start();
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

  private spawnEnemy(): void {
    const freeColumns: number[] = [];
    this.occupiedColumns.forEach((isOccupied, index) => {
      if (!isOccupied) {
        freeColumns.push(index);
      }
    });

    if (freeColumns.length === 0) {
      return;
    }

    const randomIndex = Math.floor(Math.random() * freeColumns.length);
    const chosenColumn = freeColumns[randomIndex];

    // calculate coords
    const enemyWidth = this.columnWidth;
    const enemyHeight = this.columnWidth;
    const x = chosenColumn * this.columnWidth;
    const y = -enemyHeight;

    const enemy = new Enemy(this.assets.enemy, x, y, enemyWidth, enemyHeight);
    this.enemies.push(enemy);
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
    this.enemies.forEach((e) => e.draw(this.ctx));

    // auto-shoot
    this.frameCount += 1;
    if (this.frameCount >= this.shootInterval) {
      this.shoot();
      this.frameCount = 0;
    }

    // spawn enemy
    if (this.frameCount % this.enemySpawnInterwal === 0) {
      this.spawnEnemy();
    }

    this.projectiles = this.projectiles.filter((p) => {
      p.update();
      return !p.isOffScreen();
    });

    for (let i = this.enemies.length - 1; i >= 0; i--) {
      const enemy = this.enemies[i];
      enemy.update();

      if (enemy.isOffScreen(this.canvasHeight)) {
        console.log("GAME OVER!");
        alert("Игра окончена! Враг прорвался!");
        this.restart();
        return;
      }
    }

    this.animationId = requestAnimationFrame(this.loop);
  };
}
