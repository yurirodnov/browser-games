// 003_snake/src/entities/Game.ts

import {
  type Assets,
  type Constants,
  type SnakeDirection,
  GameState,
  type RandomTile,
} from "../types/types";
import { Apple } from "./Apple";
import { BackgroundTile } from "./BackgroundTile";
import { SnakePart } from "./SnakePart";
import { getRandomTile } from "../lib/getRandomTile";

export class Game {
  private ctx: CanvasRenderingContext2D;
  private assets: Assets;
  private constants: Constants;
  private running: boolean = true;
  private gameState: GameState = GameState.MENU;
  private lastFrameTime: number = 0;
  private animationID: number | null = null;
  private gameField: BackgroundTile[][];
  private applesOnField: Apple[] = [];
  private snakeDirection: SnakeDirection = "up";
  private fullSnake: SnakePart[] = [];
  private snakeSize: number = 3;
  private snakeStartX: number;
  private snakeStartY: number;
  private snakeMovementInterval: number = 10;
  private snakeMovementTimer: number = 0;
  private normalSnakeSpeed: number = 30;
  private boostedSnakeSpeed: number = 100;
  private isRapid: boolean = false;
  private haveGrow: boolean = false;

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

    this.snakeStartX = this.constants.tileSize * 6;
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
      i < this.snakeStartY + this.constants.tileSize * this.snakeSize;
      i += this.constants.tileSize
    ) {
      if (i === this.snakeStartY) {
        const snakeHead = new SnakePart(
          this.assets.snakeHeadUp,
          this.snakeStartX,
          i,
          this.constants.tileSize,
          this.constants.tileSize,
          true,
        );
        // snakeHead.setHead();
        this.fullSnake.push(snakeHead);
      } else {
        const snakeBodyPart = new SnakePart(
          this.assets.snakeBody,
          this.snakeStartX,
          i,
          this.constants.tileSize,
          this.constants.tileSize,
          false,
        );
        this.fullSnake.push(snakeBodyPart);
      }
    }

    // INIT FIRST APPLE
    let newAppleCoords: RandomTile;
    let isOccupied: boolean;
    do {
      isOccupied = false;
      newAppleCoords = getRandomTile(
        this.constants.canvasRows,
        this.constants.canvasColumns,
        this.constants.tileSize,
      );
      for (const part of this.fullSnake) {
        if (
          part.getCoordX() === newAppleCoords.x &&
          part.getCoordY() === newAppleCoords.y
        ) {
          isOccupied = true;
          break;
        }
      }
    } while (isOccupied);
    const newApple = new Apple(
      this.assets.apple,
      newAppleCoords.x,
      newAppleCoords.y,
      this.constants.tileSize,
      this.constants.tileSize,
    );
    this.applesOnField.push(newApple);

    // INIT INPUT LISTENERS
    // SNAKE CONTROL
    window.addEventListener("keydown", (event: KeyboardEvent) => {
      const key: string = event.key;
      switch (key) {
        case "ArrowLeft":
          if (this.snakeDirection === "right") {
            return;
          }
          this.setDirection("left");
          break;
        case "ArrowUp":
          if (this.snakeDirection === "down") {
            return;
          }
          this.setDirection("up");
          break;
        case "ArrowRight":
          if (this.snakeDirection === "left") {
            return;
          }
          this.setDirection("right");
          break;
        case "ArrowDown":
          if (this.snakeDirection === "up") {
            return;
          }
          this.setDirection("down");
          break;
      }
    });
    // USE RAPID
    window.addEventListener("keydown", (event: KeyboardEvent) => {
      if (event.code === "Space") {
        this.isRapid = true;
      }
    });
    window.addEventListener("keyup", (event: KeyboardEvent) => {
      if (event.code === "Space") {
        this.isRapid = false;
      }
    });
    // GAME STATE CONTROLL
    window.addEventListener("mousedown", (e: MouseEvent) => {
      e.preventDefault();
      this.handleInput();
    });

    // START GAME ON GAME INSTANCE CREATION
    this.running = true;
    this.loop(0);
  }

  private handleInput(): void {
    switch (this.gameState) {
      case GameState.MENU:
        this.start();
        break;
      case GameState.GAME_OVER:
        this.restart();
        break;
    }
  }

  private checkWallCollision(
    snakePart: SnakePart,
    constants: Constants,
  ): boolean {
    return true;
  }

  private checkSelfCollision(snakePart: SnakePart): boolean {
    return true;
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
    this.gameState = GameState.PLAY;
    this.lastFrameTime = 0;
    this.animationID = requestAnimationFrame(this.loop);
  }

  public stop() {
    this.running = false;
    this.gameState = GameState.GAME_OVER;
    if (this.animationID !== null) {
      cancelAnimationFrame(this.animationID);
    }
  }

  public restart() {
    this.fullSnake = [];
    this.applesOnField = [];
    this.start();
  }

  public drawUI() {
    const canvasWidthMid: number =
      (this.constants.canvasColumns * this.constants.tileSize) / 2;

    const canvasHeightMid: number =
      (this.constants.canvasRows * this.constants.tileSize) / 2;

    this.ctx.save();

    this.ctx.textAlign = "center";
    this.ctx.lineJoin = "round";
    this.ctx.lineWidth = 4;

    if (this.gameState === GameState.MENU) {
      // DARK FADE
      this.ctx.fillStyle = "rgba(0, 0, 0, 0.4)";
      this.ctx.fillRect(
        0,
        0,
        this.constants.canvasColumns * this.constants.tileSize,
        this.constants.canvasRows * this.constants.tileSize,
      );

      // GAME NAME DRAWING
      this.ctx.font = "75px 'Silkscreen', sans-serif";
      this.ctx.strokeStyle = "white";
      this.ctx.strokeText("SNAKE", canvasWidthMid, canvasHeightMid - 20);
      this.ctx.fillStyle = "rgb(154 223 23)";
      this.ctx.fillText("SNAKE", canvasWidthMid, canvasHeightMid - 20);

      // CALL TO ACTION DRAWING
      this.ctx.font = "35px 'Silkscreen', sans-serif";
      this.ctx.strokeStyle = "black";
      this.ctx.strokeText(
        "click to start",
        canvasWidthMid,
        canvasHeightMid + 40,
      );
      this.ctx.fillStyle = "white";
      this.ctx.fillText("click to start", canvasWidthMid, canvasHeightMid + 40);
    } else if (this.gameState === GameState.PLAY) {
    } else if (this.gameState === GameState.GAME_OVER) {
    }
  }

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

    // GAME STATE PLAY
    if (this.gameState === GameState.PLAY) {
      // UPDATE GAME
      // SNAKE MOVEMENT
      this.snakeMovementTimer +=
        (this.isRapid ? this.boostedSnakeSpeed : this.normalSnakeSpeed) *
        deltaTime;
      if (this.snakeMovementTimer > this.snakeMovementInterval) {
        let newHeadDirection: string = "";
        let newHead: SnakePart | null = null;
        switch (this.snakeDirection) {
          case "left":
            newHeadDirection = "snakeHeadLeft";
            newHead = new SnakePart(
              this.assets[newHeadDirection as keyof typeof this.assets],
              this.fullSnake[0].getCoordX() - this.constants.tileSize,
              this.fullSnake[0].getCoordY(),
              this.constants.tileSize,
              this.constants.tileSize,
              true,
            );
            this.fullSnake[0].setHead(false);
            this.fullSnake[0].setImage(this.assets.snakeBody);
            if (this.haveGrow) {
              this.haveGrow = false;
            } else {
              this.fullSnake.pop();
            }
            this.fullSnake.unshift(newHead);
            break;
          case "up":
            newHeadDirection = "snakeHeadUp";
            newHead = new SnakePart(
              this.assets[newHeadDirection as keyof typeof this.assets],
              this.fullSnake[0].getCoordX(),
              this.fullSnake[0].getCoordY() - this.constants.tileSize,
              this.constants.tileSize,
              this.constants.tileSize,
              true,
            );
            this.fullSnake[0].setHead(false);
            this.fullSnake[0].setImage(this.assets.snakeBody);
            if (this.haveGrow) {
              this.haveGrow = false;
            } else {
              this.fullSnake.pop();
            }
            this.fullSnake.unshift(newHead);
            break;
          case "right":
            newHeadDirection = "snakeHeadRight";
            newHead = new SnakePart(
              this.assets[newHeadDirection as keyof typeof this.assets],
              this.fullSnake[0].getCoordX() + this.constants.tileSize,
              this.fullSnake[0].getCoordY(),
              this.constants.tileSize,
              this.constants.tileSize,
              true,
            );
            this.fullSnake[0].setHead(false);
            this.fullSnake[0].setImage(this.assets.snakeBody);
            if (this.haveGrow) {
              this.haveGrow = false;
            } else {
              this.fullSnake.pop();
            }
            this.fullSnake.unshift(newHead);
            break;
          case "down":
            newHeadDirection = "snakeHeadDown";
            newHead = new SnakePart(
              this.assets[newHeadDirection as keyof typeof this.assets],
              this.fullSnake[0].getCoordX(),
              this.fullSnake[0].getCoordY() + this.constants.tileSize,
              this.constants.tileSize,
              this.constants.tileSize,
              true,
            );
            this.fullSnake[0].setHead(false);
            this.fullSnake[0].setImage(this.assets.snakeBody);
            if (this.haveGrow) {
              this.haveGrow = false;
            } else {
              this.fullSnake.pop();
            }
            this.fullSnake.unshift(newHead);
        }

        this.snakeMovementTimer = 0;
      }

      // APPLE EATING
      if (
        this.fullSnake[0].getCoordX() === this.applesOnField[0].getCoordX() &&
        this.fullSnake[0].getCoordY() === this.applesOnField[0].getCoordY()
      ) {
        this.haveGrow = true;
        this.applesOnField = [];
        let newAppleCoords: RandomTile;
        let isOccupied: boolean;
        do {
          isOccupied = false;
          newAppleCoords = getRandomTile(
            this.constants.canvasRows,
            this.constants.canvasColumns,
            this.constants.tileSize,
          );
          for (const part of this.fullSnake) {
            if (
              part.getCoordX() === newAppleCoords.x &&
              part.getCoordY() === newAppleCoords.y
            ) {
              isOccupied = true;
              break;
            }
          }
        } while (isOccupied);
        const newApple = new Apple(
          this.assets.apple,
          newAppleCoords.x,
          newAppleCoords.y,
          this.constants.tileSize,
          this.constants.tileSize,
        );
        this.applesOnField.push(newApple);

        console.log(this.snakeSize);
      }
    }

    // DRAW GAME OBJECTS
    if (this.backgroundCanvasCache) {
      // GAME FIELD RENDER (MOVED IN CACHE CREATION)
      // for (let row of this.gameField) {
      //   for (let tile of row) {
      //     tile.draw(this.ctx);
      //   }
      // }
      this.ctx.drawImage(
        this.backgroundCanvasCache,
        0,
        0,
        this.ctx.canvas.width,
        this.ctx.canvas.height,
      );
    }
    this.fullSnake.forEach((s) => s.draw(this.ctx));
    this.applesOnField.forEach((a) =>
      !a.getEaten() ? a.draw(this.ctx) : null,
    );

    this.drawUI();
    // ENDLESS GAME LOOP
    this.animationID = requestAnimationFrame(this.loop);
  };
}
