// 005_tetris/src/entities/Game.ts

import type { FigureType, GameAssets, GameConstants, GameScreenState } from "../types/types";
import type { Brick } from "./Brick";
import { Background } from "./Background";
import { HUD } from "./HUD";
import { Score } from "./Score";
import { drawText, drawLetters } from "../lib/drawText";

export class Game {
  private assets: GameAssets;
  private constants: GameConstants;
  private gameCtx: CanvasRenderingContext2D;
  private hudCtx: CanvasRenderingContext2D;
  private isRunningGameplay: boolean = true;
  private gameScreenState: GameScreenState = "menu";
  private animationID: number = 0;
  private lastAnimationFrameTime: number = 0;

  // private previousFigure: FigureType;
  // private currentFigure: FigureType;
  // private nextFigure: FigureType;

  private bricks: Brick[] = [];
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

  public createFigure(): void {}

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

    // for (let i = 0; i < letters.length; i += 1) {
    //   this.hudCtx.font = lettersFont;
    //   this.hudCtx.strokeStyle = "#ffffff";
    //   this.hudCtx.strokeText(letters[i], letterCoordX, letterCoordY);
    //   this.hudCtx.fillStyle = letterColors[i];
    //   this.hudCtx.fillText(letters[i], letterCoordX, letterCoordY);

    //   letterCoordX += lettersGap;
    // }

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
      140,
    );
    drawText(this.hudCtx, "center", "high-score", lettersFont, "#000000", "#ffffff", hudCanvasWidth / 2, 170);
    drawText(
      this.hudCtx,
      "center",
      String(this.score.getHighScore()),
      lettersFont,
      "#000000",
      "#ffffff",
      hudCanvasWidth / 2,
      190,
    );

    // DRAW GAME STATE INFO
  }

  public start(): void {
    this.isRunningGameplay = true;
  }

  public stop(): void {
    this.isRunningGameplay = false;
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

    // DRAW OBJECTS
    this.background.draw(this.gameCtx);
    this.HUD.draw(this.hudCtx);

    this.drawUI();

    this.animationID = requestAnimationFrame(this.loop);
  };
}
