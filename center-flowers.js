(function () {
  const flowers = document.querySelector(".flowers");
  if (!flowers) return;

  function getScaleX() {
    const style = getComputedStyle(flowers);
    if (style.transform === "none") return 1;
    const match = style.transform.match(/matrix\(([^)]+)\)/);
    if (!match) return 1;
    const m = match[1].split(",").map(Number);
    return Math.hypot(m[0], m[1]) || 1;
  }

  function centerFlowers() {
    // Reset any previous correction so we always measure the natural,
    // un-shifted position before computing a fresh one.
    flowers.style.setProperty("--auto-center-shift", "0px");
    // Force a reflow so the reset above is reflected before measuring.
    void flowers.offsetWidth;

    const scaleX = getScaleX();

    const all = flowers.querySelectorAll("*");
    let minLeft = Infinity;
    let maxRight = -Infinity;

    all.forEach((el) => {
      const r = el.getBoundingClientRect();
      if (r.width === 0 && r.height === 0) return;
      if (r.left < minLeft) minLeft = r.left;
      if (r.right > maxRight) maxRight = r.right;
    });

    if (minLeft === Infinity) return;

    const contentCenter = (minLeft + maxRight) / 2;
    const viewportCenter = window.innerWidth / 2;
    const shiftPx = viewportCenter - contentCenter;
    const shiftLocal = shiftPx / scaleX;

    flowers.style.setProperty("--auto-center-shift", shiftLocal + "px");
  }

  let resizeTimer = null;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(centerFlowers, 300);
  });

  // Wait for the bloom-in animations to settle into their resting
  // positions before measuring, so the correction is based on the
  // final layout rather than a mid-animation state.
  window.addEventListener("load", () => {
    setTimeout(centerFlowers, 7500);
  });
})();
