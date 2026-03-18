import type { Assets, Constants } from "../types/type";

export class Game {
  private ctx: CanvasRenderingContext2D;
  private assets: Assets;
  private constants: Constants;

  constructor(
    ctx: CanvasRenderingContext2D,
    assets: Assets,
    constants: Constants,
  ) {
    this.ctx = ctx;
    this.assets = assets;
    this.constants = constants;
  }

  public start() {}

  public stop() {}

  public restart() {}

  public loop() {}
}
