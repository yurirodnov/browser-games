import type {
  BrickColor,
  BricksAssets,
  FigureMatrix,
  FigureType,
  GameConstants,
  MatrixFigureMapType,
} from "../types/types";
import { MatrixFigureMap } from "../lib/MatrixFigureMap";

export class NextFigurePreview {
  private bricksAssets: BricksAssets;
  private brickColor: BrickColor;
  private figureType: FigureType;
  private positionX: number;
  private positionY: number;
  private figureMatrix: number[][];
  private matrixOptions: FigureMatrix;
  private constants: GameConstants;

  constructor(
    assets: BricksAssets,
    color: BrickColor,
    type: FigureType,
    x: number,
    y: number,
    constants: GameConstants,
  ) {
    this.bricksAssets = assets;
    this.brickColor = color;
    this.figureType = type;
    this.positionX = x;
    this.positionY = y;
    this.constants = constants;

    this.matrixOptions = MatrixFigureMap[this.figureType as keyof MatrixFigureMapType];
    this.figureMatrix = this.matrixOptions[0];
  }

  public draw(ctx: CanvasRenderingContext2D): void {
    for (let i = 0; i < this.figureMatrix.length; i += 1) {
      for (let j = 0; j < this.figureMatrix[i].length; j += 1) {
        if (this.figureMatrix[i][j] === 1) {
          ctx.drawImage(
            this.bricksAssets[this.brickColor],
            j * this.constants.brickSize + this.positionX,
            i * this.constants.brickSize + this.positionY,
            this.constants.brickSize,
            this.constants.brickSize,
          );
        }
      }
    }
  }
}
