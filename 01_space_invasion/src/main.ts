//01_space_invasion/src/main.ts

// Get app element and set canvas
document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
  <canvas id="canvas"></canvas>
`;

const canvas = document.getElementById("canvas") as HTMLCanvasElement;
const ctx = canvas.getContext("2d");

if (!ctx) {
  throw new Error("No 2D context");
}

const WIDTH = 440;
const HEIGHT = 630;

canvas.width = WIDTH;
canvas.height = HEIGHT;

const init = async () => {
  // async load assets

  // create entities

  // set handlers and listeners

  // start game loop
  gameLoop();
};

const gameLoop = () => {
  // clear screen

  // update logic

  // update screen

  requestAnimationFrame(gameLoop);
};

init();
