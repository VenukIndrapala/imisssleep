const canvas = document.getElementById("text-canvas");
const ctx = canvas.getContext("2d");
let w, h;

const phrases = [
  "Oh hey there",
  "Looks like you pulled through",
  "Once again...",
  "Couldn't be more proud ma'am",
  "Keep it up Queen"
];

let particles = [];
let currentPhrase = 0;

function resize() {
  w = canvas.width = window.innerWidth;
  h = canvas.height = window.innerHeight * 0.4;
}
window.addEventListener("resize", resize);
resize();

class Particle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.size = Math.random() * 1.8 + 0.8; // Slightly larger for clarity
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
  // Reduced font size to prevent wrapping/overflow
  ctx.font = "bold 6vw Arial"; 
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.clearRect(0, 0, w, h);
  ctx.fillText(text, w / 2, h / 2);
  
  const data = ctx.getImageData(0, 0, w, h).data;
  ctx.clearRect(0, 0, w, h);
  
  // INCREASED sampling gap from 4 to 8 to stop jumbling
  for (let y = 0; y < h; y += 8) {
    for (let x = 0; x < w; x += 8) {
      if (data[(y * w + x) * 4 + 3] > 128) {
        particles.push(new Particle(x, y));
      }
    }
  }
}

function animate() {
  ctx.clearRect(0, 0, w, h);
  particles.forEach(p => p.draw());
  requestAnimationFrame(animate);
}

// Logic: Delay 5 seconds, then cycle phrases
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
