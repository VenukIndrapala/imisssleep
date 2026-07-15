(function () {
  const canvas = document.getElementById("fireworks-canvas");
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
  window.addEventListener("resize", resize);
  resize();

  function randRange(min, max) {
    return min + Math.random() * (max - min);
  }

  function randColor() {
    const hue = Math.floor(Math.random() * 360);
    return `hsl(${hue}, 100%, 60%)`;
  }

  function Rocket() {
    this.x = randRange(w * 0.15, w * 0.85);
    this.y = h;
    this.targetY = randRange(h * 0.15, h * 0.5);
    this.speed = randRange(6, 9);
    this.color = randColor();
  }

  Rocket.prototype.update = function () {
    this.y -= this.speed;
    return this.y <= this.targetY;
  };

  Rocket.prototype.draw = function () {
    ctx.beginPath();
    ctx.arc(this.x, this.y, 2, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();
  };

  function Particle(x, y, color) {
    this.x = x;
    this.y = y;
    const angle = Math.random() * Math.PI * 2;
    const speed = randRange(1, 6);
    this.vx = Math.cos(angle) * speed;
    this.vy = Math.sin(angle) * speed;
    this.color = color;
    this.alpha = 1;
    this.decay = randRange(0.008, 0.02);
    this.gravity = 0.05;
    this.size = randRange(1.5, 3);
  }

  Particle.prototype.update = function () {
    this.vy += this.gravity;
    this.x += this.vx;
    this.y += this.vy;
    this.alpha -= this.decay;
  };

  Particle.prototype.draw = function () {
    ctx.globalAlpha = Math.max(this.alpha, 0);
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.globalAlpha = 1;
  };

  const rockets = [];
  const particles = [];
  let firstExplosionFired = false;

  function explode(x, y, color) {
    const count = 60;
    for (let i = 0; i < count; i++) {
      particles.push(new Particle(x, y, color));
    }
    if (!firstExplosionFired) {
      firstExplosionFired = true;
      window.dispatchEvent(new CustomEvent("firstFireworkExploded"));
    }
  }

  function launchFirework() {
    rockets.push(new Rocket());
  }

  function loop() {
    ctx.fillStyle = "rgba(0, 0, 0, 0.15)";
    ctx.fillRect(0, 0, w, h);

    for (let i = rockets.length - 1; i >= 0; i--) {
      const r = rockets[i];
      r.draw();
      if (r.update()) {
        explode(r.x, r.y, r.color);
        rockets.splice(i, 1);
      }
    }

    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.update();
      p.draw();
      if (p.alpha <= 0) {
        particles.splice(i, 1);
      }
    }

    requestAnimationFrame(loop);
  }

  function scheduleNext() {
    const delay = randRange(1000, 2000);
    setTimeout(() => {
      launchFirework();
      if (Math.random() < 0.35) {
        launchFirework();
      }
      scheduleNext();
    }, delay);
  }

  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, w, h);
  loop();
  launchFirework();
  scheduleNext();
})();
