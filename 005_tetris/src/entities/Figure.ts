// 005_tetris/src/entities/Figure.ts

import type { BrickColor, BricksAssets, FigureMatrix, FigureType, GameConstants } from "../types/types";
import { MatrixFigureMap } from "../lib/MatrixFigureMap";

export class Figure {
  private bricksAssets: BricksAssets;
  private brickColor: BrickColor;
  private figureType: FigureType;
  private matrixOptions: FigureMatrix;
  private currentMatrix: number[][];
  private matrixOptionMaxNumber: number;
  private matrixStartOPtion: number = 0;
  private constatnts: GameConstants;
  private gridPositionX: number;
  private gridPositionY: number;

  constructor(
    figureType: FigureType,
    brickColor: BrickColor,
    bricksAssets: BricksAssets,
    constants: GameConstants,
    startX: number,
    startY: number,
  ) {
    this.figureType = figureType;
    this.brickColor = brickColor;
    this.bricksAssets = bricksAssets;
    this.constatnts = constants;
    this.gridPositionX = startX;
    this.gridPositionY = startY;

    this.matrixOptions = MatrixFigureMap[this.figureType as keyof typeof MatrixFigureMap];
    this.matrixOptionMaxNumber = this.matrixOptions.length - 1;

    this.currentMatrix = this.matrixOptions[this.matrixStartOPtion];
  }

  public getFigureType(): string {
    return this.figureType;
  }

  public getFigureMatrix(): number[][] {
    return this.currentMatrix;
  }

  public rotate(): void {
    if (this.matrixStartOPtion < this.matrixOptionMaxNumber) {
      this.matrixStartOPtion += 1;
    } else {
      this.matrixStartOPtion = 0;
    }

    this.currentMatrix = this.matrixOptions[this.matrixStartOPtion];

    console.log("MATRIX POSITION", this.matrixStartOPtion);
  }

  public drop(step: number): void {
    //console.log("changed position");
    this.gridPositionY += step;
  }

  public moveLeft(step: number): void {
    this.gridPositionX -= step;
  }

  public moveRight(step: number): void {
    this.gridPositionX += step;
  }

  public getPositionX(): number {
    return this.gridPositionX;
  }

  public getPositionY(): number {
    return this.gridPositionY;
  }

  public canMoveLeft(): boolean {
    for (let i = 0; i < this.currentMatrix.length; i += 1) {
      for (let j = 0; j < this.currentMatrix[i].length; j += 1) {
        if (this.currentMatrix[i][j] === 1) {
          const futureX = this.gridPositionX + j * this.constatnts.brickSize - this.constatnts.brickSize;
          if (futureX < 0) return false;
        }
      }
    }

    return true;
  }

  public canMoveRight(): boolean {
    for (let i = 0; i < this.currentMatrix.length; i += 1) {
      for (let j = 0; j < this.currentMatrix[i].length; j += 1) {
        if (this.currentMatrix[i][j] === 1) {
          const futureX = this.gridPositionX + j * this.constatnts.brickSize + this.constatnts.brickSize;
          if (futureX > this.constatnts.gameGridWidth * this.constatnts.brickSize - this.constatnts.brickSize)
            return false;
        }
      }
    }

    return true;
  }

  public shiftFigureIfBeyond(): void {
    for (let i = 0; i < this.currentMatrix.length; i += 1) {
      for (let j = 0; j < this.currentMatrix[i].length; j += 1) {
        if (this.currentMatrix[i][j] === 1) {
          const currentX = this.gridPositionX + j * this.constatnts.brickSize;
          if (currentX < 0) {
            this.gridPositionX += this.constatnts.brickSize;
          } else if (currentX > this.constatnts.gameGridWidth * this.constatnts.brickSize - this.constatnts.brickSize) {
            this.gridPositionX -= this.constatnts.brickSize;
          }
        }
      }
    }
  }

  public draw(ctx: CanvasRenderingContext2D): void {
    for (let i = 0; i < this.currentMatrix.length; i += 1) {
      for (let j = 0; j < this.currentMatrix[i].length; j += 1) {
        if (this.currentMatrix[i][j] === 1) {
          ctx.drawImage(
            this.bricksAssets[this.brickColor],
            j * this.constatnts.brickSize + this.gridPositionX,
            i * this.constatnts.brickSize + this.gridPositionY,
            this.constatnts.brickSize,
            this.constatnts.brickSize,
          );
        }
      }
    }
  }
}
