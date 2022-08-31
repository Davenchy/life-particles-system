let animating = false;
const canvas = document.getElementById("my_canvas");
const ctx = canvas.getContext("2d");
const particlesSystem = new ParticlesSystem();

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

window.addEventListener("resize", e => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});

document.body.appendChild(canvas);

const gui = new GUI(applySimulationChanges);
gui.load(); // load local storage
applySimulationChanges(); // apply loaded changes

window.addEventListener("keydown", e => {
  if (e.code === "Space") {
    animating = !animating;
    if (animating) animate();
  } else if (e.key === "g" && e.ctrlKey) {
    gui.toggle();
    e.preventDefault();
  } else if (e.key === "s" && e.ctrlKey) {
    applySimulationChanges();
    e.preventDefault();
  }
});

function applySimulationChanges() {
  particlesSystem.particles.length = 0;
  gui.options.forEach(o => {
    o.rules.forEach(r => particlesSystem.setRule(r.color, r.target, r.value));

    for (let i = 0; i < o.value; i++) {
      particlesSystem.particles.push(new Particle(o.color));
    }
  });
  gui.save();
  gui.update();
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particlesSystem.update(ctx);
  if (animating) requestAnimationFrame(animate);
}

if (animating) animate();
