export class Score {
  private score: number;
  private highScore: number;

  constructor() {
    this.score = 0;

    const scoreFromLocalStorage = localStorage.getItem("flappyBirdhighScore");

    if (!scoreFromLocalStorage) {
      this.highScore = 0;
    } else {
      this.highScore = parseInt(scoreFromLocalStorage);
    }
  }

  addScore(s: number): void {
    this.score += s;
  }

  resetScore(): void {
    this.score = 0;
  }

  addHighScore(): void {
    this.highScore = this.score;
  }

  saveHighScore(): void {
    localStorage.setItem("flappyBirdhighScore", this.highScore.toString());
  }

  getScore(): number {
    return this.score;
  }

  getHighScore(): number {
    return this.highScore;
  }
}
