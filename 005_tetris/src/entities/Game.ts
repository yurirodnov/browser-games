// 005_tetris/src/entities/Game.ts

import type { BrickColor, FigureType, GameAssets, GameConstants, GameScreenState } from "../types/types";

import { Background } from "./Background";
import { HUD } from "./HUD";
import { Score } from "./Score";
import { drawText, drawLetters } from "../lib/drawText";
import { getRandomNumber } from "../lib/RandomNumber";

export class Game {
  private assets: GameAssets;
  private constants: GameConstants;
  private gameCtx: CanvasRenderingContext2D;
  private hudCtx: CanvasRenderingContext2D;
  private isRunningGameplay: boolean = true;
  private gameScreenState: GameScreenState = "menu";
  private animationID: number = 0;
  private lastAnimationFrameTime: number = 0;

  private gameGrid: string[][];

  private figuresSet: FigureType[];
  private figuresColorsSet: BrickColor[];
  private figureStartX: number;
  private figureStartY: number;
  private previousFigure: FigureType;
  private currentFigure: FigureType;
  private nextFigure: FigureType;

  private figureMoveSpeed: number = 2;
  private figureMoveTimer: number = 0;

  private score: Score;
  private background: Background;
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

    this.background = new Background(
      this.assets.picsAssets.background,
      0,
      0,
      this.gameCtx.canvas.width,
      this.gameCtx.canvas.height,
    );

    this.score = new Score();

    this.HUD = new HUD(this.assets.picsAssets.HUD, 0, 0, this.hudCtx.canvas.width, this.hudCtx.canvas.height);

    // INIT FIELD
    this.gameGrid = this.initGameGrid(this.constants.gameGridWidth, this.constants.gameGridHeight);
    console.log("GAME FIELD", this.gameGrid);

    this.figuresSet = ["I", "J", "L", "O", "S", "T", "Z", "."];
    this.figuresColorsSet = ["blue", "green", "orange", "purple", "red", "yellow"];

    this.figureStartX = gameCtx.canvas.width / 2;
    this.figureStartY = 0;

    // CONTROL LISTENERS
    window.addEventListener("keydown", (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        console.log("Left");
      }
    });
    window.addEventListener("keydown", (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") {
        console.log("Right");
      }
    });
    window.addEventListener("keydown", (e: KeyboardEvent) => {
      if (e.key === "ArrowUp") {
        console.log("Rotate");
      }
    });
    window.addEventListener("keydown", (e: KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        console.log("Fall");
      }
    });

    window.addEventListener("keydown", (e: KeyboardEvent) => {});

    window.addEventListener("keydown", (e: KeyboardEvent) => {});

    window.addEventListener("keydown", (e: KeyboardEvent) => {});

    this.isRunningGameplay = true;
    this.loop(0);
  }

  private initGameGrid(gridW: number, gridH: number): string[][] {
    const grid: string[][] = [];

    for (let i = 0; i < gridH; i += 1) {
      const gridRow: string[] = [];
      for (let j = 0; j < gridW; j += 1) {
        gridRow.push("0");
      }
      grid.push(gridRow);
    }

    return grid;
  }

  public checkCollision(): boolean {
    return true;
  }

  public createFigure(): void {
    const newFigureType = this.figuresSet[getRandomNumber(0, this.figuresSet.length - 1)];
    const newFigureColor = this.figuresColorsSet[getRandomNumber(0, this.figuresColorsSet.length - 1)];
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

    // SPAWN FIGURE

    // DRAW OBJECTS
    this.background.draw(this.gameCtx);
    this.HUD.draw(this.hudCtx);

    this.drawUI();

    this.animationID = requestAnimationFrame(this.loop);
  };
}
