// 01_space_invasion/src/entities/Game.ts

import type { Assets, Constants } from "../types/types";
import { Background } from "./Background";
import { Spaceship } from "./Spaceship";
import { Projectile } from "./Projectile";
import { Enemy } from "./Enemy";
import { Explosion } from "./Explosion";
import { Stats } from "./Stats";

export class Game {
  // game assets
  private assets: Assets;
  // game state
  private isRunning: boolean = false;
  private animationId: number | null = null;
  private ctx: CanvasRenderingContext2D;
  private canvasWidth: number;
  private canvasHeight: number;
  private shootFrameCount: number = 0;
  private enemyFrameCount: number = 0;
  private shootInterval: number = 25;
  private enemySpawnInterwal: number = 35;
  private killsCounter: number = 0;
  // game entities
  private background: Background;
  private spaceship: Spaceship;
  private projectiles: Projectile[] = [];
  private enemies: Enemy[] = [];
  private explosions: Explosion[] = [];
  private stats: Stats;

  // enemy spawn grid
  private columsCount: number = 9;
  private columnWidth: number = 0;
  private occupiedColumns: boolean[] = [];

  // game keyboard
  private keys = {
    ArrowLeft: false,
    ArrowRight: false,
    Space: false,
  };

  constructor(
    ctx: CanvasRenderingContext2D,
    assets: Assets,
    constants: Constants,
  ) {
    // init game entities
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
      60,
      60,
    );
    this.stats = new Stats();

    // init enemies columns
    this.columnWidth = this.canvasWidth / this.columsCount;
    this.occupiedColumns = new Array(this.columsCount).fill(false);

    // init keys listeners
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
    window.addEventListener("keydown", (e) => {
      if (e.code === "Space") {
        this.keys[e.code as keyof typeof this.keys] = true;
      }
    });
    window.addEventListener("keyup", (e) => {
      if (e.code === "Space") {
        this.keys[e.code as keyof typeof this.keys] = false;
      }
    });
  }

  private shoot(): void {
    const projectileWidth = 15;
    const projectileHeight = 30;

    const projectile = new Projectile(
      this.assets.projectile,
      this.spaceship.getCoordX() +
        this.spaceship.getSizeX() / 2 -
        projectileWidth / 2,
      this.spaceship.getCoordY(),
      projectileWidth,
      projectileHeight,
    );
    this.projectiles.push(projectile);
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
    this.stats.resetScore();
    this.projectiles = [];
    this.enemies = [];
    this.shootFrameCount = 0;
    this.killsCounter = 0;
    this.occupiedColumns.fill(false);
    this.start();
  }

  private increaseKillsCounter(): void {
    this.killsCounter += 1;
  }

  private checkCollision(p: Projectile, e: Enemy): boolean {
    return (
      p.getCoordY() + p.getHeight() > e.getCoordY() &&
      p.getCoordY() < e.getCoordY() + e.getHeight() &&
      p.getCoordX() + p.getWidth() > e.getCoordX() &&
      p.getCoordX() < e.getCoordX() + e.getWidth()
    );
  }

  private getRandomAlien(): string {
    const images = {
      0: "redAlien",
      1: "yellowAlien",
      2: "greenAlien",
    };

    return Object.values(images)[
      Math.floor(Math.random() * Object.keys(images).length)
    ];
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

    const enemyColor = this.getRandomAlien();

    let points: number = 0;

    if (enemyColor === "redAlien") {
      points = 30;
    } else if (enemyColor === "yellowAlien") {
      points = 20;
    } else {
      points = 10;
    }

    const enemy = new Enemy(
      this.assets[enemyColor as keyof typeof this.assets],
      x,
      y,
      enemyWidth,
      enemyHeight,
      points,
    );
    // console.log(enemy);
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

    // shoot
    if (this.keys.Space === true) {
      if (
        this.shootFrameCount === 0 ||
        this.shootFrameCount % this.shootInterval === 0
      ) {
        this.shoot();
        // this.shootFrameCount = 0;
      }
      this.shootFrameCount += 1;
    } else {
      this.shootFrameCount = 0;
    }

    // spawn enemy
    this.enemyFrameCount += 1;
    if (this.enemyFrameCount % this.enemySpawnInterwal === 0) {
      // console.log(this.enemyFrameCount);
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
        alert("Y O U   D I E D");
        this.restart();
        return;
      }
    }

    for (const bullet of this.projectiles) {
      if (!bullet.getAlive()) continue;

      for (const enemy of this.enemies) {
        if (!enemy.getAlive()) continue;

        if (this.checkCollision(bullet, enemy)) {
          bullet.setDead();
          enemy.setDead();
          this.increaseKillsCounter();
          console.log(this.killsCounter);

          const explosion = new Explosion(
            this.assets.explosion,
            enemy.getCoordX(),
            enemy.getCoordY(),
            enemy.getWidth(),
            enemy.getHeight(),
          );
          this.explosions.push(explosion);

          this.stats.addScore(enemy.getPoints());
          if (
            this.stats.getHighScore() === 0 ||
            this.stats.getHighScore() <= this.stats.getScore()
          ) {
            this.stats.addHighScore();
            this.stats.saveHighScore();
          }
        }
      }
    }

    this.projectiles = this.projectiles.filter(
      (p) => p.getAlive() && !p.isOffScreen(),
    );
    this.enemies = this.enemies.filter(
      (e) => e.getAlive() && !e.isOffScreen(this.canvasHeight),
    );
    this.explosions.forEach((explosion) => explosion.startTimer());
    this.explosions = this.explosions.filter((e) => e.getTimer() > 0);

    //  draw objects
    this.background.draw(this.ctx);
    this.spaceship.draw(this.ctx);
    this.projectiles.forEach((p) => p.draw(this.ctx));
    this.enemies.forEach((e) => e.draw(this.ctx));
    this.explosions.forEach((e) => e.draw(this.ctx));

    this.ctx.fillStyle = "white";
    this.ctx.font = "20px Arial";
    this.ctx.fillText(`Score: ${this.stats.getScore()}`, 10, 30);
    this.ctx.fillText(`Best: ${this.stats.getHighScore()}`, 10, 60);
    this.ctx.fillText(`Kills: ${this.killsCounter}`, 10, 90);

    // console.log(this.projectiles);
    this.animationId = requestAnimationFrame(this.loop);
  };
}
