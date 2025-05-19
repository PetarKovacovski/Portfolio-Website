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
  'nodejs.svg',
];

const customBackgrounds = {
  'aws.svg': '#FF9900', // Amazon orange
  'codeforces.svg': '#EEEEEE', // light neutral
  'cpp.svg': '#00599C', // C++ blue
  'css.svg': '#264DE4', // CSS blue
  'docker.svg': '#0db7ed', // Docker blue
  'express.svg': '#FFFFFF', // White for Express
  'html.svg': '#E34C26', // HTML orange
  'javascript.svg': '#F0DB4F', // JS yellow
  'leetcode.svg': '#FFA116', // LeetCode gold
  'linux.svg': '#F2F2F2', // light gray
  'mongodb.svg': '#4DB33D', // Mongo green
  'postgresql.svg': '#336791', // PostgreSQL blue
  'react.svg': '#61DAFB', // React cyan
  'typescript.svg': '#3178C6', // TypeScript blue
  'nodejs.svg': '#8CC84B', // Node.js green
};

const container = document.getElementById('game-container');

const boxW = 60;
const boxH = 60;
const speed = 100;
const maxFPS = 120;
const frameInterval = 1000 / maxFPS;

const boxData = [];

function initBoxes() {
  document.getElementById('loading').style.display = 'none';

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

    const id = 'box-' + imgName.replace('.svg', '');
    box.setAttribute('id', id);

    container.appendChild(box);

    const x = Math.random() * (window.innerWidth - boxW);
    const y = Math.random() * (window.innerHeight - boxH);
    const dx = (Math.random() - 0.5) * speed;
    const dy = (Math.random() - 0.5) * speed;
    var paused = false;
    boxData.push({ element: box, x, y, dx, dy, paused });
  });
}

function removeTransition() {
  boxData.forEach((data) => {
    //data.element.style.transition = 'none'; //MORE LAGGY FOR SOME REASON. NOW TRANSITION IS FOLLOWING THE
  });
}

let loadedCount = 0;

skills.forEach((imgName) => {
  const img = new Image();
  img.src = `skills/${imgName}`;
  img.onload = () => {
    loadedCount++;
    if (loadedCount === skills.length) {
      setTimeout(() => {
        document.getElementById('loading').style.display = 'none';
        initBoxes();
        setTimeout(removeTransition, 2000);
        lastTime = performance.now();
        if ('requestIdleCallback' in window) {
          requestIdleCallback(() => requestAnimationFrame(animate));
        } else {
          requestAnimationFrame(animate);
        }
      }, 1500); //LOADING TIME
    }
  };
});

function animate(now) {
  const deltaTime = now - lastTime;
  const seconds = Math.min(deltaTime / 1000, 0.05);
  if (deltaTime >= frameInterval) {
    const seconds = deltaTime / 1000;
    lastTime = now;

    boxData.forEach((data) => {
      if (data.paused) {
        return;
      }
      data.x += data.dx * seconds;
      data.y += data.dy * seconds;
      if (data.x < 0) data.x = 0;
      if (data.y < 0) data.y = 0;
      if (data.x >= window.innerWidth - boxW) data.x = window.innerWidth - boxW;
      if (data.y >= window.innerHeight - boxH)
        data.y = window.innerHeight - boxH;
      if (data.x <= 0 || data.x >= window.innerWidth - boxW) data.dx *= -1;
      if (data.y <= 0 || data.y >= window.innerHeight - boxH) data.dy *= -1;

      data.element.style.transform = `translate3d(${data.x}px, ${data.y}px, 0) scale(1)`;
    });
  }

  requestAnimationFrame(animate);
}

window.addEventListener('resize', () => {
  boxData.forEach((data) => {
    data.paused = false; //Let them float.
    data.x = Math.min(data.x, window.innerWidth - boxW);
    data.y = Math.min(data.y, window.innerHeight - boxH);
  });
});

container.addEventListener('click', (e) => {
  for (const data of boxData) {
    const rect = data.element.getBoundingClientRect();
    if (
      e.clientX >= rect.left &&
      e.clientX <= rect.right &&
      e.clientY >= rect.top &&
      e.clientY <= rect.bottom
    ) {
      // Only runs once, on click
      const angle = Math.random() * 2 * Math.PI;
      data.dx = Math.cos(angle) * speed;
      data.dy = Math.sin(angle) * speed;
      break; // Stop after the first match
    }
  }
});

const stationGroupHTML = document.getElementsByClassName('station-group');
const stationGroups = Array.from(stationGroupHTML);

stationGroups.forEach((group) => {
  group.addEventListener('mouseenter', (e) => {
    const station = group.querySelector('.station');
    const skills = Array.from(station.children);
    skills.forEach((placeholder) => {
      const id = placeholder.id;
      const boxElement = document.getElementById(`box-${id}`);
      const match = boxData.find((b) => b.element === boxElement);

      const { x, y } = placeholder.getBoundingClientRect();
      match.paused = true;
      boxElement.style.transform = `translate3d(${x}px, ${y}px, 0) scale(1)`;
      boxElement.classList.add('paused');
    });
  });

  group.addEventListener('mouseleave', (e) => {
    const station = group.querySelector('.station');
    const skills = Array.from(station.children);
    skills.forEach((placeholder) => {
      const id = placeholder.id;
      const boxElement = document.getElementById(`box-${id}`);
      const match = boxData.find((b) => b.element === boxElement);
      match.paused = false;
      boxElement.classList.remove('paused');
    });
  });
});
