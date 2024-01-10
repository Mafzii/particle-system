document.addEventListener("DOMContentLoaded", function () {
  // Get the canvas element and its 2d context
  const canvas = document.getElementById("particleCanvas");
  const ctx = canvas.getContext("2d");

  // Canvas settings
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight - 72; // 72 is the height of the navbar
  ctx.fillStyle = "white";
  ctx.strokeStyle = "white";
  ctx.lineWidth = 1;

  // Particle class
  class Particle {
    constructor(effect) {
      this.effect = effect;
      this.x = Math.floor(Math.random() * this.effect.width);
      this.y = Math.floor(Math.random() * this.effect.height);
    }

    draw(context) {
      context.fillRect(this.x, this.y, 1, 1);
    }
  }

  class Effect {
    constructor(width, height) {
      this.width = width;
      this.height = height;
      this.particles = [];
    }

    init() {
      this.particles.push(new Particle(this));
    }
  }

  // Create the effect
  const effect = new Effect(canvas.width, canvas.height);
  effect.init();
  console.log(effect);

// ! legacy code to be integrated into the new code
  // Media controls
  let paused = false;
  const playButton = document.getElementById("play");
  playButton.addEventListener("click", () => {
    paused = false;
    animateParticles();
    playButton.disabled = true;
    pauseButton.disabled = false;
  });
  const pauseButton = document.getElementById("pause");
  pauseButton.addEventListener("click", () => {
    paused = true;
    playButton.disabled = false;
    pauseButton.disabled = true;
  });
  const resetButton = document.getElementById("reset");
  resetButton.addEventListener("click", () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.length = 0;
    createParticles();
    if (paused) animateParticles();
  });

  // Resize canvas on window resize
  window.addEventListener("resize", function () {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Recreate particles on resize
    particles.length = 0;
    createParticles();
  });
});
