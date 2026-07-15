(function () {
  const canvas = document.getElementById("stars-text-canvas");
  const ctx = canvas.getContext("2d");
  let w = 0;
  let h = 0;

  function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
  }

  const phrases = [
    "Oh hey there",
    "Looks like you pulled through",
    "Once again...",
    "Couldn't be more proud ma'am",
    "Keep it up Queen",
  ];

  const colors = ["#f2a6c2", "#e8b93a", "#f7d9a0", "#e8698f"];

  function randRange(min, max) {
    return min + Math.random() * (max - min);
  }

  function randColor() {
    return colors[Math.floor(Math.random() * colors.length)];
  }

  function samplePoints(text) {
    const off = document.createElement("canvas");
    off.width = w;
    off.height = h;
    const octx = off.getContext("2d");

    let fontSize = h * 0.055;
    octx.textAlign = "center";
    octx.textBaseline = "middle";
    octx.font = `700 ${fontSize}px Georgia, serif`;

    while (octx.measureText(text).width > w * 0.85 && fontSize > 10) {
      fontSize -= 2;
      octx.font = `700 ${fontSize}px Georgia, serif`;
    }

    const cx = w / 2;
    const cy = h * 0.16;
    octx.fillStyle = "#fff";
    octx.fillText(text, cx, cy);

    const imageData = octx.getImageData(0, 0, w, h).data;
    const points = [];
    const gap = Math.max(3, Math.floor(fontSize / 11));

    for (let y = 0; y < h * 0.32; y += gap) {
      for (let x = 0; x < w; x += gap) {
        const idx = (y * w + x) * 4 + 3;
        if (imageData[idx] > 128) {
          points.push({ x, y });
        }
      }
    }
    return points;
  }

  function Particle(target) {
    this.x = randRange(0, w);
    this.y = randRange(0, h * 0.32);
    this.target = target;
    this.color = randColor();
    this.size = randRange(1, 2.3);
    this.speed = randRange(0.045, 0.09);
    this.twinklePhase = Math.random() * Math.PI * 2;
  }

  Particle.prototype.retarget = function (target) {
    this.target = target;
  };

  Particle.prototype.update = function () {
    this.x += (this.target.x - this.x) * this.speed;
    this.y += (this.target.y - this.y) * this.speed;
    this.twinklePhase += 0.045;
  };

  Particle.prototype.draw = function () {
    const flicker = 0.55 + Math.sin(this.twinklePhase) * 0.45;
    ctx.globalAlpha = Math.max(flicker, 0.2);
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.globalAlpha = 1;
  };

  let particles = [];

  function shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function setTargets(points) {
    const shuffled = shuffle(points);

    if (particles.length === 0) {
      particles = shuffled.map((p) => new Particle(p));
      return;
    }

    for (let i = 0; i < shuffled.length; i++) {
      if (particles[i]) {
        particles[i].retarget(shuffled[i]);
      } else {
        particles.push(new Particle(shuffled[i]));
      }
    }

    if (particles.length > shuffled.length) {
      for (let i = shuffled.length; i < particles.length; i++) {
        particles[i].retarget({
          x: randRange(0, w),
          y: randRange(-h * 0.1, 0),
        });
      }
    }
  }

  let phraseIndex = 0;
  const HOLD_MS = 2400;
  const TRANSITION_MS = 1600;

  function showPhrase(index) {
    const points = samplePoints(phrases[index]);
    setTargets(points);
  }

  function advance() {
    if (phraseIndex >= phrases.length - 1) {
      return;
    }
    phraseIndex++;
    showPhrase(phraseIndex);
    if (phraseIndex < phrases.length - 1) {
      setTimeout(advance, TRANSITION_MS + HOLD_MS);
    }
  }

  function loop() {
    ctx.clearRect(0, 0, w, h);
    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw();
    }
    requestAnimationFrame(loop);
  }

  resize();
  window.addEventListener("resize", () => {
    resize();
    showPhrase(phraseIndex);
  });

  showPhrase(0);
  setTimeout(advance, TRANSITION_MS + HOLD_MS);
  loop();
})();
