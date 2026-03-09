// 002_flappy_bird/src/entities/Game.ts

import { GameState, type Assets, type Constants } from "../types/types";
import { Background } from "./Background";
import { Base } from "./Base";
import { Bird } from "./Bird";
import { Obstacle } from "./Obstacle";
import { Score } from "./Score";

export class Game {
  // GAME STATE
  private ctx: CanvasRenderingContext2D;
  private assets: Assets;
  private constants: Constants;
  private isRunning: boolean = false;
  private animationID: number | null = null;
  private lastFrameTime: number = 0;
  private dayDuration: number;
  private nightDuration: number;
  private lastDaySwitchedTime: number = 0;
  private isDay: boolean = false;
  private obstacleSpawnInterval: number = 1;
  private obstacleSpawnTimer: number = 0;
  private gameState: GameState = GameState.MENU;
  //private lastObstacleX: number = 0;
  // GAME PHYSICS
  private jump: boolean = false;

  // GAME ENTITIES
  private background: Background;
  private base: Base;
  private bird: Bird;
  private obstacles: Obstacle[] = [];
  private score: Score;

  // CONTROL KEYS
  // private controls: Controls = {
  //   click: MouseEvent,
  // };

  constructor(
    ctx: CanvasRenderingContext2D,
    assets: Assets,
    constants: Constants,
  ) {
    this.ctx = ctx;
    this.assets = assets;
    this.constants = constants;

    this.dayDuration = constants.dayDurationMs;
    this.nightDuration = constants.nightDurationMs;

    // CREATE CLASSES INTANCES
    this.background = new Background(
      this.assets.backgroundDay,
      0,
      0,
      this.constants.canvasWidth,
      this.constants.canvasHeight,
    );

    this.base = new Base(
      this.assets.base,
      0,
      this.constants.canvasHeight - this.constants.baseHeight,
      this.constants.canvasWidth,
      this.constants.baseHeight,
      this.constants,
    );
    this.bird = new Bird(
      this.assets.birdFrames,
      this.constants.birdSpawnX,
      this.constants.birdSpawnY,
      47,
      42,
    );
    this.score = new Score();

    // INIT KEYS LISTENERS
    // window.addEventListener("mousedown", (e: Event) => {
    //   e.preventDefault();
    //   this.jump = true;
    // });

    window.addEventListener("mousedown", (e: MouseEvent) => {
      e.preventDefault();
      this.handleInput();
    });

    this.isRunning = true;
    this.loop(0);
  }

  private handleInput(): void {
    switch (this.gameState) {
      case GameState.MENU:
        this.start();
        break;
      case GameState.PLAYING:
        this.jump = true;
        break;
      case GameState.GAME_OVER:
        this.restart();
    }
  }

  // DEFINE COLLISION CHECK FUNCTIONS
  checkScreenCollision = (bird: Bird, base: Base): boolean => {
    return bird.getCoordY() > base.getCooordY() || bird.getCoordY() < 0;
  };
  checkPipeCollision = (bird: Bird, obstacle: Obstacle): boolean => {
    const birdLeftEdge: number = bird.getCoordX();
    const birdRightEdge: number = bird.getCoordX() + bird.getWidth();
    const birdTop: number = bird.getCoordY();
    const birdBottom: number = bird.getCoordY() + bird.getHeight();

    const pipeLeftEdge: number = obstacle.getCoordX();
    const pipeRightEdge: number = obstacle.getCoordX() + obstacle.getWidth();

    const pipeUPTop: number = obstacle.getCoordYUP();
    const pipeUPBottom: number =
      obstacle.getCoordYUP() + obstacle.getHeightUP();
    const pipeDOWNTop: number = obstacle.getCoordYDOWN();
    const pipeDOWNBottom: number =
      obstacle.getCoordYDOWN() + obstacle.getHeightDOWN();

    if (birdRightEdge < pipeLeftEdge || birdLeftEdge > pipeRightEdge) {
      return false;
    }

    const hitUPPipe: boolean = birdBottom > pipeUPTop && birdTop < pipeUPBottom;

    const hitDOWNPipe: boolean =
      birdTop < pipeDOWNBottom && birdBottom > pipeDOWNTop;

    if (hitDOWNPipe || hitUPPipe) {
      return true;
    }

    return false;
  };

  public start(): void {
    this.isRunning = true;
    this.gameState = GameState.PLAYING;
    this.lastFrameTime = 0;
    this.bird.birdReset(this.constants.birdSpawnX, this.constants.birdSpawnY);
    this.obstacleSpawnTimer = 0;
    this.obstacles = [];
    this.score.resetScore();

    console.log(this.gameState);
  }

  public stop(): void {
    this.isRunning = false;
    this.gameState = GameState.GAME_OVER;
    if (this.animationID !== null) {
      cancelAnimationFrame(this.animationID);
    }
  }

  public restart(): void {
    this.obstacleSpawnTimer = 0;
    this.obstacles = [];
    this.start();
  }

  private drawUI() {
    const midX = this.constants.canvasWidth / 2;
    const midY = this.constants.canvasHeight / 2;

    this.ctx.save();

    this.ctx.textAlign = "center";
    this.ctx.lineJoin = "round";
    this.ctx.lineWidth = 4;

    if (this.gameState === GameState.MENU) {
      // GAME NAME
      this.ctx.font = "bold 50px 'Silkscreen', sans-serif";
      this.ctx.strokeStyle = "black";
      this.ctx.strokeText("FLAPPY BIRD", midX, midY - 40);

      this.ctx.fillStyle = "#FFD700";
      this.ctx.fillText("FLAPPY BIRD", midX, midY - 40);

      this.ctx.font = "20px 'Silkscreen', sans-serif";
      this.ctx.strokeStyle = "black";
      this.ctx.strokeText("click to start", midX, midY + 20);

      this.ctx.fillStyle = "white";
      this.ctx.fillText("click to start", midX, midY + 20);
    } else if (this.gameState === GameState.PLAYING) {
      this.ctx.textAlign = "left";

      this.ctx.font = "bold 24px 'Silkscreen', sans-serif";
      this.ctx.strokeStyle = "black";
      this.ctx.lineWidth = 3;

      this.ctx.strokeText(`Score: ${this.score.getScore()}`, 10, 30);
      this.ctx.fillStyle = "white";
      this.ctx.fillText(`Score: ${this.score.getScore()}`, 10, 30);

      this.ctx.strokeText(`Best: ${this.score.getHighScore()}`, 10, 60);
      this.ctx.fillStyle = "#FFD700";
      this.ctx.fillText(`Best: ${this.score.getHighScore()}`, 10, 60);
    } else if (this.gameState === GameState.GAME_OVER) {
      // DARK FADE
      this.ctx.fillStyle = "rgba(0, 0, 0, 0.6)";
      this.ctx.fillRect(
        0,
        0,
        this.constants.canvasWidth,
        this.constants.canvasHeight,
      );

      this.ctx.font = "bold 50px 'Silkscreen', sans-serif";
      this.ctx.strokeStyle = "black";
      this.ctx.strokeText("GAME OVER", midX, midY - 50);

      this.ctx.fillStyle = "#ff4444"; // Красный
      this.ctx.fillText("GAME OVER", midX, midY - 50);

      this.ctx.font = "bold 30px 'Silkscreen', sans-serif";
      this.ctx.strokeStyle = "black";
      this.ctx.strokeText(`Score: ${this.score.getScore()}`, midX, midY);

      this.ctx.fillStyle = "white";
      this.ctx.fillText(`Score: ${this.score.getScore()}`, midX, midY);

      this.ctx.font = "24px 'Silkscreen', sans-serif";
      this.ctx.strokeStyle = "black";
      this.ctx.strokeText(
        `Best: ${this.score.getHighScore()}`,
        midX,
        midY + 35,
      );

      this.ctx.fillStyle = "#FFD700";
      this.ctx.fillText(`Best: ${this.score.getHighScore()}`, midX, midY + 35);

      this.ctx.font = "20px 'Silkscreen', sans-serif";
      this.ctx.strokeStyle = "black";
      this.ctx.strokeText("Click to restat", midX, midY + 80);

      this.ctx.fillStyle = "white";
      this.ctx.fillText("Click to restat", midX, midY + 80);
    }

    this.ctx.restore();
  }

  private loop = (timestamp: number): void => {
    if (!this.isRunning) {
      return;
    }

    // CALCULATE DELTA
    if (this.lastFrameTime === 0) {
      this.lastFrameTime = timestamp;
      this.animationID = requestAnimationFrame(this.loop);
      return;
    }
    const deltaTimeMs: number = timestamp - this.lastFrameTime;
    let deltaTime: number = deltaTimeMs / 1000;
    if (deltaTime > 0.1) {
      deltaTime = 0.1;
    }
    this.lastFrameTime = timestamp;

    // CLEAR CANVAS
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);

    // GET CURRENT TIME
    const now = Date.now();

    if (this.gameState === GameState.PLAYING) {
      // DAY SWITCHING LOGIC
      if (!this.isDay && now - this.lastDaySwitchedTime > this.dayDuration) {
        this.isDay = true;
        this.lastDaySwitchedTime = now;
      } else if (
        this.isDay &&
        now - this.lastDaySwitchedTime > this.nightDuration
      ) {
        this.isDay = false;
        this.lastDaySwitchedTime = now;
      }

      // SWITCHING DAY/NIGHT BACKGROUND IMAGE
      if (this.isDay) {
        this.background.setImage(this.assets.backgroundDay);
      } else {
        this.background.setImage(this.assets.backgroundNight);
      }

      // SPAWNING OBSTACLES
      this.obstacleSpawnTimer += 1 * deltaTime;
      if (
        this.obstacles.length < 4 &&
        this.obstacleSpawnTimer >= this.obstacleSpawnInterval
      ) {
        const nextPipe = this.constants.canvasWidth;
        const pipesPlaces: string[] = ["UP", "DOWN"];
        const whichPipeBigger = Math.floor(Math.random() * 2);
        const howBig: number = Math.floor(Math.random() * 100 + 40);
        const basePipeHeight: number = this.constants.canvasHeight / 3.5;

        let pipeUPHeight: number;
        let pipeDOWNHeight: number;

        if (pipesPlaces[whichPipeBigger] === "UP") {
          pipeUPHeight = basePipeHeight + howBig;
          pipeDOWNHeight = basePipeHeight - howBig;

          const obstacle = new Obstacle(
            this.assets.pipeUP, // pipe up image
            this.assets.pipeDOWN, // pipe down image
            this.obstacles.length === 0
              ? nextPipe
              : this.obstacles[this.obstacles.length - 1].getCoordX() +
                  this.obstacles[this.obstacles.length - 1].getWidth() +
                  200, // pipe spawn coord X
            0, // pipe up spawn coord Y
            this.constants.canvasHeight -
              this.constants.baseHeight -
              pipeDOWNHeight, // pipe down spawn coord Y
            90,
            pipeUPHeight,
            pipeDOWNHeight,
            this.constants,
            // this.constants.canvasHeight / 2,
          );
          this.obstacles.push(obstacle);
        } else {
          pipeUPHeight = basePipeHeight - howBig;
          pipeDOWNHeight = basePipeHeight + howBig;

          const obstacle = new Obstacle(
            this.assets.pipeUP, // pipe up image
            this.assets.pipeDOWN, // pipe down image
            this.obstacles.length === 0
              ? nextPipe
              : this.obstacles[this.obstacles.length - 1].getCoordX() +
                  this.obstacles[this.obstacles.length - 1].getWidth() +
                  200, // pipe spawn coord X
            0, // pipe up spawn coord Y
            this.constants.canvasHeight -
              this.constants.baseHeight -
              pipeDOWNHeight, // pipe down spawn coord Y
            90,
            pipeUPHeight,
            pipeDOWNHeight,
            this.constants,
            // this.constants.canvasHeight / 2,
          );
          this.obstacles.push(obstacle);
        }
        this.obstacleSpawnTimer = 0;
      }

      // UPDATE OBJECTS IN A LOOP
      this.bird.update(this.jump, deltaTime);
      this.jump = false;
      this.base.update(deltaTime);

      this.obstacles.forEach((o) => {
        o.update(deltaTime);
        // EARNING SCORES
        const birdEdge = this.bird.getCoordX() + this.bird.getWidth();
        const obstacleEdge = o.getCoordX() + o.getWidth();

        if (!o.getPassed() && birdEdge > obstacleEdge) {
          this.score.addScore(1);
          o.setPassed();
          if (
            this.score.getHighScore() === 0 ||
            this.score.getScore() >= this.score.getHighScore()
          ) {
            this.score.addHighScore();
            this.score.saveHighScore();
          }
        }
      });

      // COLLISIONS CHECK
      this.obstacles.forEach((o) => {
        if (this.checkPipeCollision(this.bird, o)) {
          this.gameState = GameState.GAME_OVER;
        }
      });

      if (this.checkScreenCollision(this.bird, this.base)) {
        this.gameState = GameState.GAME_OVER;
      }
    }

    // DRAW OBJECTS IN A LOOP
    this.background.draw(this.ctx);
    this.base.draw(this.ctx);
    if (this.gameState !== GameState.MENU) {
      this.bird.draw(this.ctx);
    }
    this.obstacles = this.obstacles.filter(
      (o) => o.getCoordX() > -o.getWidth(),
    );
    this.obstacles.forEach((o) => o.draw(this.ctx));

    this.drawUI();

    // ENDLESS GAME LOOP
    this.animationID = requestAnimationFrame(this.loop);
  };
}
