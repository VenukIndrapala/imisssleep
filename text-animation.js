const canvas = document.getElementById("text-canvas");
const ctx = canvas.getContext("2d");
let w, h;

function resize() {
  w = canvas.width = window.innerWidth;
  h = canvas.height = window.innerHeight * 0.4;
}
window.addEventListener("resize", resize);
resize();

const phrases = [
  "Oh hey there",
  "Looks like you pulled through",
  "Once again...",
  "Couldn't be more proud ma'am",
  "Keep it up Queen"
];

let currentPhraseIndex = 0;
let opacity = 0;
let fadeIn = true;

function drawText(text) {
  ctx.clearRect(0, 0, w, h);
  ctx.font = "bold 5vw Arial";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  
  // Shimmering effect via alpha oscillation
  const shimmer = 0.7 + Math.sin(Date.now() * 0.005) * 0.3;
  ctx.globalAlpha = shimmer;
  
  // Gold and Pink mix
  let gradient = ctx.createLinearGradient(0, 0, w, 0);
  gradient.addColorStop(0, "#ffd700");
  gradient.addColorStop(1, "#f2a6c2");
  
  ctx.fillStyle = gradient;
  ctx.fillText(text, w / 2, h / 2);
}

function animate() {
  drawText(phrases[currentPhraseIndex]);
  requestAnimationFrame(animate);
}

// Logic to loop through phrases once then stop
function startSequence() {
  if (currentPhraseIndex < phrases.length - 1) {
    setTimeout(() => {
      currentPhraseIndex++;
      startSequence();
    }, 4000); // 4 seconds per phrase
  }
}

animate();
startSequence();