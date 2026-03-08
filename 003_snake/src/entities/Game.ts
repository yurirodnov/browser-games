// 003_snake/src/entities/Game.ts

import type { Assets, Constants, GameState } from "../types/types";

export class Game {
  private ctx: CanvasRenderingContext2D;
  private assets: Assets;
  private running: boolean = true;
  private animationID: number | null = null;

  private gameField: boolean[][];

  constructor(
    ctx: CanvasRenderingContext2D,
    assets: Assets,
    constants: Constants,
  ) {
    this.ctx = ctx;
    this.assets = assets;

    const matrix = [];
    for (let i: number = 0; i < constants.canvasRows; i += 1) {
      const row: boolean[] = [];
      for (let j: number = 0; j < constants.canvasColumns; j += 1) {
        row.push(false);
      }
      matrix.push(row);
    }

    this.gameField = matrix;
  }

  public checkField(): void {
    console.log(this.gameField);
  }

  public start() {
    this.running = true;
  }

  public stop() {}

  public restart() {}

  public loop = (timestamp: number) => {
    if (!this.running) {
      return;
    }

    this.animationID = requestAnimationFrame(this.loop);
  };

  public drawUI() {}
}
