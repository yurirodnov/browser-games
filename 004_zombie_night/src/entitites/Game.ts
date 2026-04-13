// 004_zombie_night/src/entities/Game.ts

import type { Assets, Constants, GameState, SurvivorMovementState, SurvivorWeaponState } from "../types/type";
import { Background } from "./Background";
import { GroundTile } from "./GroundTile";
import { Survivor } from "./Survivor";
import { Strike } from "./Strike";
import { Shoot } from "./Shoot";
import { Zombie } from "./Zombie";
import { Projectile } from "./Projectile";
import { Blood } from "./Blood";
import { getRandomNumber } from "../lib/GetRandomNumber";
import { Ammo } from "./Ammo";
import { ZombieDeath } from "./ZombieDeath";
import { Score } from "./Score";

export class Game {
  private ctx: CanvasRenderingContext2D;
  private assets: Assets;
  private constants: Constants;
  private running: boolean = true;
  private gameState: GameState = "menu";
  private animationID: number = 0;
  private lastFrameTime: number = 0;

  private dyingTimer: number = 0;
  private dyingDuration: number = 2;

  private worldSize: number = 0;
  private worldOffset: number = 0;
  private maxWorldOffset: number = 0;

  private isSurvivorSurvived!: boolean;
  private survivorMovementState: SurvivorMovementState = "stop";
  private survivorMovementSpeed: number = 280;
  private lastDirection: string = "left";

  private survivorWeaponState: SurvivorWeaponState = "shotgun";
  private survivorKnifeTimer: number = 0;
  private survivorKnifeCooldown: number = 0;

  private survivorShootTimer: number = 0;
  private survivorShootCooldown: number = 0;
  private bullets: number;
  private zombieBufferHibox: number = 40;

  private zombies: Zombie[] = [];
  private zombieDeathAnimation: ZombieDeath[] = [];
  private zombieSpawnInterval: number = 35;
  private zombieSpawnTimer: number = 0;
  private zombieSpawnSpeed: number = 10;
  private zombieSpawnSides: string[] = ["left", "right"];
  private zombieTypes: string[] = ["green", "yellow", "red"];
  private leftZombieSpawnCoords: number;
  private rightZombieSpawnCoords: number;

  // ENTITIES
  private groundTiles: GroundTile[];
  private survivor!: Survivor;
  private background: Background;
  private strike: Strike | null = null;
  private shoot: Shoot | null = null;
  private projectiles: Projectile[] = [];
  private bloods: Blood[] = [];
  private ammo: Ammo[] = [];
  private score: Score;

  constructor(ctx: CanvasRenderingContext2D, assets: Assets, constants: Constants) {
    this.ctx = ctx;
    this.assets = assets;

    this.constants = constants;

    // SET CHARACTER RESOURCES
    this.bullets = 3;

    this.score = new Score();

    // WORLD SIZE
    this.worldSize = this.ctx.canvas.width * 2;
    this.worldOffset = -ctx.canvas.width / 2;
    this.maxWorldOffset = this.worldOffset * 2;

    // ZOMBIE SPAM CONSTANTS
    this.leftZombieSpawnCoords = this.worldOffset;
    this.rightZombieSpawnCoords = this.worldSize;

    // INIT GAME ENTITIES
    // INIT BACKGROUND
    this.background = new Background(this.assets.background, 0, 0, this.ctx.canvas.width * 2, this.ctx.canvas.height);

    // INIT GROUND
    const groundTilesArray: GroundTile[] = [];
    const groundHeight = this.ctx.canvas.height - this.constants.tileSize;
    const totalTiles = Math.ceil(this.worldSize / this.constants.tileSize);
    for (let i = 0; i < totalTiles; i++) {
      const x = i * this.constants.tileSize;

      const groundTile = new GroundTile(
        this.assets.ground,
        x,
        groundHeight,
        this.constants.tileSize,
        this.constants.tileSize,
      );
      groundTilesArray.push(groundTile);
    }
    this.groundTiles = groundTilesArray;

    // INIT PLAYER

    this.initSurvivor();

    window.addEventListener("keydown", (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft" && this.isSurvivorSurvived) {
        this.lastDirection = "left";
        this.survivorMovementState = "left";
      }
    });
    window.addEventListener("keydown", (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" && this.isSurvivorSurvived) {
        this.lastDirection = "right";
        this.survivorMovementState = "right";
      }
    });
    window.addEventListener("keyup", (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft" || (e.key === "ArrowRight" && this.isSurvivorSurvived)) {
        this.survivorMovementState = "stop";
      }
    });

    // ATTACK INPUT
    window.addEventListener("keydown", (e: KeyboardEvent) => {
      if (
        e.key === "d" &&
        this.isSurvivorSurvived &&
        this.survivorMovementState === "stop" &&
        this.survivorWeaponState === "shotgun" &&
        this.survivorKnifeCooldown <= 0 &&
        this.gameState === "play"
      ) {
        this.useKnife();
        // console.log("Last direction", this.lastDirection);
      }
    });

    window.addEventListener("keydown", (e: KeyboardEvent) => {
      if (
        e.key === "a" &&
        this.isSurvivorSurvived &&
        this.survivorMovementState === "stop" &&
        this.survivorWeaponState === "shotgun" &&
        this.survivorShootCooldown <= 0 &&
        this.bullets > 0 &&
        this.gameState === "play"
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

  private initSurvivor(): void {
    this.survivor = new Survivor(
      this.assets.survivor,
      this.ctx.canvas.width / 2 - this.constants.playerWidth / 2,
      this.ctx.canvas.height - this.constants.tileSize - this.constants.playerHeight,
      this.constants.playerWidth,
      this.constants.playerHeight,
      this.constants.shootSize,
    );
    this.isSurvivorSurvived = true;
  }

  private dropAmmo(chance: number, x: number, y: number): void {
    const randomNumber: number = getRandomNumber(1, 100);

    if (randomNumber <= chance) {
      const ammoBox = new Ammo(this.assets.ammo, x, y, this.constants.ammoSize);
      this.ammo.push(ammoBox);

      console.log(`AMMO DROPPED AT X ${ammoBox.getCoordX()} AND ITS WIDTH IS ${ammoBox.getWidth()}`);
    }

    return;
  }

  private pickAmmo(ammoBox: Ammo): void {
    this.bullets += 1;
    ammoBox.setPicked();
  }

  private showBlood(coordX: number, coordY: number): void {
    const blood = new Blood(this.assets.blood, coordX, coordY, this.constants.bloodSize);
    this.bloods.push(blood);
    console.log("BLOODZ", this.bloods);
  }

  private handleSurvivorDeath(): void {
    const survivorScreamSound = this.assets.sounds.survivorScreamSound;
    survivorScreamSound.play();
    const zombieEatSound = this.assets.sounds.zombieEatSound;
    zombieEatSound.play();

    this.isSurvivorSurvived = false;
    this.survivorMovementState = "stop";
    this.gameState = "dying";
    this.dyingTimer = this.dyingDuration;
  }

  private showZombieDeath(x: number, y: number): void {
    const zombieDeath = new ZombieDeath(this.assets.zombieDeath, x, y, this.constants.zombieDeathSize);
    this.zombieDeathAnimation.push(zombieDeath);
  }

  private spawnZombie(): void {
    const spawnSide = this.zombieSpawnSides[getRandomNumber(0, 1)];
    const spawnZombieType = this.zombieTypes[getRandomNumber(0, this.zombieTypes.length - 1)];
    const zombie = new Zombie(
      this.assets.zombies,
      spawnSide === "left"
        ? this.leftZombieSpawnCoords + this.constants.zombieWidth * 2
        : this.rightZombieSpawnCoords + this.constants.zombieWidth * 2,
      spawnSide,
      this.ctx.canvas.height - this.constants.tileSize - this.constants.playerHeight,
      this.constants.zombieWidth,
      this.constants.zombieHeight,
      spawnZombieType,
    );

    console.log(`Spawn ${spawnZombieType} ${spawnSide} zombie at ${zombie.getCoordX()}`, zombie);

    this.zombies.push(zombie);
  }

  // USE WEAPON METHODS
  private useKnife(): void {
    const knifeSwingSound = this.assets.sounds.knifeSwingSound;
    knifeSwingSound.play();
    this.survivorWeaponState = "knife";
    this.survivorKnifeTimer = 0.2;
    this.survivorKnifeCooldown = 1.3;

    if (this.lastDirection === "left") {
      this.strike = new Strike(
        this.assets.strike,
        this.survivor.getLeftStrikeCoordsX(),
        this.survivor.getStrikeCoordsY(),
        80,
        80,
        this.lastDirection,
      );
    } else if (this.lastDirection === "right") {
      this.strike = new Strike(
        this.assets.strike,
        this.survivor.getRightStrikeCoordsX(),
        this.survivor.getStrikeCoordsY(),
        80,
        80,
        this.lastDirection,
      );
    }

    console.log(`Strike x is ${this.strike?.getCoordX()} and worldOffset is ${this.worldOffset}`);
  }

  private useShotgun(): void {
    this.survivorShootTimer = 0.1;
    this.survivorShootCooldown = 1.3;

    const shootStartPoint = {
      left: {
        x: this.survivor.getShootLeftCoordsX() - this.constants.shootSize,
        y: this.survivor.getShootCoordsY(),
      },
      right: {
        x: this.survivor.getShootRightCoordsX(),
        y: this.survivor.getShootCoordsY(),
      },
    };

    let projectile: null | Projectile = null;

    if (this.lastDirection === "left") {
      this.shoot = new Shoot(
        this.assets.shoot,
        shootStartPoint.left.x,
        shootStartPoint.left.y,
        this.constants.shootSize,
        this.constants.shootSize,
        this.lastDirection,
      );

      projectile = new Projectile(
        this.assets.projectile,
        shootStartPoint.left.x,
        shootStartPoint.left.y,
        30,
        30,
        this.lastDirection,
      );
      this.projectiles.push(projectile);
    } else if (this.lastDirection === "right") {
      this.shoot = new Shoot(
        this.assets.shoot,
        shootStartPoint.right.x,
        shootStartPoint.right.y,
        this.constants.shootSize,
        this.constants.shootSize,
        this.lastDirection,
      );

      projectile = new Projectile(
        this.assets.projectile,
        shootStartPoint.right.x,
        shootStartPoint.right.y,
        30,
        30,
        this.lastDirection,
      );
      this.projectiles.push(projectile);
    }

    const shootSound = this.assets.sounds.shootSound;
    shootSound.play();

    this.bullets -= 1;
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

  public start(): void {
    this.running = true;
    this.gameState = "play";
    this.lastFrameTime = 0;
    this.animationID = requestAnimationFrame(this.loop);
  }

  public stop(): void {
    this.running = false;
    this.gameState = "gameOver";
    if (this.animationID !== null) {
      cancelAnimationFrame(this.animationID);
    }
  }

  public restart(): void {
    this.worldOffset = -this.ctx.canvas.width / 2;
    this.initSurvivor();
    this.isSurvivorSurvived = true;
    this.zombies = [];
    this.ammo = [];
    this.projectiles = [];
    this.bullets = 3;
    this.score.resetScore();
    this.start();
  }

  private drawUI(): void {
    this.ctx.textAlign = "center";
    this.ctx.lineJoin = "round";
    this.ctx.lineWidth = 3;

    if (this.gameState === "menu") {
      this.ctx.textAlign = "center";
      this.ctx.fillStyle = "rgba(139, 3, 3, 0.4)";
      this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);

      this.ctx.font = "75px 'Silkscreen', sans-serif";
      this.ctx.strokeStyle = "white";
      this.ctx.strokeText(`ZOMBIE NIGHT`, this.ctx.canvas.width / 2, this.ctx.canvas.height / 2);
      this.ctx.fillStyle = "red";
      this.ctx.fillText(`ZOMBIE NIGHT`, this.ctx.canvas.width / 2, this.ctx.canvas.height / 2);

      this.ctx.font = "25px 'Silkscreen', sans-serif";
      this.ctx.strokeStyle = "black";
      this.ctx.strokeText(`click to play`, this.ctx.canvas.width / 2, this.ctx.canvas.height / 2 + 50);
      this.ctx.fillStyle = "white";
      this.ctx.fillText(`click to play`, this.ctx.canvas.width / 2, this.ctx.canvas.height / 2 + 50);
    } else if (this.gameState === "play") {
      // DRAW BULLET ICON
      this.ctx.textAlign = "left";

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

      // DRAW SCORE
      this.ctx.textAlign = "right";

      this.ctx.font = "35px 'Silkscreen', sans-serif";
      this.ctx.strokeStyle = "black";
      this.ctx.strokeText(`score: ${this.score.getScore()}`, this.ctx.canvas.width - 35, 45);
      this.ctx.fillStyle = "white";
      this.ctx.fillText(`score: ${this.score.getScore()}`, this.ctx.canvas.width - 35, 45);

      this.ctx.strokeStyle = "black";
      this.ctx.strokeText(`high score: ${this.score.getHighScore()}`, this.ctx.canvas.width - 35, 85);
      this.ctx.fillStyle = "white";
      this.ctx.fillText(`high score: ${this.score.getHighScore()}`, this.ctx.canvas.width - 35, 85);
    } else if (this.gameState === "gameOver") {
      this.ctx.textAlign = "center";
      this.ctx.fillStyle = "rgba(114, 13, 13, 0.4)";
      this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);

      this.ctx.font = "75px 'Silkscreen', sans-serif";
      this.ctx.strokeStyle = "white";
      this.ctx.strokeText(`game over`, this.ctx.canvas.width / 2, this.ctx.canvas.height / 4);
      this.ctx.fillStyle = "red";
      this.ctx.fillText(`game over`, this.ctx.canvas.width / 2, this.ctx.canvas.height / 4);

      this.ctx.font = "25px 'Silkscreen', sans-serif";
      this.ctx.strokeStyle = "black";
      this.ctx.strokeText(`click to restart`, this.ctx.canvas.width / 2, this.ctx.canvas.height / 4 + 50);
      this.ctx.fillStyle = "white";
      this.ctx.fillText(`click to restart`, this.ctx.canvas.width / 2, this.ctx.canvas.height / 4 + 50);

      this.ctx.font = "45px 'Silkscreen', sans-serif";
      this.ctx.strokeStyle = "black";
      this.ctx.strokeText(
        `score: ${this.score.getScore()}`,
        this.ctx.canvas.width / 2,
        this.ctx.canvas.height / 4 + 120,
      );
      this.ctx.fillStyle = "yellow";
      this.ctx.fillText(`score: ${this.score.getScore()}`, this.ctx.canvas.width / 2, this.ctx.canvas.height / 4 + 120);

      this.ctx.font = "45px 'Silkscreen', sans-serif";
      this.ctx.strokeStyle = "black";
      this.ctx.strokeText(
        `high score: ${this.score.getHighScore()}`,
        this.ctx.canvas.width / 2,
        this.ctx.canvas.height / 4 + 170,
      );
      this.ctx.fillStyle = "yellow";
      this.ctx.fillText(
        `high score: ${this.score.getHighScore()}`,
        this.ctx.canvas.width / 2,
        this.ctx.canvas.height / 4 + 170,
      );

      ////
    }
  }

  public loop = (timestamp: number): void => {
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

    if (this.gameState === "play") {
      // ZOMBIE TIMER
      this.zombieSpawnTimer += this.zombieSpawnSpeed * delta;

      if (Math.floor(this.zombieSpawnTimer) === this.zombieSpawnInterval) {
        //console.log("Zombie timer", this.zombieSpawnTimer);
        this.spawnZombie();
        this.zombieSpawnTimer = 0;
      }

      // KNIFE TIMER
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

      let worldSpeed = 0;
      if (this.survivorMovementState === "left" && this.worldOffset < 0) {
        worldSpeed = this.survivorMovementSpeed;
      } else if (this.survivorMovementState === "right" && this.worldOffset > this.maxWorldOffset) {
        worldSpeed = -this.survivorMovementSpeed;
      }

      // UPDATE PROJECTILE
      if (this.projectiles.length > 0) {
        this.projectiles.forEach((p) => p.move(delta, worldSpeed));
      }

      // UPDATE ZOMBIES
      if (this.zombies.length > 0) {
        this.zombies.forEach((z) => z.move(delta));
      }

      // MOVE SCREEN
      if (
        this.survivorMovementState === "left" &&
        this.worldOffset <= 0 &&
        this.survivor.getCoordX() >= this.ctx.canvas.width / 2 - 50 &&
        this.survivor.getCoordX() <= this.ctx.canvas.width / 2
      ) {
        this.worldOffset += this.survivorMovementSpeed * delta;
      } else if (
        this.survivorMovementState === "right" &&
        this.worldOffset >= this.maxWorldOffset &&
        this.survivor.getCoordX() >= this.ctx.canvas.width / 2 - 50 &&
        this.survivor.getCoordX() <= this.ctx.canvas.width / 2
      ) {
        this.worldOffset -= this.survivorMovementSpeed * delta;
      }

      // UPDATE SURVIVOR
      // TURN SURVIVOR
      this.survivor.changeDirection(this.survivorMovementState);

      // ANIMATE SURVIVOR
      this.survivor.changeAnimation(
        this.survivorWeaponState,
        this.survivorMovementState,
        delta,
        this.lastDirection,
        this.isSurvivorSurvived,
      );

      // MOVE SURVIVOR
      if (this.worldOffset >= 0 || this.worldOffset <= this.maxWorldOffset) {
        this.survivor.changePosition(
          this.survivorMovementSpeed,
          delta,
          this.survivorMovementState,
          this.ctx.canvas.width,
        );
      }

      // KNIFE COLLISION
      if (this.strike && this.zombies.length > 0 && this.strike.ableToDealDamage()) {
        const strikeWorldX = this.strike.getCoordX() - this.worldOffset;
        const strikeWorldY = this.strike.getCoordY();

        const strikeLeft = strikeWorldX;
        const strikeRight = strikeWorldX + this.strike.getWidth();
        const strikeTop = strikeWorldY;
        const strikeBottom = strikeWorldY + this.strike.getHeight();

        for (const zombie of this.zombies) {
          const zombieLeft = zombie.getCoordX();
          const zombieRight = zombie.getCoordX() + zombie.getWidth();
          const zombieTop = zombie.getCoordY();
          const zombieBottom = zombie.getCoordY() + zombie.getHeight();

          if (
            strikeRight > zombieLeft &&
            strikeLeft < zombieRight &&
            strikeBottom > zombieTop &&
            strikeTop < zombieBottom
          ) {
            this.showBlood(zombie.getCoordX(), zombie.getCoordY());
            // SOUNDS PLAY
            const zombiePunchSound = this.assets.sounds.zombiePunchSound;
            zombiePunchSound.play();
            const zombieScreamSound = this.assets.sounds.zombieScreamSound;
            zombieScreamSound.play();

            this.strike.setDealtDamage();
            zombie.getDamage(1);
            const zombieStillAlive = zombie.isAlive();
            if (!zombieStillAlive) {
              this.showZombieDeath(zombie.getCoordX(), zombie.getCoordY());
              this.score.addScore(zombie.getZombieScore());
              if (this.score.getScore() >= this.score.getHighScore()) {
                this.score.addHighScore();
              }
              this.score.saveHighScore();
              this.dropAmmo(
                zombie.getDropChance(),
                zombieLeft + zombie.getWidth() / 2,
                zombieBottom - this.constants.ammoSize,
              );
            }

            console.log("ZOMBIES ALIVE", this.zombies);
          }
        }
      }

      // PROJECTILE COLLISION
      if (this.projectiles.length > 0 && this.zombies.length > 0) {
        for (const projectile of this.projectiles) {
          if (projectile.ableToDealDamage()) {
            const projectileWorldX = projectile.getCoordX() - this.worldOffset;

            const projectileLeft = projectileWorldX;
            const projectileRight = projectileWorldX + projectile.getWidth();
            const projectileTop = projectile.getCoordY();
            const projectileBottom = projectile.getCoordY() + projectile.getHeight();

            for (const zombie of this.zombies) {
              const zombieLeft = zombie.getCoordX();
              const zombieRight = zombie.getCoordX() + zombie.getWidth();
              const zombieTop = zombie.getCoordY();
              const zombieBottom = zombie.getCoordY() + zombie.getHeight();

              if (
                projectileLeft < zombieRight &&
                projectileRight > zombieLeft &&
                projectileTop < zombieBottom &&
                projectileBottom > zombieTop
              ) {
                this.showBlood(zombie.getCoordX(), projectile.getCoordY() - projectile.getHeight() / 2);
                // SOUNDS PLAY
                const zombiePunchSound = this.assets.sounds.zombiePunchSound;
                zombiePunchSound.play();
                const zombieScreamSound = this.assets.sounds.zombieScreamSound;
                zombieScreamSound.play();
                projectile.setDealtDamage();
                projectile.setDead();
                zombie.getDamage(999);
                const zombieStillAlive = zombie.isAlive();
                if (!zombieStillAlive) {
                  this.showZombieDeath(zombie.getCoordX(), zombie.getCoordY());
                  this.score.addScore(zombie.getZombieScore());
                  if (this.score.getScore() >= this.score.getHighScore()) {
                    this.score.addHighScore();
                  }
                  this.score.saveHighScore();
                  this.dropAmmo(
                    zombie.getDropChance(),
                    zombieLeft + zombie.getWidth() / 2,
                    zombieBottom - this.constants.ammoSize,
                  );
                }

                console.log("SHOOT!");
                console.log("ZOMBIES ALIVE", this.zombies);
              }
            }
          }
        }
      }

      // SURVIVOR COLLISION
      if (this.survivor && this.isSurvivorSurvived && this.zombies.length > 0) {
        const survivorLeft = this.survivor.getCoordX() - this.worldOffset;
        const survivorRight = this.survivor.getCoordX() - this.worldOffset + this.survivor.getWidth();

        for (const zombie of this.zombies) {
          const zombieLeft = zombie.getCoordX();
          const zombieRight = zombie.getCoordX() + zombie.getWidth();

          if (
            (zombieLeft > survivorLeft && zombieLeft < survivorRight - this.zombieBufferHibox) ||
            (zombieRight > survivorLeft + this.zombieBufferHibox && zombieRight < survivorRight)
          ) {
            this.handleSurvivorDeath();
          }
        }
      }

      // AMMO BOX COLLSION
      if (this.ammo.length > 0 && this.survivor && this.isSurvivorSurvived) {
        const survivorLeft = this.survivor.getCoordX() - this.worldOffset;
        const survivorRight = this.survivor.getCoordX() - this.worldOffset + this.survivor.getWidth();

        for (const ammoBox of this.ammo) {
          const ammoBoxLeft = ammoBox.getCoordX();
          const ammoBoxRight = ammoBox.getCoordX() + ammoBox.getWidth();

          if (
            (ammoBoxLeft < survivorLeft && ammoBoxRight > survivorLeft) ||
            (ammoBoxLeft < survivorRight && ammoBoxLeft > survivorLeft)
          ) {
            const ammoPickupSound = this.assets.sounds.ammoPickupSound;
            ammoPickupSound.play();
            this.pickAmmo(ammoBox);
          }
        }
      }

      // SET EFFECTS TIMER
      this.bloods.forEach((b) => b.startLifeTimer(delta));
      this.zombieDeathAnimation.forEach((animation) => animation.startLifeTimer(delta));

      // CLEAR DEAD ENTITIES LISTS
      this.bloods = this.bloods.filter((b) => Math.floor(b.getLifeTimer()) !== 0);
      this.zombieDeathAnimation = this.zombieDeathAnimation.filter(
        (animation) => Math.floor(animation.getLifeTimer()) !== 0,
      );
      this.projectiles = this.projectiles.filter((p) => p.checkAlive());
      this.zombies = this.zombies.filter((z) => z.isAlive());
      this.ammo = this.ammo.filter((a) => !a.getWasPicked());
    } else if (this.gameState === "dying") {
      this.dyingTimer -= delta;

      this.survivor.changeAnimation(
        this.survivorWeaponState,
        "stop",
        delta,
        this.lastDirection,
        this.isSurvivorSurvived,
      );

      if (Math.floor(this.dyingTimer) <= 0) {
        this.gameState = "gameOver";
      }
    }

    // DRAW ASSETS
    this.background.draw(this.ctx, this.worldOffset);

    for (const tile of this.groundTiles) {
      tile.draw(this.ctx, this.worldOffset);
    }
    if (this.gameState === "play" || this.gameState === "dying" || this.gameState === "gameOver") {
      this.survivor.draw(this.ctx);
    }

    if (this.survivorShootTimer > 0 && this.shoot) {
      this.shoot.draw(this.ctx);
    }

    if (this.zombies.length > 0) {
      this.zombies.filter((z) => z.getLifePoints() > 0).forEach((z) => z.draw(this.ctx, this.worldOffset));
    }

    if (this.survivorKnifeTimer > 0 && this.strike) {
      this.strike.draw(this.ctx);
    }

    if (this.projectiles.length > 0) {
      this.projectiles.filter((p) => p.checkAlive()).forEach((p) => p.draw(this.ctx));
    }

    if (this.bloods.length > 0) {
      this.bloods.forEach((b) => b.draw(this.ctx, this.worldOffset));
    }

    if (this.zombieDeathAnimation.length > 0) {
      this.zombieDeathAnimation.forEach((death) => death.draw(this.ctx, this.worldOffset));
    }

    if (this.ammo.length > 0) {
      this.ammo.forEach((a) => a.draw(this.ctx, this.worldOffset));
    }

    // DRAW UI
    this.drawUI();

    // GAME LOOP
    this.animationID = requestAnimationFrame(this.loop);
  };
}
