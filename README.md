# 🕹️ Browser Games Collection

A collection of classic arcade games built from scratch using **HTML5 Canvas**, **CSS**, and **TypeScript**.

No game engines, no heavy frameworks (like React or Phaser). Just pure JavaScript logic, Object-Oriented Programming, and performance-focused code.

## ✨ Key Features

- **Custom Game Loop:** Implemented using `requestAnimationFrame` for smooth 60 FPS rendering.
- **Entity Component System:** Clean OOP architecture with classes for Player, Enemies, Projectiles, and Particles.
- **Collision Detection:** Custom AABB (Axis-Aligned Bounding Box) algorithms for precise hit detection.
- **State Management:** LocalStorage integration for high scores and persistent game state.
- **Tooling:** Bundled with **Vite** for instant hot-reloading and optimized builds.

## 🛠️ Local Development

Interested in the code? Want to run it locally?

1.  **Clone the repo:**
    ```bash
    git clone https://github.com/твой-ник/browser-games.git
    ```
2.  **Go to a specific game directory:**
    ```bash
    cd 01_space_invasion
    ```
3.  **Install dependencies:**
    ```bash
    npm install
    ```
4.  **Run the dev server:**
    ```bash
    npm run dev
    ```
5.  Open the link shown in the terminal (usually `http://localhost:5173`).

## 📂 Project Structure

Each game is a standalone Vite project:

```text
/browser-games
  ├── 01_space_invasion/    # Source code for Space Invasion
  ├── 02_Flappy bird/       # Source code for Flappy bird
  ├── 03_Snake              # Source code for Snake
  ├── Another games folders...
  └── README.md
```
