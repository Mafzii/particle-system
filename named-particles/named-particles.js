document.addEventListener("DOMContentLoaded", function () {
  // Get the canvas element and its 2d context
  const canvas = document.getElementById("particleCanvas");
  const ctx = canvas.getContext("2d");

  // Set canvas dimensions
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight - 72; // 72 is the height of the navbar

  // Mouse interactions
  let mouse = {
    x: undefined,
    y: undefined,
  };
  canvas.addEventListener("mousemove", function (event) {
    mouse.x = event.clientX;
    mouse.y = event.clientY;
  });

  // Particle class
  class Particle {
    constructor(x, y, radius, color, velocity) {
      this.name = generateRandomName();
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
      if (this.isHovered(mouse.x, mouse.y)) {
        ctx.font = "8px Arial";
        ctx.fillStyle = "white";
        ctx.fillText(this.name, this.x + this.radius, this.y - this.radius);
      }
    }

    // check if the mouse is hovering over the particle
    isHovered(mouseX, mouseY) {
      return (
        mouseX > this.x - this.radius &&
        mouseX < this.x + this.radius &&
        mouseY > this.y - this.radius &&
        mouseY < this.y + this.radius
      );
    }
  }

  // Random name generator for the particles
  function generateRandomName() {
    const adjectives = [
      "Redish",
      "Greenish",
      "Bluish",
      "Vibrant",
      "Sunny",
      "Mysterious",
      "Gentle",
      "Energetic",
    ];
    const nouns = [
      "Particle",
      "Orb",
      "Sphere",
      "Dot",
      "Circle",
      "Point",
      "Speck",
    ];

    const randomAdjective =
      adjectives[Math.floor(Math.random() * adjectives.length)];
    const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];

    return `${randomAdjective} ${randomNoun}`;
  }

  // Particle array
  const particles = [];

  function createParticles() {
    for (let i = 0; i < 100; i++) {
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
