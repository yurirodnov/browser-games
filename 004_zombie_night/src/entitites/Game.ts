// 004_zombie_night/src/entities/Game.ts

import type { Assets, Constants, GameState, SurvivorMovementState, SurvivorWeaponState } from "../types/type";
import { Background } from "./Background";
import { GroundTile } from "./GroundTile";
import { Survivor } from "./Survivor";
import { Strike } from "./Strike";
import { Shoot } from "./Shoot";

export class Game {
  private ctx: CanvasRenderingContext2D;
  private assets: Assets;
  private constants: Constants;
  private running: boolean = true;
  private gameState: GameState = "play";
  private animationID: number = 0;
  private lastFrameTime: number = 0;

  private worldSize: number = 0;
  private worldOffset: number = 0;
  private maxWorldOffset: number = 0;

  private survivorMovementState: SurvivorMovementState = "stop";
  private speed: number = 280;
  private lastDirection: string = "left";

  private survivorWeaponState: SurvivorWeaponState = "shotgun";
  private survivorKnifeTimer: number = 0;
  private survivorKnifeCooldown: number = 0;

  private survivorShootTimer: number = 0;
  private survivorShootCooldown: number = 0;

  private zombieSpawnTimer: number = 0;

  private bullets: number = 2;
  private lifes: number;

  private groundTiles: GroundTile[];
  private survivor: Survivor;
  private background: Background;
  private strike: Strike | null = null;
  private shoot: Shoot | null = null;

  constructor(ctx: CanvasRenderingContext2D, assets: Assets, constants: Constants) {
    this.ctx = ctx;
    this.assets = assets;
    this.constants = constants;

    // SET CHARACTER RESOURCES
    this.bullets = 2;
    this.lifes = 3;

    // WORLD SIZE
    this.worldSize = this.ctx.canvas.width * 2;
    this.worldOffset = -ctx.canvas.width / 2;
    this.maxWorldOffset = this.worldOffset * 2;

    // INIT GAME ENTITIES
    // INIT BACKGROUND
    this.background = new Background(this.assets.background, 0, 0, this.ctx.canvas.width * 2, this.ctx.canvas.height);

    // INIT GROUND
    const groundTilesArray: GroundTile[] = [];
    const groundHeight = this.ctx.canvas.height - this.constants.tileSize;
    const totalTiles = Math.ceil(this.worldSize / this.constants.tileSize);
    for (let i = 0; i < totalTiles; i++) {
      const x = i * this.constants.tileSize;

      const groundTile = new GroundTile(this.assets.ground, x, groundHeight, this.constants.tileSize, this.constants.tileSize);
      groundTilesArray.push(groundTile);
    }
    this.groundTiles = groundTilesArray;

    // INIT PLAYER
    this.survivor = new Survivor(
      this.assets.survivor,
      this.ctx.canvas.width / 2 - this.constants.playerWidth / 2,
      this.ctx.canvas.height - this.constants.tileSize - this.constants.playerHeight,
      this.constants.playerWidth,
      this.constants.playerHeight,
      this.constants.shootSize,
    );

    window.addEventListener("keydown", (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        this.lastDirection = "left";
        this.survivorMovementState = "left";
      }
    });
    window.addEventListener("keydown", (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") {
        this.lastDirection = "right";
        this.survivorMovementState = "right";
      }
    });
    window.addEventListener("keyup", (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
        this.survivorMovementState = "stop";
      }
    });

    // ATTACK INPUT
    window.addEventListener("keydown", (e: KeyboardEvent) => {
      if (e.key === "d" && this.survivorMovementState === "stop" && this.survivorWeaponState === "shotgun" && this.survivorKnifeCooldown <= 0) {
        this.useKnife();
      }
    });

    window.addEventListener("keydown", (e: KeyboardEvent) => {
      if (
        e.key === "a" &&
        this.survivorMovementState === "stop" &&
        this.survivorWeaponState === "shotgun" &&
        this.survivorShootCooldown <= 0 &&
        this.bullets > 0
      ) {
        this.useShotgun();
      }
    });

    window.addEventListener("mousedown", (e: MouseEvent) => {
      e.preventDefault();
      this.handleInput();
    });

    // START GAME ON GAME INSTANCE CREATION
    this.running = true;
    this.loop(0);
  }

  private useKnife(): void {
    this.survivorWeaponState = "knife";
    this.survivorKnifeTimer = 0.2;
    this.survivorKnifeCooldown = 1.3;

    if (this.lastDirection === "left") {
      this.strike = new Strike(this.assets.strike, this.survivor.getLeftStrikeCoordsX(), this.survivor.getStrikeCoordsY(), 80, 80, this.lastDirection);
    } else if (this.lastDirection === "right") {
      this.strike = new Strike(this.assets.strike, this.survivor.getRightStrikeCoordsX(), this.survivor.getStrikeCoordsY(), 80, 80, this.lastDirection);
    }

    console.log(this.lastDirection);
    console.log(this.strike);
  }
  private useShotgun(): void {
    this.survivorShootTimer = 0.2;
    this.survivorShootCooldown = 1.3;

    if (this.lastDirection === "left") {
      this.shoot = new Shoot(
        this.assets.shoot,
        this.survivor.getShootLeftCoordsX() - this.constants.shootSize,
        this.survivor.getShootCoordsY(),
        this.constants.shootSize,
        this.constants.shootSize,
        this.lastDirection,
      );
    } else if (this.lastDirection === "right") {
      this.shoot = new Shoot(
        this.assets.shoot,
        this.survivor.getShootRightCoordsX(),
        this.survivor.getShootCoordsY(),
        this.constants.shootSize,
        this.constants.shootSize,
        this.lastDirection,
      );
    }
  }

  private handleInput(): void {
    switch (this.gameState) {
      case "menu":
        this.start();
        break;
      case "gameOver":
        this.restart();
        break;
    }
  }

  public start() {
    this.running = true;
    this.gameState = "play";
    this.lastFrameTime = 0;
    this.animationID = requestAnimationFrame(this.loop);
  }

  public stop() {
    this.running = false;
    this.gameState = "gameOver";
    if (this.animationID !== null) {
      cancelAnimationFrame(this.animationID);
    }
  }

  public restart() {
    this.start();
  }

  private drawUI() {
    this.ctx.textAlign = "center";
    this.ctx.lineJoin = "round";
    this.ctx.lineWidth = 3;

    if (this.gameState === "menu") {
      ////
    } else if (this.gameState === "play") {
      // DRAW BULLET ICON
      this.ctx.drawImage(this.assets.bullet, 35, 20, 30, 60);
      this.ctx.font = "25px 'Silkscreen', sans-serif";
      this.ctx.strokeStyle = "black";
      this.ctx.strokeText("x", 90, 55);
      this.ctx.fillStyle = "white";
      this.ctx.fillText("x", 90, 55);
      this.ctx.font = "45px 'Silkscreen', sans-serif";
      this.ctx.strokeStyle = "black";
      this.ctx.strokeText(this.bullets.toString(), 130, 60);
      this.ctx.fillStyle = "white";
      this.ctx.fillText(this.bullets.toString(), 130, 60);

      // DRAW LIFE ICON
      // this.ctx.drawImage(this.assets.life, 20, 100, 60, 50);
    } else {
      ////
    }
  }

  public loop = (timestamp: number) => {
    if (!this.running) {
      return;
    }

    // CLEAR CANVAS
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);

    // DISABLE PICS BLURING
    this.ctx.imageSmoothingEnabled = false;

    // CALCULATE DELTA
    if (this.lastFrameTime === 0) {
      this.lastFrameTime = timestamp;
    }
    const deltaTimeMS: number = timestamp - this.lastFrameTime;
    let delta: number = deltaTimeMS / 1000;
    if (delta > 0.1) {
      delta = 0.1;
    }
    this.lastFrameTime = timestamp;

    // RESET KNIFE TIMER
    // console.log("Knife timer", this.survivorKnifeTimer);
    // console.log("Knife cooldown", this.survivorKnifeCooldown);
    if (this.survivorKnifeTimer > 0) {
      this.survivorKnifeTimer -= 1 * delta;
    }
    if (this.survivorKnifeTimer <= 0) {
      this.survivorWeaponState = "shotgun";
      this.strike = null;
    }
    if (this.survivorKnifeCooldown >= 0) {
      this.survivorKnifeCooldown -= 1 * delta;
    }

    // SHOOT TIMER
    if (this.survivorShootTimer > 0) {
      this.survivorShootTimer -= 1 * delta;
    }
    if (this.survivorShootTimer <= 0) {
      this.shoot = null;
    }
    if (this.survivorShootCooldown >= 0) {
      this.survivorShootCooldown -= 1 * delta;
    }

    // UPDATE OBJECTS

    // MOVE SCREEN
    if (
      this.survivorMovementState === "left" &&
      this.worldOffset <= 0 &&
      this.survivor.getCoordX() >= this.ctx.canvas.width / 2 - 50 &&
      this.survivor.getCoordX() <= this.ctx.canvas.width / 2
    ) {
      this.worldOffset += this.speed * delta;
    } else if (
      this.survivorMovementState === "right" &&
      this.worldOffset >= this.maxWorldOffset &&
      this.survivor.getCoordX() >= this.ctx.canvas.width / 2 - 50 &&
      this.survivor.getCoordX() <= this.ctx.canvas.width / 2
    ) {
      this.worldOffset -= this.speed * delta;
    }

    // TURN SURVIVOR
    this.survivor.changeDirection(this.survivorMovementState);

    // ANIMATE SURVIVOR
    this.survivor.changeAnimation(this.survivorWeaponState, this.survivorMovementState, delta, this.lastDirection);

    // MOVE SURVIVOR
    if (this.worldOffset >= 0 || this.worldOffset <= this.maxWorldOffset) {
      this.survivor.changePosition(this.speed, delta, this.survivorMovementState, this.ctx.canvas.width);
    }

    // DRAW ASSETS
    this.background.draw(this.ctx, this.worldOffset);
    for (const tile of this.groundTiles) {
      tile.draw(this.ctx, this.worldOffset);
    }
    this.survivor.draw(this.ctx);
    if (this.survivorKnifeTimer > 0 && this.strike) {
      this.strike.draw(this.ctx);
    }
    if (this.survivorShootTimer > 0 && this.shoot) {
      this.shoot.draw(this.ctx);
    }

    // DRAW UI
    this.drawUI();

    // GAME LOOP
    this.animationID = requestAnimationFrame(this.loop);
  };
}
