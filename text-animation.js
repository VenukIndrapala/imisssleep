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
    this.size = Math.random() * 1.5 + 0.5;
    this.baseX = x;
    this.baseY = y;
    this.density = Math.random() * 30 + 1;
    this.color = Math.random() > 0.5 ? '#ffd700' : '#f2a6c2';
  }
  draw() {
    ctx.fillStyle = this.color;
    ctx.globalAlpha = Math.random() * 0.5 + 0.5; // The "sparkle"
    ctx.beginPath();
    ctx.arc(this.x + (Math.random()-0.5), this.y + (Math.random()-0.5), this.size, 0, Math.PI * 2);
    ctx.fill();
  }
}

function initText(text) {
  particles = [];
  ctx.fillStyle = "white";
  ctx.font = "bold 8vw Arial";
  ctx.textAlign = "center";
  ctx.fillText(text, w / 2, h / 2);
  
  const data = ctx.getImageData(0, 0, w, h).data;
  ctx.clearRect(0, 0, w, h);
  
  for (let y = 0; y < h; y += 4) {
    for (let x = 0; x < w; x += 4) {
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

// Logic: Delay 5 seconds (2 fireworks), then cycle phrases
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
