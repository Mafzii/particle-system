document.addEventListener("DOMContentLoaded", function () {
  // Get the canvas element and its 2d context
  const canvas = document.getElementById("particleCanvas");
  const ctx = canvas.getContext("2d");

  // Set canvas dimensions
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight - 72; // 72 is the height of the navbar

  // Particle class
  class Particle {
    constructor(x, y, radius, color, velocity) {
      this.x = x;
      this.y = y;
      this.radius = radius;
      this.color = color;
      this.velocity = velocity;
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
      ctx.fillStyle = this.color;
      ctx.fill();
    }

    update() {
      this.draw();
      this.x += this.velocity.x;
      this.y += this.velocity.y;
    }
  }

  // Particle array
  const particles = [];

  function createParticles() {
    for (let i = 0; i < 10; i++) {
      const radius = Math.random() * 5 + 5; // Random radius between 5 and 10
      const x = Math.random() * (canvas.width - radius * 2) + radius;
      const y = Math.random() * (canvas.height - radius * 2) + radius;
      const color = `rgba(${Math.random() * 255},${Math.random() * 255},${
        Math.random() * 255
      },0.8)`;
      const velocity = {
        x: (Math.random() - 0.5) * 2, // Random value between -1 and 1
        y: (Math.random() - 0.5) * 2,
      };

      particles.push(new Particle(x, y, radius, color, velocity));
    }
  }

  // Animation loop
  function animateParticles() {
    if (!paused) requestAnimationFrame(animateParticles);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (const particle of particles) {
      particle.update();
      
      // Reflect off walls
      if (
        particle.x - particle.radius <= 0 ||
        particle.x + particle.radius >= canvas.width
      ) {
        particle.velocity.x = -particle.velocity.x;
      }
      if (
        particle.y - particle.radius <= 0 ||
        particle.y + particle.radius >= canvas.height
      ) {
        particle.velocity.y = -particle.velocity.y;
      }
    }
  }

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
    particles.length = 0;
    createParticles();
    if (paused) animateParticles();
  });

  // Initialize animation
  createParticles();
  // Start animation
  animateParticles();

  // Resize canvas on window resize
  window.addEventListener("resize", function () {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Recreate particles on resize
    particles.length = 0;
    createParticles();
  });
});
