// 005_tetris/src/entities/Figure.ts

import type { BrickColor, BricksAssets, FigureMatrix, FigureType, GameConstants, GameGridMatrix } from "../types/types";
import { MatrixFigureMap } from "../lib/MatrixFigureMap";

export class Figure {
  private bricksAssets: BricksAssets;
  private figureColor: BrickColor;
  private figureType: FigureType;
  private matrixOptions: FigureMatrix;
  private currentMatrix: number[][];
  private matrixOptionMaxNumber: number;
  private matrixStartOPtion: number = 0;
  private constatnts: GameConstants;
  private gridPositionX: number;
  private gridPositionY: number;
  private gameGrid: GameGridMatrix;

  constructor(
    figureType: FigureType,
    brickColor: BrickColor,
    bricksAssets: BricksAssets,
    constants: GameConstants,
    startX: number,
    startY: number,
    gameGrid: GameGridMatrix,
  ) {
    this.figureType = figureType;
    this.figureColor = brickColor;
    this.bricksAssets = bricksAssets;
    this.constatnts = constants;
    this.gridPositionX = startX;
    this.gridPositionY = startY;

    this.matrixOptions = MatrixFigureMap[this.figureType as keyof typeof MatrixFigureMap];
    this.matrixOptionMaxNumber = this.matrixOptions.length - 1;

    this.currentMatrix = this.matrixOptions[this.matrixStartOPtion];
    this.gameGrid = gameGrid;
  }

  public getFigureType(): string {
    return this.figureType;
  }

  public getFigureColor(): string {
    return this.figureColor;
  }

  public getFigureMatrix(): number[][] {
    return this.currentMatrix;
  }

  public rotate(): void | null {
    const previousMatrixBackup = this.currentMatrix;
    const previousMatrixPosition = this.matrixStartOPtion;

    if (this.checkGridCollision() && this.checkWallCollision()) {
      return null;
    }

    if (this.matrixStartOPtion < this.matrixOptionMaxNumber) {
      this.matrixStartOPtion += 1;
    } else {
      this.matrixStartOPtion = 0;
    }

    this.currentMatrix = this.matrixOptions[this.matrixStartOPtion];
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
    const brickSize = this.constatnts.brickSize;
    for (let i = 0; i < this.currentMatrix.length; i += 1) {
      for (let j = 0; j < this.currentMatrix[i].length; j += 1) {
        if (this.currentMatrix[i][j] === 1) {
          const futureX = this.gridPositionX + j * this.constatnts.brickSize - this.constatnts.brickSize;
          if (futureX < 0) return false;

          const futureGridIndexJ = Math.floor(futureX / brickSize);
          const futureGridIndexI = Math.floor((this.gridPositionY + i * brickSize) / brickSize);

          if (
            futureGridIndexI >= 0 &&
            futureGridIndexI < this.constatnts.gameGridHeight &&
            futureGridIndexJ >= 0 &&
            futureGridIndexJ < this.constatnts.gameGridWidth
          ) {
            if (this.gameGrid[futureGridIndexI][futureGridIndexJ] !== "0") {
              return false;
            }
          }
        }
      }
    }

    return true;
  }

  public canMoveRight(): boolean {
    const brickSize = this.constatnts.brickSize;
    for (let i = 0; i < this.currentMatrix.length; i += 1) {
      for (let j = 0; j < this.currentMatrix[i].length; j += 1) {
        if (this.currentMatrix[i][j] === 1) {
          const futureX = this.gridPositionX + j * this.constatnts.brickSize + this.constatnts.brickSize;
          if (futureX > this.constatnts.gameGridWidth * this.constatnts.brickSize - this.constatnts.brickSize)
            return false;

          const futureGridIndexJ = Math.floor(futureX / brickSize);
          const futureGridIndexI = Math.floor((this.gridPositionY + i * brickSize) / brickSize);

          if (
            futureGridIndexI >= 0 &&
            futureGridIndexI < this.constatnts.gameGridHeight &&
            futureGridIndexJ >= 0 &&
            futureGridIndexJ < this.constatnts.gameGridWidth
          ) {
            if (this.gameGrid[futureGridIndexI][futureGridIndexJ] !== "0") {
              return false;
            }
          }
        }
      }
    }

    return true;
  }

  public canMoveDown(): boolean {
    const brickSize = this.constatnts.brickSize;
    for (let i = 0; i < this.currentMatrix.length; i += 1) {
      for (let j = 0; j < this.currentMatrix[i].length; j += 1) {
        if (this.currentMatrix[i][j] === 1) {
          const futureY = this.gridPositionY + i * brickSize + brickSize;
          if (futureY > this.constatnts.gameGridHeight * brickSize - brickSize) return false;

          const futureGridIndexI = Math.floor(futureY / brickSize);
          const futureGridIndexJ = Math.floor((this.gridPositionX + j * brickSize) / brickSize);

          if (
            futureGridIndexI >= 0 &&
            futureGridIndexI < this.constatnts.gameGridHeight &&
            futureGridIndexJ >= 0 &&
            futureGridIndexJ < this.constatnts.gameGridWidth
          ) {
            if (this.gameGrid[futureGridIndexI][futureGridIndexJ] !== "0") {
              return false;
            }
          }
        }
      }
    }

    return true;
  }

  public checkWallCollision(): boolean {
    for (let i = 0; i < this.currentMatrix.length; i += 1) {
      for (let j = 0; j < this.currentMatrix[i].length; j += 1) {
        if (this.currentMatrix[i][j] === 1) {
          const cell = this.gridPositionX + j * this.constatnts.brickSize;
          if (cell < 0 || cell >= this.constatnts.gameGridWidth * this.constatnts.brickSize) {
            console.log("wall collision");
            return true;
          }
        }
      }
    }

    return false;
  }

  public checkGridCollision(): boolean {
    for (let i = 0; i < this.currentMatrix.length; i += 1) {
      for (let j = 0; j < this.currentMatrix[i].length; j += 1) {
        if (this.currentMatrix[i][j] === 1) {
          const gridX = Math.floor((this.gridPositionX + j * this.constatnts.brickSize) / this.constatnts.brickSize);
          const gridY = Math.floor((this.gridPositionY + i * this.constatnts.brickSize) / this.constatnts.brickSize);

          if (
            gridX >= 0 &&
            gridX < this.constatnts.gameGridWidth &&
            gridY >= 0 &&
            gridY < this.constatnts.gameGridHeight
          ) {
            if (this.gameGrid[gridY][gridX] !== "0") {
              console.log("grid collision");
              return true;
            }
          }
        }
      }
    }

    return false;
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
            this.bricksAssets[this.figureColor],
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
