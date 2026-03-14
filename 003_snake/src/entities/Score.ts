// 003_snake/src/entities/Score.ts

export class Score {
  private score: number;
  private highScore: number;

  constructor() {
    this.score = 0;
    const highScoreFromLocalStorage = localStorage.getItem("snakeHighScore");

    this.highScore = highScoreFromLocalStorage
      ? parseInt(highScoreFromLocalStorage)
      : 0;
  }

  public addScore(s: number): void {
    this.score += s;
  }

  public addHighScore(hs: number): void {
    this.highScore = this.score;
  }

  public saveHighScore(): void {
    localStorage.setItem("snakeHighScore", this.highScore.toString());
  }

  public resetScore(): void {
    this.score = 0;
  }

  public getScore(): number {
    return this.score;
  }

  public getHighScore(): number {
    return this.highScore;
  }
}
