// 005_tetris/src/entities/Game.ts

import type { BrickColor, FigureType, GameAssets, GameConstants, GameScreenState } from "../types/types";

import { BackgroundTile } from "./BackgroundTile";
import { HUD } from "./HUD";
import { Score } from "./Score";
import { drawText, drawLetters } from "../lib/drawText";
import { getRandomNumber } from "../lib/RandomNumber";
import { Figure } from "./Figure";

export class Game {
  private assets: GameAssets;
  private constants: GameConstants;
  private gameCtx: CanvasRenderingContext2D;
  private hudCtx: CanvasRenderingContext2D;
  private isRunningGameplay: boolean = true;
  private gameScreenState: GameScreenState = "menu";
  private animationID: number = 0;
  private lastAnimationFrameTime: number = 0;

  private gameGrid: number[][];

  private previousFigure: Figure;
  private currentFigure: Figure;
  private nextFigure: Figure;
  private figuresSet: FigureType[];
  private figuresColorsSet: BrickColor[];
  private figureOffsetX: number;
  private figureOffsetY: number;
  private figureMoveSpeed: number = 3;
  private figureMoveTimer: number = 0;
  private figureMoveStep: number;

  private score: Score;
  private backgroundTiles: BackgroundTile[][];
  private backgroundTilesCache: HTMLCanvasElement | null = null;
  private HUD: HUD;

  constructor(
    assets: GameAssets,
    constants: GameConstants,
    gameCtx: CanvasRenderingContext2D,
    hudCtx: CanvasRenderingContext2D,
  ) {
    this.assets = assets;
    this.constants = constants;
    this.gameCtx = gameCtx;
    this.hudCtx = hudCtx;

    // INIT GAME GRID
    this.gameGrid = this.initGameGrid(this.constants.gameGridWidth, this.constants.gameGridHeight);
    console.log("GAME GRID", this.gameGrid);

    // INIT BACKGROUND TILES
    const tilesArray: BackgroundTile[][] = [];
    for (let row = 0; row < this.constants.backgroundTileSize * this.constants.gameGridHeight; row += 1) {
      const tilesRow: BackgroundTile[] = [];
      for (let column = 0; column < this.constants.backgroundTileSize * this.constants.gameGridWidth; column += 1) {
        const positionX = column * this.constants.backgroundTileSize;
        const positionY = row * this.constants.backgroundTileSize;

        const backgroundTile = new BackgroundTile(
          this.assets.picsAssets.backgroundTile,
          positionX,
          positionY,
          this.constants.backgroundTileSize,
        );
        tilesRow.push(backgroundTile);
      }
      tilesArray.push(tilesRow);
    }
    this.backgroundTiles = tilesArray;
    this.createBackgroundCache();

    this.score = new Score();

    this.HUD = new HUD(this.assets.picsAssets.HUD, 0, 0, this.hudCtx.canvas.width, this.hudCtx.canvas.height);

    this.figuresSet = ["I", "J", "L", "O", "S", "T", "Z"];
    this.figuresColorsSet = ["blue", "green", "orange", "purple", "red", "yellow"];
    this.figureMoveStep = constants.brickSize;
    this.figureOffsetX = gameCtx.canvas.width / 2;
    this.figureOffsetY = 0 - constants.brickSize * 4;

    this.createFigure();

    // CONTROL LISTENERS
    window.addEventListener("keydown", (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        this.currentFigure.moveLeft(this.figureMoveStep);
      }
    });
    window.addEventListener("keydown", (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") {
        this.currentFigure.moveRight(this.figureMoveStep);
      }
    });
    window.addEventListener("keydown", (e: KeyboardEvent) => {
      if (e.key === "ArrowUp" && this.currentFigure.getFigureType() !== "O") {
        this.currentFigure.rotate();
      }
    });
    window.addEventListener("keydown", (e: KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        this.figureMoveSpeed = 20;
      }
    });
    window.addEventListener("keyup", (e: KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        this.figureMoveSpeed = 3;
      }
    });

    this.isRunningGameplay = true;
    this.loop(0);
  }

  public checkMoveAble(): true {
    return true;
  }

  private createBackgroundCache() {
    this.backgroundTilesCache = document.createElement("canvas");
    this.backgroundTilesCache.width = this.gameCtx.canvas.width;
    this.backgroundTilesCache.height = this.gameCtx.canvas.height;

    const cacheCTX = this.backgroundTilesCache.getContext("2d");

    if (!cacheCTX) {
      throw Error("No chache context");
    }

    for (let row of this.backgroundTiles) {
      for (let tile of row) {
        tile.draw(cacheCTX);
      }
    }
  }

  private initGameGrid(gridW: number, gridH: number): number[][] {
    const grid: number[][] = [];

    for (let i = 0; i < gridH; i += 1) {
      const gridRow: number[] = [];
      for (let j = 0; j < gridW; j += 1) {
        gridRow.push(0);
      }
      grid.push(gridRow);
    }

    return grid;
  }

  public createFigure(): void {
    const newFigureType = this.figuresSet[getRandomNumber(0, this.figuresSet.length - 1)];
    const newFigureColor = this.figuresColorsSet[getRandomNumber(0, this.figuresColorsSet.length - 1)];

    this.currentFigure = new Figure(
      newFigureType,
      newFigureColor,
      this.assets.picsAssets.bricks,
      this.constants,
      this.figureOffsetX,
      this.figureOffsetY,
    );
    console.log("Current figure: ", newFigureType);
  }

  public drawUI(): void {
    // DRAW HUD
    this.hudCtx.textAlign = "center";
    this.hudCtx.lineJoin = "round";
    this.hudCtx.lineWidth = 1;

    const lettersFont: string = "20px 'Silkscreen', sans-serif";

    const letters: string[] = ["T", "E", "T", "R", "I", "S"];
    const letterColors: string[] = ["#2D09F4", "#07B213", "#E7690F", "#DE13D9", "#F80A0A", "#EBDF0D"];
    const lettersGap: number = 25;
    let letterCoordX: number = 20;
    const letterCoordY: number = 50;
    const hudCanvasWidth = this.hudCtx.canvas.width;

    drawLetters(
      this.hudCtx,
      "center",
      letters,
      lettersFont,
      "#ffffff",
      letterColors,
      letterCoordX,
      letterCoordY,
      lettersGap,
    );

    drawText(this.hudCtx, "center", "score", lettersFont, "#000000", "#ffffff", hudCanvasWidth / 2, 120);
    drawText(
      this.hudCtx,
      "center",
      String(this.score.getScore()),
      lettersFont,
      "#000000",
      "#ffffff",
      hudCanvasWidth / 2,
      145,
    );
    drawText(this.hudCtx, "center", "high-score", lettersFont, "#000000", "#ffffff", hudCanvasWidth / 2, 175);
    drawText(
      this.hudCtx,
      "center",
      String(this.score.getHighScore()),
      lettersFont,
      "#000000",
      "#ffffff",
      hudCanvasWidth / 2,
      200,
    );

    // DRAW GAME STATE INFO
  }

  public start(): void {
    this.isRunningGameplay = true;
  }

  public stop(): void {
    this.isRunningGameplay = false;
    if (this.animationID !== null) {
      cancelAnimationFrame(this.animationID);
    }
  }

  public loop = (timestamp: number): void => {
    if (!this.isRunningGameplay) {
      return;
    }

    // CALCULATING DELTA
    if (this.lastAnimationFrameTime === 0) {
      this.lastAnimationFrameTime = timestamp;
    }
    const deltaTimeMS = timestamp - this.lastAnimationFrameTime;
    let delta = deltaTimeMS / 1000;
    if (delta > 0.1) {
      delta = 0.1;
    }

    this.gameCtx.clearRect(0, 0, this.gameCtx.canvas.width, this.gameCtx.canvas.height);
    this.hudCtx.clearRect(0, 0, this.hudCtx.canvas.width, this.hudCtx.canvas.height);

    // DROP FIGURE
    this.figureMoveTimer += this.figureMoveSpeed * delta;
    //console.log("Figure timer", this.figureMoveTimer);
    if (this.figureMoveTimer >= 10) {
      // this.figureOffsetY += this.figureMoveStep;
      this.currentFigure?.drop(this.figureMoveStep);
      this.figureMoveTimer = 0;
    }

    // DRAW OBJECTS
    if (this.backgroundTilesCache) {
      this.gameCtx.drawImage(this.backgroundTilesCache, 0, 0, this.gameCtx.canvas.width, this.gameCtx.canvas.height);
    }

    this.currentFigure?.draw(this.gameCtx);

    this.HUD.draw(this.hudCtx);

    this.drawUI();

    this.animationID = requestAnimationFrame(this.loop);
  };
}
