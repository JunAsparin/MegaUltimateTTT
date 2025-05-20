const introCanvas = document.getElementById('intro-canvas');
const ictx = introCanvas.getContext('2d');

function resizeIntroCanvas() {
  introCanvas.width = window.innerWidth;
  introCanvas.height = window.innerHeight;
}

window.addEventListener('resize', resizeIntroCanvas);
resizeIntroCanvas();

const particles = [];
const particleCount = 80;

for (let i = 0; i < particleCount; i++) {
  particles.push({
    angle: Math.random() * 2 * Math.PI,
    radius: Math.random() * 200 + 50,
    speed: Math.random() * 0.005 + 0.002,
    size: Math.random() * 2 + 1,
    color: Math.random() > 0.5 ? '#0ff' : '#f0f'
  });
}

function drawParticles(time) {
  ictx.clearRect(0, 0, introCanvas.width, introCanvas.height);
  ictx.save();
  ictx.translate(introCanvas.width / 2, introCanvas.height / 2);

  for (let p of particles) {
    p.angle += p.speed;
    const x = Math.cos(p.angle) * p.radius;
    const y = Math.sin(p.angle) * p.radius;

    ictx.beginPath();
    ictx.arc(x, y, p.size, 0, Math.PI * 2);
    ictx.fillStyle = p.color;
    ictx.shadowBlur = 10;
    ictx.shadowColor = p.color;
    ictx.fill();
  }

  ictx.restore();
  requestAnimationFrame(drawParticles);
}

drawParticles();

setTimeout(() => {
  // Hide intro and show menu
  document.getElementById('intro-screen').style.display = 'none';
  document.getElementById('menu-screen').style.display = 'block';

  // Play background sound
  const spaceSound = document.getElementById('space-sound');
  spaceSound.play().catch(err => {
    console.warn('Autoplay prevented, waiting for user interaction...', err);
    // Fallback: play on first click if autoplay blocked
    const resumeAudio = () => {
      spaceSound.play();
      document.removeEventListener('click', resumeAudio);
    };
    document.addEventListener('click', resumeAudio);
  });
}, 5000);
