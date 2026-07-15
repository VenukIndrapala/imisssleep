(function () {
  const canvas = document.getElementById("stars-text-canvas");
  const ctx = canvas.getContext("2d");
  let w = 0;
  let h = 0;

  function resize() {
    const dpr = window.devicePixelRatio || 1;
    w = window.innerWidth;
    h = window.innerHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width = w + "px";
    canvas.style.height = h + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  const phrases = [
    "Oh hey there",
    "Looks like you pulled through",
    "Once again...",
    "Couldn't be more proud ma'am",
    "Keep it up Queen",
  ];

  const STAR_COLOR = "#f4f1e6";

  function randRange(min, max) {
    return min + Math.random() * (max - min);
  }

  function samplePoints(text) {
    const off = document.createElement("canvas");
    off.width = w;
    off.height = h;
    const octx = off.getContext("2d");

    octx.textAlign = "center";
    octx.textBaseline = "middle";

    let fontSize = h * 0.06;
    const minFont = 16;
    const maxWidth = w * 0.88;
    octx.font = `500 ${fontSize}px Georgia, serif`;

    while (octx.measureText(text).width > maxWidth && fontSize > minFont) {
      fontSize -= 2;
      octx.font = `500 ${fontSize}px Georgia, serif`;
    }

    let lines = [text];
    if (octx.measureText(text).width > maxWidth) {
      const mid = Math.floor(text.length / 2);
      let splitIdx = text.lastIndexOf(" ", mid);
      if (splitIdx === -1) splitIdx = text.indexOf(" ", mid);
      if (splitIdx !== -1) {
        lines = [text.slice(0, splitIdx), text.slice(splitIdx + 1)];
      }
    }

    const cx = w / 2;
    const baseCy = h * 0.16;
    octx.fillStyle = "#fff";

    if (lines.length === 1) {
      octx.fillText(lines[0], cx, baseCy);
    } else {
      octx.fillText(lines[0], cx, baseCy - fontSize * 0.62);
      octx.fillText(lines[1], cx, baseCy + fontSize * 0.62);
    }

    const imageData = octx.getImageData(0, 0, w, h).data;
    const points = [];
    const gap = Math.max(2, Math.floor(fontSize / 14));
    const scanHeight = lines.length === 1 ? h * 0.3 : h * 0.42;

    for (let y = 0; y < scanHeight; y += gap) {
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
    this.color = STAR_COLOR;
    this.size = randRange(1.3, 2.6);
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
    ctx.shadowColor = this.color;
    ctx.shadowBlur = 3;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.shadowBlur = 0;
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
