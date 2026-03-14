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
import { Shit } from "./Shit";
import { Score } from "./Score";
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
  private applesEaten: number = 0;
  private shitOnField: Shit[] = [];
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
  private score: Score;

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

    this.score = new Score();

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
    this.initSnake();
    // INIT FIRST APPLE
    this.spawnApple();

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

  private initSnake(): void {
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
  }

  private spawnApple(): void {
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

      if (this.shitOnField.length > 0) {
        for (const shit of this.shitOnField) {
          if (
            shit.getCoordX() === newAppleCoords.x &&
            shit.getCoordY() === newAppleCoords.y
          ) {
            isOccupied = true;
            break;
          }
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
  }

  private spawnShit(): void {
    let newShitCoords: RandomTile;
    let isOccupied: boolean;

    do {
      isOccupied = false;
      newShitCoords = getRandomTile(
        this.constants.canvasRows,
        this.constants.canvasColumns,
        this.constants.tileSize,
      );

      for (const part of this.fullSnake) {
        if (
          part.getCoordX() === newShitCoords.x &&
          part.getCoordY() === newShitCoords.y
        ) {
          isOccupied = true;
          break;
        }
      }
    } while (isOccupied);
    const newShit = new Shit(
      this.assets.shit,
      newShitCoords.x,
      newShitCoords.y,
      this.constants.tileSize,
      this.constants.tileSize,
    );
    this.shitOnField.push(newShit);
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
    this.gameState = GameState.PLAY;
    this.running = true;
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
    this.shitOnField = [];
    this.applesEaten = 0;
    this.haveGrow = false;
    this.score.resetScore();
    this.snakeDirection = "up";

    this.initSnake();
    this.spawnApple();

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
      ////////////////////////////////////////////////////////////////////////
    } else if (this.gameState === GameState.PLAY) {
      this.ctx.textAlign = "left";
      this.ctx.lineWidth = 3;
      this.ctx.font = "25px 'Silkscreen', sans-serif";
      this.ctx.strokeStyle = "black";
      this.ctx.strokeText(`Scores: ${this.score.getScore()}`, 10, 30);
      this.ctx.fillStyle = "white";
      this.ctx.fillText(`Scores: ${this.score.getScore()}`, 10, 30);

      this.ctx.strokeStyle = "black";
      this.ctx.strokeText(`High scores: ${this.score.getHighScore()}`, 10, 60);
      this.ctx.fillStyle = "white";
      this.ctx.fillText(`High scores: ${this.score.getHighScore()}`, 10, 60);
      ///////////////////////////////////////////////////////////////////////
    } else if (this.gameState === GameState.GAME_OVER) {
      this.ctx.fillStyle = "rgba(0, 0, 0, 0.4)";
      this.ctx.fillRect(
        0,
        0,
        this.constants.canvasColumns * this.constants.tileSize,
        this.constants.canvasRows * this.constants.tileSize,
      );

      this.ctx.font = "55px 'Silkscreen', sans-serif";
      this.ctx.strokeStyle = "white";
      this.ctx.strokeText("GAME OVER", canvasWidthMid, canvasHeightMid - 20);
      this.ctx.fillStyle = "red";
      this.ctx.fillText("GAME OVER", canvasWidthMid, canvasHeightMid - 20);

      this.ctx.font = "45px 'Silkscreen', sans-serif";
      this.ctx.strokeStyle = "black";
      this.ctx.strokeText(
        `Scores: ${this.score.getScore()}`,
        canvasWidthMid,
        canvasHeightMid + 30,
      );
      this.ctx.fillStyle = "white";
      this.ctx.fillText(
        `Scores: ${this.score.getScore()}`,
        canvasWidthMid,
        canvasHeightMid + 30,
      );

      this.ctx.font = "45px 'Silkscreen', sans-serif";
      this.ctx.strokeStyle = "black";
      this.ctx.strokeText(
        `Best: ${this.score.getHighScore()}`,
        canvasWidthMid,
        canvasHeightMid + 80,
      );
      this.ctx.fillStyle = "yellow";
      this.ctx.fillText(
        `Best: ${this.score.getHighScore()}`,
        canvasWidthMid,
        canvasHeightMid + 80,
      );

      this.ctx.font = "25px 'Silkscreen', sans-serif";
      this.ctx.strokeStyle = "black";
      this.ctx.strokeText(
        "click to restart",
        canvasWidthMid,
        canvasHeightMid + 120,
      );
      this.ctx.fillStyle = "white";
      this.ctx.fillText(
        "click to restart",
        canvasWidthMid,
        canvasHeightMid + 120,
      );
    }
  }

  public loop = (timestamp: number) => {
    if (!this.running) {
      return;
    }

    // CLEAR CANVAS
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);

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
    if (this.gameState === GameState.PLAY && this.running) {
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
      if (this.fullSnake.length === 0) return;
      const head = this.fullSnake[0];
      if (
        this.applesOnField.length > 0 &&
        this.fullSnake[0].getCoordX() === this.applesOnField[0].getCoordX() &&
        this.fullSnake[0].getCoordY() === this.applesOnField[0].getCoordY()
      ) {
        this.applesEaten += 1;
        this.score.addScore(1);
        if (this.score.getScore() >= this.score.getHighScore()) {
          this.score.addHighScore(this.score.getScore());
          this.score.saveHighScore();
        }
        this.haveGrow = true;
        this.applesOnField = [];

        // SPAWN NEW APPLE
        this.spawnApple();

        if (this.applesEaten === 5) {
          this.spawnShit();
          this.applesEaten = 0;
        }
      }

      // SHIT HAPPENS
      for (const shit of this.shitOnField) {
        if (
          shit.getCoordX() === head.getCoordX() &&
          shit.getCoordY() === head.getCoordY()
        ) {
          this.stop();
        }
      }

      // WALL BONK
      if (
        head.getCoordX() < 0 ||
        head.getCoordY() < 0 ||
        head.getCoordX() >
          this.constants.canvasColumns * this.constants.tileSize ||
        head.getCoordY() > this.constants.canvasRows * this.constants.tileSize
      ) {
        this.stop();
      }

      // SNAKE SELF COLLISION
      this.fullSnake.slice(1).forEach((s) => {
        if (
          head.getCoordX() === s.getCoordX() &&
          head.getCoordY() === s.getCoordY()
        ) {
          this.stop();
        }
      });
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
    this.shitOnField.forEach((s) => s.draw(this.ctx));

    this.drawUI();
    // ENDLESS GAME LOOP
    this.animationID = requestAnimationFrame(this.loop);
  };
}
