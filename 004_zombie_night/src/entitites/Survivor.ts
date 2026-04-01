import type { SurvivorMovementState, SurvivorAssets } from "../types/type";

export class Survivor {
  private survivorImages: SurvivorAssets;
  private currentImage: HTMLImageElement;

  private coordX: number;
  private coordY: number;
  private width: number;
  private height: number;

  private walkTimer: number = 0;
  private walkAnimationInterval: number = 20;
  private speed: number = 50;

  private readonly WALK_ANIMATION_SPEED = 10;
  private readonly WALK_FRAME_DURATION = 3;
  private readonly WALK_TOTAL_FRAMES = 2;

  constructor(survivorImages: SurvivorAssets, x: number, y: number, w: number, h: number) {
    this.survivorImages = survivorImages;
    this.currentImage = survivorImages.survivorLeft;
    this.coordX = x;
    this.coordY = y;

    this.width = w;
    this.height = h;
  }

  public getCoordX(): number {
    return this.coordX;
  }

  public getCoordY(): number {
    return this.coordY;
  }

  public getWidth(): number {
    return this.width;
  }

  public getHeight(): number {
    return this.height;
  }

  public getLeftStrikeCoordsX(): number {
    return this.coordX - this.width;
  }

  public getRightStrikeCoordsX(): number {
    return this.coordX + this.width;
  }

  public getStrikeCoordsY(): number {
    return this.coordY + this.height / 4;
  }

  public getShootCoordsX(): number {
    return this.coordX + this.width;
  }

  public getShootCoordsY(): number {
    return this.coordY + this.height / 4;
  }

  public changeDirection(direction: string): void {
    if (direction === "left") {
      this.currentImage = this.survivorImages.survivorLeft;
    } else if (direction === "right") {
      this.currentImage = this.survivorImages.survivorRight;
    }
  }

  public changePosition(speed: number, delta: number, direction: SurvivorMovementState, canvasWidth: number): void {
    if (direction === "left" && this.coordX > 0) {
      this.coordX -= speed * delta;
    } else if (direction === "right" && this.coordX < canvasWidth - this.width) {
      this.coordX += speed * delta;
    }
  }

  public changeAnimation(weaponState: string, movementState: string, delta: number, lastDirection: string): void {
    // WALK ANIMATION
    if (movementState === "left" || movementState === "right") {
      this.walkTimer += this.WALK_ANIMATION_SPEED * delta;
      const frameIndex = Math.floor(this.walkTimer / this.WALK_FRAME_DURATION) % this.WALK_TOTAL_FRAMES;
      const isLeft = movementState === "left";
      if (frameIndex === 0) {
        this.currentImage = isLeft ? this.survivorImages.survivorWalk1Left : this.survivorImages.survivorWalk1Right;
      } else {
        this.currentImage = isLeft ? this.survivorImages.survivorWalk2Left : this.survivorImages.survivorWalk2Right;
      }

      // KNIFE ANIMATION
    } else if (weaponState === "knife") {
      this.currentImage = lastDirection === "left" ? this.survivorImages.survivorKnifeLeft : this.survivorImages.survivorKnifeRight;

      // JUST STOP ANIMATION
    } else {
      this.walkTimer = 0;
      this.currentImage = lastDirection === "left" ? this.survivorImages.survivorLeft : this.survivorImages.survivorRight;
    }
  }

  // public changeAnimation(
  //   weaponState: string,
  //   movementState: string,
  //   delta: number,
  //   lastDirection: string,
  // ): void {
  //   if (movementState === "left") {
  //     this.walkTimer += this.speed * delta;
  //     if (this.walkTimer < 20) {
  //       this.currentImage = this.survivorImages.survivorWalk1Left;
  //     } else if (
  //       Math.floor(this.walkTimer) >= 20 &&
  //       Math.floor(this.walkTimer) <= 29
  //     ) {
  //       this.currentImage = this.survivorImages.survivorWalk2Left;
  //     } else if (Math.floor(this.walkTimer) === 30) {
  //       this.walkTimer = 0;
  //     }
  //   } else if (movementState === "right") {
  //     this.walkTimer += this.speed * delta;
  //     if (Math.floor(this.walkTimer) < 20) {
  //       this.currentImage = this.survivorImages.survivorWalk1Right;
  //     } else if (
  //       Math.floor(this.walkTimer) >= 20 &&
  //       Math.floor(this.walkTimer) <= 29
  //     ) {
  //       this.currentImage = this.survivorImages.survivorWalk2Right;
  //     } else if (Math.floor(this.walkTimer) === 30) {
  //       this.walkTimer = 0;
  //     }
  //   } else if (
  //     movementState === "stop" &&
  //     weaponState === "knife" &&
  //     lastDirection === "right"
  //   ) {
  //     console.log("Knife strike");
  //     this.currentImage = this.survivorImages.survivorKnifeRight;
  //   } else if (
  //     movementState === "stop" &&
  //     weaponState === "knife" &&
  //     lastDirection === "left"
  //   ) {
  //     console.log("Knife strike");
  //     this.currentImage = this.survivorImages.survivorKnifeLeft;
  //   } else if (movementState === "stop" && lastDirection === "left") {
  //     this.walkTimer = 0;
  //     this.currentImage = this.survivorImages.survivorLeft;
  //   } else if (movementState === "stop" && lastDirection === "right") {
  //     this.walkTimer = 0;
  //     this.currentImage = this.survivorImages.survivorRight;
  //   }
  // }

  public draw(ctx: CanvasRenderingContext2D) {
    // if (direction === "left") {
    //   ctx.drawImage(
    //     this.survivorImages.survivorLeft,
    //     this.coordX,
    //     this.coordY,
    //     this.width,
    //     this.height,
    //   );
    //   this.lastDirection = "left";
    // } else if (direction === "right") {
    //   ctx.drawImage(
    //     this.survivorImages.survivorRight,
    //     this.coordX,
    //     this.coordY,
    //     this.width,
    //     this.height,
    //   );
    //   this.lastDirection = "right";
    // } else if (direction === "stop") {
    //   ctx.drawImage(
    //     this.lastDirection === "left"
    //       ? this.survivorImages.survivorLeft
    //       : this.survivorImages.survivorRight,
    //     this.coordX,
    //     this.coordY,
    //     this.width,
    //     this.height,
    //   );
    // }

    ctx.drawImage(this.currentImage, this.coordX, this.coordY, this.width, this.height);
  }
}
