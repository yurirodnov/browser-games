// 003_snake/src/entities/Game.ts

import type { Assets, Constants, GameState } from "../types/types";
import { BackgroundTile } from "./BackgroundTile";

export class Game {
  private ctx: CanvasRenderingContext2D;
  private assets: Assets;
  private constants: Constants;
  private running: boolean = true;
  private lastFrameTime: number = 0;
  private animationID: number | null = null;
  private gameField: BackgroundTile[][];

  // BACKGROUND CACHE TO PREVENT WASTE RERENDER EVERY FRAME
  private backgroundCanvasCache: HTMLCanvasElement | null = null;

  // GAME ENTITIES

  constructor(
    ctx: CanvasRenderingContext2D,
    assets: Assets,
    constants: Constants,
  ) {
    this.ctx = ctx;
    this.assets = assets;
    this.constants = constants;

    // INIT GAME FIELD
    const tilesArray: BackgroundTile[][] = [];
    for (
      let i: number = 0;
      i < constants.canvasRows * constants.tileSize;
      i += constants.tileSize
    ) {
      const tilesRow: BackgroundTile[] = [];
      for (
        let j: number = 0;
        j < constants.canvasColumns * constants.tileSize;
        j += this.constants.tileSize
      ) {
        const backgroundTile = new BackgroundTile(
          this.assets.background,
          j,
          i,
          this.constants.tileSize,
        );
        tilesRow.push(backgroundTile);
      }
      tilesArray.push(tilesRow);
    }
    this.gameField = tilesArray;

    this.createBackgroundCache();

    // INIT INPUT LISTENERS

    // START GAME ON GAME INSTANCE CREATION
    this.running = true;
    this.loop(0);
  }

  private createBackgroundCache(): void {
    this.backgroundCanvasCache = document.createElement("canvas");
    this.backgroundCanvasCache.width = this.ctx.canvas.width;
    this.backgroundCanvasCache.height = this.ctx.canvas.height;

    const cacheCTX = this.backgroundCanvasCache.getContext("2d");
    if (!cacheCTX) {
      return;
    }

    for (let row of this.gameField) {
      for (let tile of row) {
        tile.draw(cacheCTX);
      }
    }
  }

  public checkField(): void {
    console.log(this.gameField);
  }

  public start() {
    this.running = true;
    this.lastFrameTime = 0;
    this.animationID = requestAnimationFrame(this.loop);
  }

  public stop() {}

  public restart() {}

  public loop = (timestamp: number) => {
    if (!this.running) {
      return;
    }

    // CLEAR CANVAS
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);

    // GET CURRENT TIME
    const now: number = Date.now();

    // DELTA CALCULATION
    if (this.lastFrameTime === 0) {
      this.lastFrameTime = timestamp;
      this.animationID = requestAnimationFrame(this.loop);
    }
    const deltaTimeMS: number = timestamp - this.lastFrameTime;
    let deltaTime: number = deltaTimeMS / 1000;
    if (deltaTime > 0.1) {
      deltaTime = 0.1;
    }
    this.lastFrameTime = timestamp;

    //  UPDATE GAME

    // DRAW GAME OBJECTS

    // GAME FIELD RENDER (MOVED IN CACHE CREATION)
    // for (let row of this.gameField) {
    //   for (let tile of row) {
    //     tile.draw(this.ctx);
    //   }
    // }

    if (this.backgroundCanvasCache) {
      this.ctx.drawImage(
        this.backgroundCanvasCache,
        0,
        0,
        this.ctx.canvas.width,
        this.ctx.canvas.height,
      );
    }

    // ENDLESS GAME LOOP
    this.animationID = requestAnimationFrame(this.loop);
  };

  public drawUI() {}
}
