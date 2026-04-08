export class Score {
  private score: number = 0;
  private highScore: number;

  constructor() {
    const highScoreFromLocalStorage = localStorage.getItem("zombieNightHightSccore");

    if (!highScoreFromLocalStorage) {
      this.highScore = 0;
    } else {
      this.highScore = parseInt(highScoreFromLocalStorage);
    }
  }

  public getScore(): number {
    return this.score;
  }

  public getHighScore(): number {
    return this.highScore;
  }

  public addScore(score: number): void {
    this.score += score;
  }

  public addHighScore(): void {
    this.highScore = this.score;
  }

  public saveHighScore(): void {
    localStorage.setItem("zombieNightHightSccore", this.highScore.toString());
  }

  public resetScore(): void {
    this.score = 0;
  }
}
