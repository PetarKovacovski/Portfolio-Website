const skills = [
  'aws.svg',
  'codeforces.svg',
  'cpp.svg',
  'css.svg',
  'docker.svg',
  'express.svg',
  'html.svg',
  'javascript.svg',
  'leetcode.svg',
  'linux.svg',
  'mongodb.svg',
  'postgresql.svg',
  'react.svg',
  'typescript.svg',
];

const customBackgrounds = {
  'aws.svg': 'radial-gradient(circle, #ff9900 0%, #ff6600 100%)',
  'codeforces.svg': 'linear-gradient(to right, #f5f5f5, #d9d9d9)',
  'cpp.svg': 'radial-gradient(circle, #004482 0%, #00599C 100%)',
  'css.svg': 'linear-gradient(135deg, #264de4 0%, #143bb5 100%)',
  'docker.svg': 'linear-gradient(to right, #0db7ed 0%, #117aa5 100%)',
  'express.svg': 'white',
  'html.svg': 'linear-gradient(135deg, #e34c26 0%, #bf360c 100%)',
  'javascript.svg': '#f0db4e',
  'leetcode.svg': 'linear-gradient(135deg, #f9aa33 0%, #ff6d00 100%)',
  'linux.svg': 'linear-gradient(to right, #f0f0f0 0%, #d0d0d0 100%)',
  'mongodb.svg': 'linear-gradient(to right, #4DB33D 0%, #2e7d32 100%)',
  'postgresql.svg': 'linear-gradient(135deg, #336791 0%, #1b3c59 100%)',
  'react.svg': 'linear-gradient(135deg, #00d8ff 0%, #006eff 100%)',
  'typescript.svg': '#3178c6',
};

const container = document.getElementById('game-container');

const boxW = 60;
const boxH = 60;
const speed = 80;
const maxFPS = 60;
const frameInterval = 1000 / maxFPS;

const boxData = [];

function initBoxes() {
  skills.forEach((imgName) => {
    const box = document.createElement('div');
    box.className = 'box';

    if (customBackgrounds[imgName]) {
      box.style.background = customBackgrounds[imgName];
    }

    const img = document.createElement('img');
    img.src = `skills/${imgName}`;
    img.alt = imgName;
    box.appendChild(img);

    container.appendChild(box);

    const x = Math.random() * (window.innerWidth - boxW);
    const y = Math.random() * (window.innerHeight - boxH);
    const dx = (Math.random() - 0.5) * speed;
    const dy = (Math.random() - 0.5) * speed;

    boxData.push({ element: box, x, y, dx, dy });
  });

  requestAnimationFrame(animate); // Start animation AFTER preload
}
initBoxes();

let lastTime = performance.now();

function animate(now) {
  const deltaTime = now - lastTime;

  if (deltaTime >= frameInterval) {
    const seconds = deltaTime / 1000;
    lastTime = now;

    boxData.forEach((data) => {
      data.x += data.dx * seconds;
      data.y += data.dy * seconds;

      if (data.x <= 0 || data.x >= window.innerWidth - boxW) data.dx *= -1;
      if (data.y <= 0 || data.y >= window.innerHeight - boxH) data.dy *= -1;

      data.element.style.transform = `translate(${data.x}px, ${data.y}px)`;
    });
  }

  requestAnimationFrame(animate);
}

window.addEventListener('resize', () => {
  boxData.forEach((data) => {
    data.x = Math.min(data.x, window.innerWidth - boxW);
    data.y = Math.min(data.y, window.innerHeight - boxH);
  });
});

container.addEventListener('click', (event) => {
  boxData.forEach((data) => {
    const boxRect = data.element.getBoundingClientRect();

    if (
      event.clientX >= boxRect.left &&
      event.clientX <= boxRect.right &&
      event.clientY >= boxRect.top &&
      event.clientY <= boxRect.bottom
    ) {
      const newSpeed = speed;
      const angle = Math.random() * 2 * Math.PI;
      data.dx = Math.cos(angle) * newSpeed;
      data.dy = Math.sin(angle) * newSpeed;
    }
  });
});

requestAnimationFrame(animate);
