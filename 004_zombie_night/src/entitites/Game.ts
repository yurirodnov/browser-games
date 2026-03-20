// 004_zombie_night/src/entities/Game.ts

import type { Assets, Constants, GameState } from "../types/type";
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

    // INIT GAME ENTITIES

    // INIT BACKGROUND
    this.background = new Background(
      this.assets.background,
      0,
      0,
      this.ctx.canvas.width,
      this.ctx.canvas.height,
    );

    // INIT GROUND
    const groundTilesArray: GroundTile[] = [];
    for (
      let i: number = 0;
      i < this.ctx.canvas.width;
      i += this.constants.tileSize
    ) {
      const groundTile = new GroundTile(
        this.assets.ground,
        i,
        this.ctx.canvas.height - this.constants.tileSize,
        this.constants.tileSize,
        this.constants.tileSize,
      );
      groundTilesArray.push(groundTile);
    }
    this.groundTiles = groundTilesArray;

    // INIT PLAYER
    this.survivor = new Survivor(
      this.assets.survivor,
      this.ctx.canvas.width / 2,
      this.ctx.canvas.height - this.constants.tileSize - 200,
      25,
      50,
    );

    // START GAME ON GAME INSTANCE CREATION
    this.running = true;
    this.loop(0);
  }

  public start() {}

  public stop() {}

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

    // DRAW ASSETS
    this.background.draw(this.ctx);
    for (const tile of this.groundTiles) {
      tile.draw(this.ctx);
    }

    this.survivor.draw(this.ctx);

    // DRAW UI
    this.drawUI();

    // GAME LOOP

    this.animationID = requestAnimationFrame(this.loop);
  };
}
