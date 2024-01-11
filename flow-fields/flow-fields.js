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
  let paused = false;

  // Particle class
  class Particle {
    constructor(effect) {
      this.effect = effect;
      this.x = Math.floor(Math.random() * this.effect.width);
      this.y = Math.floor(Math.random() * this.effect.height);
      this.velocity = {
        x: Math.random() * 5 - 2.5,
        y: Math.random() * 2 - 1,
      };
      this.speedModifier = Math.round(Math.random() * 2 + 1);
      this.history = [{ x: this.x, y: this.y }];
      this.maxLength = Math.floor(Math.random() * 100 + 50);
      this.angle = 0;
      this.timer = this.maxLength * 2;
    }
    draw(context) {
      context.fillRect(this.x, this.y, 1, 1);
      context.beginPath();
      context.moveTo(this.history[0].x, this.history[0].y);
      for (const element of this.history) {
        context.lineTo(element.x, element.y);
      }
      context.stroke();
    }
    update() {
      // When timer is up slowly remove the line by removing its history
      this.timer--;
      if (this.timer < 0) {
        if (this.history.length > 1) this.history.shift(); // Keep origin point
        else this.reset(); // Reset particle animation when removed all but origin
        return;
      }
      // Get the angle from the flow field
      const col = Math.floor(this.x / this.effect.cellSize);
      const row = Math.floor(this.y / this.effect.cellSize);
      const index = col + row * this.effect.cols;
      this.angle = this.effect.flowField[index];

      // Update the velocity
      this.velocity.x = Math.cos(this.angle);
      this.velocity.y = Math.sin(this.angle);
      this.x += this.velocity.x * this.speedModifier;
      this.y += this.velocity.y * this.speedModifier;

      this.history.push({ x: this.x, y: this.y });
      // Keep the line at a certain length
      if (this.history.length > this.maxLength) this.history.shift();
    }
    reset() {
      this.x = Math.floor(Math.random() * this.effect.width);
      this.y = Math.floor(Math.random() * this.effect.height);
      this.history = [{ x: this.x, y: this.y }];
      this.timer = this.maxLength * 2;
    }
  }

  class Effect {
    constructor(width, height) {
      this.width = width;
      this.height = height;
      this.particles = [];
      this.noParticles = 1000;
      this.cellSize = 10;
      this.cols = 0;
      this.rows = 0;
      this.flowField = [];
      this.curve = 2.5;
      this.zoom = 0.1;
      this.init();
    }
    init() {
      // Create flow field
      this.cols = Math.floor(this.width / this.cellSize);
      this.rows = Math.floor(this.height / this.cellSize);
      this.flowField = [];
      for (let posY = 0; posY < this.rows; posY++) {
        for (let posX = 0; posX < this.cols; posX++) {
          let angle =
            (Math.cos(posX * this.zoom) + Math.sin(posY * this.zoom)) *
            this.curve;
          this.flowField.push(angle);
        }
      }
      // Create particles
      for (let i = 0; i < this.noParticles; i++) {
        this.particles.push(new Particle(this));
      }
    }
    render(context) {
      this.particles.forEach((particle) => {
        particle.draw(context);
        particle.update();
      });
    }
    reset() {
      this.particles = [];
      this.init();
    }
  }

  // Create the effect
  const effect = new Effect(canvas.width, canvas.height);
  console.log(effect);

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    effect.render(ctx);
    if (!paused) requestAnimationFrame(animate);
  }
  animate();

  // Media controls
  const playButton = document.getElementById("play");
  playButton.addEventListener("click", () => {
    paused = false;
    animate();
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
    effect.reset();
    if (paused) animate();
  });

  // Resize canvas on window resize
  window.addEventListener("resize", function () {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    effect.reset();
  });
});
