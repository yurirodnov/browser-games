export class Stats {
  private score: number;
  private highScore: number;

  constructor() {
    this.score = 0;

    const scoreFromStorage = localStorage.getItem("highScore");
    if (!scoreFromStorage) {
      this.highScore = 0;
    } else {
      this.highScore = parseInt(scoreFromStorage);
    }
  }

  addScore(s: number): void {
    this.score += s;
  }

  resetScore(): void {
    this.score = 0;
  }

  setHighScore(): void {
    this.highScore = this.score;
  }

  saveHighScore(): void {
    localStorage.setItem("highScore", this.highScore.toString());
  }

  getScore(): number {
    return this.score;
  }

  getHighScore(): number {
    return this.highScore;
  }
}
