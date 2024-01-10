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
      this.history = [{ x: this.x, y: this.y }];
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
      this.x += this.velocity.x + Math.random() *5 -2.5;
      this.y += this.velocity.y;
      this.history.push({ x: this.x, y: this.y });
    }
  }

  class Effect {
    constructor(width, height) {
      this.width = width;
      this.height = height;
      this.particles = [];
      this.noParticles = 100;
      this.init();
    }
    init() {
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
