// 005_tetris/src/entities/Game.ts

import type {
  BrickColor,
  FigureType,
  GameAssets,
  GameConstants,
  GameScreenState,
  GameGridMatrix,
  ColorNumberMapType,
  NumberColorMapType,
  BricksAssets,
} from "../types/types";

import { BackgroundTile } from "./BackgroundTile";
import { HUD } from "./HUD";
import { Score } from "./Score";
import { drawText, drawLetters } from "../lib/drawText";
import { getRandomNumber } from "../lib/RandomNumber";
import { colorNumberMap, numberColorMap } from "../lib/ColorNumberMaps";
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

  private gameGrid: GameGridMatrix;

  private currentFigure: Figure | null = null;
  //private nextFigure: Figure;
  private figuresSet: FigureType[];
  private figuresColorsSet: BrickColor[];
  private figureStartPositionX: number;
  private figureStartPositionY: number;
  private figureMoveSpeed: number = 2;
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
    //console.log("GAME GRID", this.gameGrid);

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
    this.figureStartPositionX = gameCtx.canvas.width / 2;
    this.figureStartPositionY = 0 - constants.brickSize * 4;

    this.createFigure();

    // CONTROL LISTENERS
    window.addEventListener("keydown", (e: KeyboardEvent) => {
      if (this.currentFigure && this.currentFigure.canMoveLeft() && e.key === "ArrowLeft") {
        this.currentFigure.moveLeft(this.figureMoveStep);
        // console.log("Figure position X:", this.currentFigure.getPositionX());
        // console.log("Figure matrix:", this.currentFigure.getFigureMatrix());
      }
    });
    window.addEventListener("keydown", (e: KeyboardEvent) => {
      if (this.currentFigure && this.currentFigure.canMoveRight() && e.key === "ArrowRight") {
        this.currentFigure.moveRight(this.figureMoveStep);
        // console.log("Figure position X:", this.currentFigure.getPositionX());
        // console.log("Figure matrix:", this.currentFigure.getFigureMatrix());
      }
    });
    window.addEventListener("keydown", (e: KeyboardEvent) => {
      if (this.currentFigure && e.key === "ArrowUp" && this.currentFigure.getFigureType() !== "O") {
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
        this.figureMoveSpeed = 2;
      }
    });

    this.isRunningGameplay = true;
    this.loop(0);
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

  private initGameGrid(gridW: number, gridH: number): GameGridMatrix {
    const grid: GameGridMatrix = [];

    for (let i = 0; i < gridH; i += 1) {
      const gridRow: string[] = [];
      for (let j = 0; j < gridW; j += 1) {
        gridRow.push("0");
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
      this.figureStartPositionX,
      this.figureStartPositionY,
      this.gameGrid,
    );
    console.log("Current figure: ", newFigureType);
  }

  public landFigure(): void {
    if (this.currentFigure && this.gameGrid) {
      const gridY = Math.floor(this.currentFigure.getPositionY() / this.constants.brickSize);
      const gridX = Math.floor(this.currentFigure.getPositionX() / this.constants.brickSize);
      for (let i = 0; i < this.currentFigure.getFigureMatrix().length; i += 1) {
        for (let j = 0; j < this.currentFigure.getFigureMatrix()[i].length; j += 1) {
          if (this.currentFigure.getFigureMatrix()[i][j] === 1) {
            this.gameGrid[gridY + i][gridX + j] =
              colorNumberMap[this.currentFigure.getFigureColor() as keyof ColorNumberMapType];
          }
        }
      }
    }

    console.log("New grid:", this.gameGrid);
  }

  public drawDeadFigures(ctx: CanvasRenderingContext2D): void {
    for (let i = 0; i < this.gameGrid.length; i += 1) {
      for (let j = 0; j < this.gameGrid[i].length; j += 1) {
        if (this.gameGrid[i][j] !== "0") {
          ctx.drawImage(
            this.assets.picsAssets.bricks[
              numberColorMap[this.gameGrid[i][j] as keyof NumberColorMapType] as keyof BricksAssets
            ],
            j * this.constants.brickSize,
            i * this.constants.brickSize,
            this.constants.brickSize,
            this.constants.brickSize,
          );
        }
      }
    }
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
      if (this.currentFigure && this.currentFigure.canMoveDown()) {
        // this.figureStartPositionY += this.figureMoveStep;
        this.currentFigure.drop(this.figureMoveStep);
        this.figureMoveTimer = 0;
      } else {
        this.landFigure();
        this.figureMoveTimer = 0;
        this.currentFigure = null;
        this.createFigure();
      }
    }

    // CONTROL IF FIGURE BEYOND WALL
    // if (this.currentFigure) {
    //   this.currentFigure.shiftFigureIfBeyond();
    // }

    // DRAW OBJECTS
    if (this.backgroundTilesCache) {
      this.gameCtx.drawImage(this.backgroundTilesCache, 0, 0, this.gameCtx.canvas.width, this.gameCtx.canvas.height);
    }

    this.currentFigure?.draw(this.gameCtx);

    this.drawDeadFigures(this.gameCtx);

    this.HUD.draw(this.hudCtx);

    this.drawUI();

    this.animationID = requestAnimationFrame(this.loop);
  };
}
