const canvas = document.getElementById('background-canvas');
const ctx = canvas.getContext('2d');

let stars = [];
const numStars = 120;

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

function initStars() {
  stars = [];
  for (let i = 0; i < numStars; i++) {
    stars.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      radius: Math.random() * 1.5 + 0.5,
      dx: (Math.random() - 0.5) * 0.4,
      dy: (Math.random() - 0.5) * 0.4
    });
  }
}
initStars();

// --- Galaxy Swirl ---
let swirlAngle = 0;
function drawGalaxySwirl() {
  swirlAngle += 0.002;
  const numArms = 4;
  const numDots = 100;

  for (let i = 0; i < numArms; i++) {
    for (let j = 0; j < numDots; j++) {
      const angle = swirlAngle + i * (2 * Math.PI / numArms) + j * 0.1;
      const radius = j * 2;
      const x = canvas.width / 2 + Math.cos(angle) * radius;
      const y = canvas.height / 2 + Math.sin(angle) * radius;

      ctx.beginPath();
      ctx.arc(x, y, 0.8, 0, 2 * Math.PI);
      ctx.fillStyle = `rgba(255, ${100 + j}, 255, ${0.01 + j / 1500})`;
      ctx.fill();
    }
  }
}

// --- Animate Everything ---
function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Swirling galaxy
  drawGalaxySwirl();

  // Floating stars
  ctx.fillStyle = '#0ff';
  for (let star of stars) {
    ctx.beginPath();
    ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
    ctx.fill();

    star.x += star.dx;
    star.y += star.dy;

    // Wrap around edges
    if (star.x < 0) star.x = canvas.width;
    if (star.x > canvas.width) star.x = 0;
    if (star.y < 0) star.y = canvas.height;
    if (star.y > canvas.height) star.y = 0;
  }

  requestAnimationFrame(animate);


  function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Swirling galaxy
  drawGalaxySwirl();

  // Floating stars
  ctx.fillStyle = '#0ff';
  for (let star of stars) {
    ctx.beginPath();
    ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
    ctx.fill();

    star.x += star.dx;
    star.y += star.dy;

    // Wrap around edges
    if (star.x < 0) star.x = canvas.width;
    if (star.x > canvas.width) star.x = 0;
    if (star.y < 0) star.y = canvas.height;
    if (star.y > canvas.height) star.y = 0;
  }

  // New planets
  animatePlanets();

  requestAnimationFrame(animate);
  }

}

animate();

// --- Planets data ---
let planets = [
  {
    x: canvas.width * 0.2,
    y: canvas.height * 0.3,
    radius: 40,
    color: 'rgba(255, 150, 100, 0.7)',
    ringRadius: 55,
    ringColor: 'rgba(255, 180, 130, 0.5)',
    angle: 0,
    rotationSpeed: 0.002,
    dx: 0.05,
    dy: 0.02
  },
  {
    x: canvas.width * 0.7,
    y: canvas.height * 0.7,
    radius: 60,
    color: 'rgba(100, 180, 255, 0.7)',
    ringRadius: 75,
    ringColor: 'rgba(100, 220, 255, 0.3)',
    angle: 0,
    rotationSpeed: -0.0015,
    dx: -0.03,
    dy: 0.01
  },
  {
    x: canvas.width * 0.85,
    y: canvas.height * 0.25,
    radius: 30,
    color: 'rgba(180, 255, 120, 0.6)',
    ringRadius: 45,
    ringColor: 'rgba(200, 255, 150, 0.4)',
    angle: 0,
    rotationSpeed: 0.0025,
    dx: -0.02,
    dy: 0.03
  }
];

// Draw a planet with glow and ring
function drawPlanet(planet) {
  // Glow
  const glowGradient = ctx.createRadialGradient(
    planet.x, planet.y, planet.radius * 0.8,
    planet.x, planet.y, planet.radius * 1.8
  );
  glowGradient.addColorStop(0, planet.color);
  glowGradient.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = glowGradient;
  ctx.beginPath();
  ctx.arc(planet.x, planet.y, planet.radius * 1.8, 0, 2 * Math.PI);
  ctx.fill();

  // Planet body
  const bodyGradient = ctx.createRadialGradient(
    planet.x - planet.radius * 0.3,
    planet.y - planet.radius * 0.3,
    planet.radius * 0.1,
    planet.x,
    planet.y,
    planet.radius
  );
  bodyGradient.addColorStop(0, '#fff');
  bodyGradient.addColorStop(1, planet.color);
  ctx.fillStyle = bodyGradient;
  ctx.beginPath();
  ctx.arc(planet.x, planet.y, planet.radius, 0, 2 * Math.PI);
  ctx.fill();

  // Rotating ring
  ctx.save();
  ctx.translate(planet.x, planet.y);
  ctx.rotate(planet.angle);
  ctx.strokeStyle = planet.ringColor;
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.ellipse(0, 0, planet.ringRadius, planet.ringRadius * 0.3, 0, 0, 2 * Math.PI);
  ctx.stroke();
  ctx.restore();
}

// Animate planets
function animatePlanets() {
  planets.forEach(planet => {
    planet.angle += planet.rotationSpeed;
    planet.x += planet.dx;
    planet.y += planet.dy;

    // Wrap planets around edges smoothly
    if (planet.x - planet.ringRadius > canvas.width) planet.x = -planet.ringRadius;
    if (planet.x + planet.ringRadius < 0) planet.x = canvas.width + planet.ringRadius;
    if (planet.y - planet.ringRadius > canvas.height) planet.y = -planet.ringRadius;
    if (planet.y + planet.ringRadius < 0) planet.y = canvas.height + planet.ringRadius;

    drawPlanet(planet);
  });
}