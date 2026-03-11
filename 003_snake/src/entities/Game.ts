// 003_snake/src/entities/Game.ts

import type {
  Assets,
  Constants,
  SnakeDirection,
  GameState,
} from "../types/types";
import { BackgroundTile } from "./BackgroundTile";
import { SnakePart } from "./SnakePart";

export class Game {
  private ctx: CanvasRenderingContext2D;
  private assets: Assets;
  private constants: Constants;
  private running: boolean = true;
  private lastFrameTime: number = 0;
  private animationID: number | null = null;
  private gameField: BackgroundTile[][];
  private snakeDirection: SnakeDirection = "top";
  private snakeBody: SnakePart[] = [];
  private snakePartsCount: number = 3;
  private snakeStartX: number;
  private snakeStartY: number;
  private snakeMovementInterval: number = 10;
  private snakeMovementTimer: number = 0;

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

    this.snakeStartX = this.constants.tileSize * 9;
    this.snakeStartY = this.constants.tileSize * 9;

    // INIT GAME FIELD
    const tilesArray: BackgroundTile[][] = [];
    for (let row: number = 0; row < constants.canvasRows; row += 1) {
      const tilesRow: BackgroundTile[] = [];
      for (let col: number = 0; col < constants.canvasColumns; col += 1) {
        const pixelX = col * this.constants.tileSize;
        const pixelY = row * this.constants.tileSize;

        const backgroundTile = new BackgroundTile(
          this.assets.tileDark,
          this.assets.tileLight,
          pixelX,
          pixelY,
          this.constants.tileSize,
          row,
          col,
        );
        tilesRow.push(backgroundTile);
      }
      tilesArray.push(tilesRow);
    }
    this.gameField = tilesArray;

    this.createBackgroundCache();

    // INIT START SNAKE
    for (
      let i: number = this.snakeStartY;
      i < this.snakeStartY + this.constants.tileSize * this.snakePartsCount;
      i += this.constants.tileSize
    ) {
      if (i === this.snakeStartY) {
        const snakeHead = new SnakePart(
          this.assets.snakeHeadTop,
          this.snakeStartX,
          i,
          this.constants.tileSize,
          this.constants.tileSize,
        );
        snakeHead.setHead();
        this.snakeBody.push(snakeHead);
      } else {
        const snakeBodyPart = new SnakePart(
          this.assets.snakeBody,
          this.snakeStartX,
          i,
          this.constants.tileSize,
          this.constants.tileSize,
        );
        this.snakeBody.push(snakeBodyPart);
      }
    }
    console.log(this.snakeBody);

    // INIT INPUT LISTENERS
    window.addEventListener("keydown", (event: KeyboardEvent) => {
      const key: string = event.key;
      switch (key) {
        case "ArrowLeft":
          this.setDirection("left");
          break;
        case "ArrowTop":
          this.setDirection("top");
          break;
        case "ArrowRight":
          this.setDirection("right");
          break;
        case "ArrowDown":
          this.setDirection("down");
          break;
      }
    });

    // START GAME ON GAME INSTANCE CREATION
    this.running = true;
    this.loop(0);
  }

  private setDirection(d: SnakeDirection): void {
    this.snakeDirection = d;
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
    console.log(this.snakeMovementTimer);
    this.snakeMovementTimer += 10 * deltaTime;
    if (this.snakeMovementTimer > this.snakeMovementInterval) {
      this.snakeBody.forEach((s) =>
        s.update(deltaTime, this.snakeDirection, this.constants.tileSize),
      );
      this.snakeMovementTimer = 0;
    }

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

    this.snakeBody.forEach((s) => s.draw(this.ctx));

    // ENDLESS GAME LOOP
    this.animationID = requestAnimationFrame(this.loop);
  };

  public drawUI() {}
}
