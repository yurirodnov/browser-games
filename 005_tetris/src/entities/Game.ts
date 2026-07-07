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

  private figuresSet: FigureType[];
  private figuresColorsSet: BrickColor[];
  private figureStartPositionX: number;
  private figureStartPositionY: number;
  private figureMoveSpeed: number = 1;
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

    window.addEventListener("mousedown", (e: MouseEvent) => {
      e.preventDefault();
      this.handleScrenClick();
    });

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
        this.figureMoveSpeed = 30;
      }
    });
    window.addEventListener("keyup", (e: KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        this.figureMoveSpeed = 1;
      }
    });

    this.isRunningGameplay = true;
    this.loop(0);
  }

  private handleScrenClick(): void {
    switch (this.gameScreenState) {
      case "menu":
        this.start();
        break;
      case "gameOver":
        this.restart();
        break;
    }
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

    const nextFigureType = this.figuresSet[getRandomNumber(0, this.figuresSet.length - 1)];
    const nextFigureColor = this.figuresColorsSet[getRandomNumber(0, this.figuresColorsSet.length - 1)];

    this.currentFigure = new Figure(
      newFigureType,
      newFigureColor,
      this.assets.picsAssets.bricks,
      this.constants,
      this.figureStartPositionX,
      this.figureStartPositionY,
      this.gameGrid,
    );

    //console.log("Current figure: ", newFigureType);
  }

  public landFigure(): void {
    if (this.currentFigure && this.gameGrid) {
      const gridY = Math.floor(this.currentFigure.getPositionY() / this.constants.brickSize);
      const gridX = Math.floor(this.currentFigure.getPositionX() / this.constants.brickSize);
      for (let i = 0; i < this.currentFigure.getFigureMatrix().length; i += 1) {
        for (let j = 0; j < this.currentFigure.getFigureMatrix()[i].length; j += 1) {
          if (this.currentFigure.getFigureMatrix()[i][j] === 1) {
            const cellX = gridX + j;
            const cellY = gridY + i;

            if (
              cellX >= 0 &&
              cellX < this.constants.gameGridWidth &&
              cellY >= 0 &&
              cellY < this.constants.gameGridHeight
            ) {
              this.gameGrid[cellY][cellX] =
                colorNumberMap[this.currentFigure.getFigureColor() as keyof ColorNumberMapType];
            } else if (cellY < 0) {
              this.stop();
            }
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

  public clearFullRows(): void {
    let rowsRemoved = 0;

    for (let i = this.gameGrid.length - 1; i >= 0; i -= 1) {
      if (!this.gameGrid[i].includes("0")) {
        this.gameGrid.splice(i, 1);
        rowsRemoved += 1;
      }
    }

    for (let i = 0; i < rowsRemoved; i += 1) {
      this.gameGrid.unshift(new Array(this.constants.gameGridWidth).fill("0"));
      this.score.addScore(100);
      if (this.score.getScore() > this.score.getHighScore()) {
        this.score.addHighScore();
      }
      this.score.saveHighScore();
    }
  }

  public drawGameScreen(): void {
    this.gameCtx.textAlign = "left";
    this.gameCtx.lineJoin = "round";
    this.gameCtx.lineWidth = 2;
    const tetrisLettersFont: string = "50px 'Silkscreen', sans-serif";
    const textLettersFont: string = "20px 'Silkscreen', sans-serif";
    const gameoverLettersFont: string = "35px 'Silkscreen', sans-serif";
    const gameCanvasWidth = this.gameCtx.canvas.width;
    const gameCanvasHeight = this.gameCtx.canvas.height;

    if (this.gameScreenState === "menu") {
      const letters: string[] = ["T", "E", "T", "R", "I", "S"];
      const letterColors: string[] = ["#2D09F4", "#07B213", "#E7690F", "#DE13D9", "#F80A0A", "#EBDF0D"];
      const lettersGap: number = 35;
      let letterCoordX: number = 40;
      const letterCoordY: number = 150;

      drawLetters(
        this.gameCtx,
        "center",
        letters,
        tetrisLettersFont,
        "#000000",
        letterColors,
        letterCoordX,
        letterCoordY,
        lettersGap,
      );

      drawText(
        this.gameCtx,
        "center",
        "click to start",
        textLettersFont,
        "#000000",
        "#EBDF0D",
        gameCanvasWidth / 2,
        190,
      );
    } else if (this.gameScreenState === "gameOver") {
      drawText(
        this.gameCtx,
        "center",
        "GAME OVER",
        gameoverLettersFont,
        "#ffffff",
        "#F80A0A",
        gameCanvasWidth / 2,
        gameCanvasHeight / 2,
      );
      drawText(
        this.gameCtx,
        "center",
        "click to restart",
        textLettersFont,
        "#000000",
        "#ffffff",
        gameCanvasWidth / 2,
        gameCanvasHeight / 2 + 30,
      );
    }
  }

  public drawHUD(): void {
    // DRAW HUD
    this.hudCtx.textAlign = "center";
    this.hudCtx.lineJoin = "round";
    this.hudCtx.lineWidth = 1;
    const lettersFont: string = "20px 'Silkscreen', sans-serif";
    const hudCanvasWidth = this.hudCtx.canvas.width;

    drawText(this.hudCtx, "center", "score", lettersFont, "#000000", "#ffffff", hudCanvasWidth / 2, 50);
    drawText(
      this.hudCtx,
      "center",
      String(this.score.getScore()),
      lettersFont,
      "#000000",
      "#ffffff",
      hudCanvasWidth / 2,
      80,
    );
    drawText(this.hudCtx, "center", "high-score", lettersFont, "#000000", "#ffffff", hudCanvasWidth / 2, 145);
    drawText(
      this.hudCtx,
      "center",
      String(this.score.getHighScore()),
      lettersFont,
      "#000000",
      "#ffffff",
      hudCanvasWidth / 2,
      175,
    );
  }

  public start(): void {
    this.isRunningGameplay = true;
    this.gameScreenState = "play";
    this.lastAnimationFrameTime = 0;
    this.figureMoveSpeed = 1;

    if (this.animationID !== null) {
      cancelAnimationFrame(this.animationID);
    }

    this.animationID = requestAnimationFrame(this.loop);
  }

  public stop(): void {
    this.isRunningGameplay = false;
    this.gameScreenState = "gameOver";
    if (this.animationID !== null) {
      cancelAnimationFrame(this.animationID);
    }
  }

  public restart(): void {
    this.isRunningGameplay = true;
    this.gameGrid = [];
    this.gameGrid = this.initGameGrid(this.constants.gameGridWidth, this.constants.gameGridHeight);
    this.figureStartPositionX = this.gameCtx.canvas.width / 2;
    this.figureStartPositionY = 0 - this.constants.brickSize * 4;
    this.score.resetScore();
    this.figureMoveTimer = 0;
    this.figureMoveSpeed = 1;
    this.lastAnimationFrameTime = 0;
    this.createFigure();
    console.log("NEW GRID", this.gameGrid);
    this.start();
  }

  public loop = (timestamp: number): void => {
    if (!this.isRunningGameplay) {
      return;
    }

    this.gameCtx.clearRect(0, 0, this.gameCtx.canvas.width, this.gameCtx.canvas.height);
    this.hudCtx.clearRect(0, 0, this.hudCtx.canvas.width, this.hudCtx.canvas.height);

    this.gameCtx.imageSmoothingEnabled = true;
    this.hudCtx.imageSmoothingEnabled = true;

    // CALCULATING DELTA
    if (this.lastAnimationFrameTime === 0) {
      this.lastAnimationFrameTime = timestamp;
    }
    const deltaTimeMS = timestamp - this.lastAnimationFrameTime;
    let delta = deltaTimeMS / 1000;
    if (delta > 0.1) {
      delta = 0.1;
    }

    if (this.backgroundTilesCache) {
      this.gameCtx.drawImage(this.backgroundTilesCache, 0, 0, this.gameCtx.canvas.width, this.gameCtx.canvas.height);
    }

    this.HUD.draw(this.hudCtx);

    if (this.gameScreenState === "play") {
      // DROP FIGURE
      this.figureMoveTimer += this.figureMoveSpeed * delta;

      if (this.figureMoveTimer >= 10) {
        if (this.currentFigure && this.currentFigure.canMoveDown()) {
          this.currentFigure.drop(this.figureMoveStep);
          this.figureMoveTimer = 0;
        } else {
          this.landFigure();
          this.clearFullRows();
          this.figureMoveTimer = 0;

          if (this.isRunningGameplay) {
            this.currentFigure = null;
            this.createFigure();
          }
        }
      }

      // CONTROL IF FIGURE BEYOND WALL
      // if (this.currentFigure) {
      //   this.currentFigure.shiftFigureIfBeyond();
      // }

      // DRAW OBJECTS

      this.drawDeadFigures(this.gameCtx);

      this.currentFigure?.draw(this.gameCtx);
    }

    this.drawGameScreen();

    this.drawHUD();

    this.animationID = requestAnimationFrame(this.loop);
  };
}
