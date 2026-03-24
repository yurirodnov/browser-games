// 004_zombie_night/src/entities/Game.ts

import type {
  Assets,
  Constants,
  GameState,
  MovementState,
} from "../types/type";
import { Background } from "./Background";
import { GroundTile } from "./GroundTile";
import { Survivor } from "./Survivor";

export class Game {
  private ctx: CanvasRenderingContext2D;
  private assets: Assets;
  private constants: Constants;
  private running: boolean = true;
  private gameState: GameState = "menu";
  private animationID: number = 0;
  private lastFrameTime: number = 0;
  private zombieSpawnTimer: number = 0;
  private worldSize: number = 0;
  private worldOffset: number = 0;
  private maxWorldOffset: number = 0;

  private movementState: MovementState = "stop";
  private speed: number = 280;

  private groundTiles: GroundTile[];
  private survivor: Survivor;
  private background: Background;

  constructor(
    ctx: CanvasRenderingContext2D,
    assets: Assets,
    constants: Constants,
  ) {
    this.ctx = ctx;
    this.assets = assets;
    this.constants = constants;

    // WORLD SIZE
    this.worldSize = this.ctx.canvas.width * 2;
    this.worldOffset = -ctx.canvas.width / 2;
    this.maxWorldOffset = this.worldOffset * 2;

    // INIT GAME ENTITIES
    // INIT BACKGROUND
    this.background = new Background(
      this.assets.background,
      0,
      0,
      this.ctx.canvas.width * 2,
      this.ctx.canvas.height,
    );

    // INIT GROUND
    const groundTilesArray: GroundTile[] = [];
    const worldWidth = this.ctx.canvas.width * 2;
    const groundHeight = this.ctx.canvas.height - this.constants.tileSize;
    const totalTiles = Math.ceil(worldWidth / this.constants.tileSize);
    for (let i = 0; i < totalTiles; i++) {
      const x = i * this.constants.tileSize;

      const groundTile = new GroundTile(
        this.assets.ground,
        x,
        groundHeight,
        this.constants.tileSize,
        this.constants.tileSize,
      );
      groundTilesArray.push(groundTile);
    }
    this.groundTiles = groundTilesArray;

    // INIT PLAYER
    this.survivor = new Survivor(
      this.assets.survivorLeft,
      this.assets.survivorRight,
      this.ctx.canvas.width / 2 - this.constants.playerWidth / 2,
      this.ctx.canvas.height -
        this.constants.tileSize -
        this.constants.playerHeight,
      this.constants.playerWidth,
      this.constants.playerHeight,
    );

    window.addEventListener("keydown", (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        this.movementState = "left";
      }
    });
    window.addEventListener("keydown", (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") {
        this.movementState = "right";
      }
    });
    window.addEventListener("keyup", (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
        this.movementState = "stop";
      }
    });

    // START GAME ON GAME INSTANCE CREATION
    this.running = true;
    this.loop(0);
  }

  public start() {}

  public stop() {
    this.running = false;
    this.gameState = "gameOver";
    if (this.animationID !== null) {
      cancelAnimationFrame(this.animationID);
    }
  }

  public restart() {}

  private drawUI() {
    this.ctx.textAlign = "center";
    this.ctx.lineJoin = "round";
    this.ctx.lineWidth = 3;
  }

  public loop = (timestamp: number) => {
    if (!this.running) {
      return;
    }

    // CLEAR CANVAS
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);

    // DISABLE PICS BLURING
    this.ctx.imageSmoothingEnabled = false;

    // CALCULATE DELTA
    if (this.lastFrameTime === 0) {
      this.lastFrameTime = timestamp;
    }
    const deltaTimeMS: number = timestamp - this.lastFrameTime;
    let delta: number = deltaTimeMS / 1000;
    if (delta > 0.1) {
      delta = 0.1;
    }
    this.lastFrameTime = timestamp;

    // UPDATE OBJECTS
    if (this.movementState === "left" && this.worldOffset <= 0) {
      this.worldOffset += this.speed * delta;
    } else if (
      this.movementState === "right" &&
      this.worldOffset > this.maxWorldOffset
    ) {
      this.worldOffset -= this.speed * delta;
    }

    this.survivor.update(
      this.speed,
      delta,
      this.movementState,
      this.ctx.canvas.width,
    );

    // DRAW ASSETS
    this.background.draw(this.ctx, this.worldOffset);
    for (const tile of this.groundTiles) {
      tile.draw(this.ctx, this.worldOffset);
    }

    this.survivor.draw(this.ctx, this.movementState);

    // DRAW UI
    this.drawUI();

    // GAME LOOP
    this.animationID = requestAnimationFrame(this.loop);
  };
}
