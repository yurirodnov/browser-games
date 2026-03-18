import type { Assets, Constants, GameState } from "../types/type";
import { GroundTile } from "./GroundTile";

export class Game {
  private ctx: CanvasRenderingContext2D;
  private assets: Assets;
  private constants: Constants;
  private running: boolean = true;
  private animationID: number = 0;
  private lastFrameTime: number = 0;
  private groundTiles: GroundTile[];

  constructor(
    ctx: CanvasRenderingContext2D,
    assets: Assets,
    constants: Constants,
  ) {
    this.ctx = ctx;
    this.assets = assets;
    this.constants = constants;

    // INIT GAME ENTITIES

    // INIT GROUND
    const groundTilesArray: GroundTile[] = [];
    for (
      let i: number = 0;
      i < this.ctx.canvas.width;
      i += this.constants.tileSize
    ) {
      const groundTile = new GroundTile(
        this.assets.ground,
        i,
        this.ctx.canvas.height - this.constants.tileSize,
        40,
        40,
      );
      groundTilesArray.push(groundTile);
    }
    this.groundTiles = groundTilesArray;

    // START GAME ON GAME INSTANCE CREATION
    this.running = true;
    this.loop(0);
  }

  public start() {}

  public stop() {}

  public restart() {}

  private drawUI() {}

  public loop = (timestamp: number) => {
    if (!this.running) {
      return;
    }

    // CLEAR CANVAS
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);

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

    // DRAW ASSETS
    for (const tile of this.groundTiles) {
      tile.draw(this.ctx);
    }

    // DRAW UI
    this.drawUI();

    // GAME LOOP
    console.log(timestamp);
    this.animationID = requestAnimationFrame(this.loop);
  };
}
