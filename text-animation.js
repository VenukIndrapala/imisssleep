const canvas = document.getElementById("text-canvas");
const ctx = canvas.getContext("2d");

const phrases = [
  "Oh hey there",
  "Looks like you pulled through",
  "Once again...",
  "Couldn't be more proud ma'am",
  "Keep it up Queen"
];

let particles = [];
let currentPhrase = 0;

// Set a fixed logical resolution for the canvas
function setupCanvas() {
  canvas.width = 800; 
  canvas.height = 300;
  // CSS handles the display size, but internal coordinate system is fixed
  canvas.style.width = "100%";
  canvas.style.height = "auto";
}
setupCanvas();

class Particle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.size = 2.5; // Larger base size for better visibility
    this.color = Math.random() > 0.5 ? '#ffd700' : '#f2a6c2';
  }
  draw() {
    ctx.fillStyle = this.color;
    ctx.globalAlpha = Math.random() * 0.5 + 0.5;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
  }
}

function initText(text) {
  particles = [];
  ctx.fillStyle = "white";
  ctx.font = "bold 60px Arial"; // Fixed pixel size
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillText(text, canvas.width / 2, canvas.height / 2);
  
  const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  // Use a smaller gap for better text definition
  const gap = 6; 
  
  for (let y = 0; y < canvas.height; y += gap) {
    for (let x = 0; x < canvas.width; x += gap) {
      if (data[(y * canvas.width + x) * 4 + 3] > 128) {
        particles.push(new Particle(x, y));
      }
    }
  }
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach(p => p.draw());
  requestAnimationFrame(animate);
}

// Start sequence after 5 seconds
setTimeout(() => {
  function nextPhrase() {
    if (currentPhrase < phrases.length) {
      initText(phrases[currentPhrase]);
      setTimeout(nextPhrase, 4000);
      currentPhrase++;
    }
  }
  nextPhrase();
  animate();
}, 5000);
