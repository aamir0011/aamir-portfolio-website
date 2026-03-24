document.getElementById('year').textContent = new Date().getFullYear();

// Mobile menu
const menuBtn = document.getElementById('menuBtn');
const navList = document.getElementById('navList');
if (menuBtn && navList) {
  menuBtn.addEventListener('click', () => navList.classList.toggle('open'));
}

// Smooth anchor scroll
for (const link of document.querySelectorAll('a[href^="#"]')) {
  link.addEventListener('click', (e) => {
    const href = link.getAttribute('href');
    if (!href || href.length < 2) return;
    const target = document.querySelector(href);
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    if (navList) navList.classList.remove('open');
  });
}

// Role ticker (landing)
const rolePrimary = document.getElementById('rolePrimary');
const roleSecondary = document.getElementById('roleSecondary');
const roleLineOne = document.getElementById('roleLineOne');
const roleLineTwo = document.getElementById('roleLineTwo');
const roles = [
  ['ENGINEER', 'SYSTEM BUILDER'],
  ['ML ENGINEER', 'COMPUTER VISION'],
  ['AI ENGINEER', 'AGENTIC AI'],
  ['DEVOPS', 'MLOPS']
];
let roleIndex = 0;
setInterval(() => {
  if (!rolePrimary || !roleSecondary || !roleLineOne || !roleLineTwo) return;
  const nextIndex = (roleIndex + 1) % roles.length;
  roleSecondary.textContent = roles[nextIndex][0];
  roleSecondary.style.top = '100%';
  rolePrimary.style.transition = roleSecondary.style.transition = 'transform .45s ease, top .45s ease';
  rolePrimary.style.transform = 'translateY(-100%)';
  roleSecondary.style.top = '0';

  roleLineTwo.style.opacity = '0';
  setTimeout(() => {
    rolePrimary.textContent = roles[nextIndex][0];
    rolePrimary.style.transition = 'none';
    rolePrimary.style.transform = 'translateY(0)';
    roleSecondary.style.transition = 'none';
    roleSecondary.style.top = '100%';

    roleLineOne.textContent = roles[nextIndex][1];
    roleLineTwo.textContent = roles[roleIndex][1];
    roleLineTwo.style.opacity = '1';
    roleIndex = nextIndex;
  }, 480);
}, 2600);

// Section reveal
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) entry.target.classList.add('visible');
  });
}, { threshold: 0.15 });

for (const el of document.querySelectorAll('.reveal')) observer.observe(el);

// Lightweight 3D hero scene (Three.js)
(function initHero3D() {
  const mount = document.getElementById('hero3d');
  if (!mount) return;
  if (typeof THREE === 'undefined') {
    initFallback3D(mount);
    return;
  }

  const scene = new THREE.Scene();
  scene.fog = new THREE.Fog(0x09090d, 3.5, 12);

  const camera = new THREE.PerspectiveCamera(45, mount.clientWidth / mount.clientHeight, 0.1, 100);
  camera.position.set(0, 0.4, 4.8);

  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    mount.appendChild(renderer.domElement);
  } catch (err) {
    initFallback3D(mount);
    return;
  }

  const ambient = new THREE.AmbientLight(0xffffff, 0.5);
  const key = new THREE.PointLight(0xc481ff, 1.4, 12);
  key.position.set(2, 2, 3);
  const fill = new THREE.PointLight(0x6cc6ff, 0.95, 12);
  fill.position.set(-2, -1.2, 2);
  scene.add(ambient, key, fill);

  const coreGeo = new THREE.TorusKnotGeometry(0.88, 0.22, 220, 32);
  const coreMat = new THREE.MeshStandardMaterial({
    color: 0xc2a0ff,
    roughness: 0.24,
    metalness: 0.42,
    emissive: 0x31184e,
    emissiveIntensity: 0.82
  });
  const coreMesh = new THREE.Mesh(coreGeo, coreMat);
  scene.add(coreMesh);

  const ringGeo = new THREE.TorusGeometry(1.9, 0.04, 20, 120);
  const ringMat = new THREE.MeshBasicMaterial({ color: 0x85b6ff, transparent: true, opacity: 0.58 });
  const ring = new THREE.Mesh(ringGeo, ringMat);
  ring.rotation.x = 1.15;
  scene.add(ring);

  const ring2Geo = new THREE.TorusGeometry(1.55, 0.03, 20, 120);
  const ring2Mat = new THREE.MeshBasicMaterial({ color: 0xd6a7ff, transparent: true, opacity: 0.45 });
  const ring2 = new THREE.Mesh(ring2Geo, ring2Mat);
  ring2.rotation.x = -0.95;
  ring2.rotation.y = 0.38;
  scene.add(ring2);

  const particlesCount = 300;
  const pGeo = new THREE.BufferGeometry();
  const positions = new Float32Array(particlesCount * 3);
  for (let i = 0; i < particlesCount; i++) {
    const i3 = i * 3;
    positions[i3] = (Math.random() - 0.5) * 8;
    positions[i3 + 1] = (Math.random() - 0.5) * 8;
    positions[i3 + 2] = (Math.random() - 0.5) * 8;
  }
  pGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  const pMat = new THREE.PointsMaterial({ color: 0xb692ff, size: 0.03, transparent: true, opacity: 0.8 });
  const points = new THREE.Points(pGeo, pMat);
  scene.add(points);

  let mouseX = 0;
  let mouseY = 0;
  let targetMouseX = 0;
  let targetMouseY = 0;
  window.addEventListener('mousemove', (e) => {
    const nx = (e.clientX / window.innerWidth) * 2 - 1;
    const ny = (e.clientY / window.innerHeight) * 2 - 1;
    targetMouseX = nx * 0.32;
    targetMouseY = ny * 0.18;
  });

  function onResize() {
    const w = mount.clientWidth || 300;
    const h = mount.clientHeight || 400;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  }
  window.addEventListener('resize', onResize);

  let raf = 0;
  const animate = (t) => {
    const time = t * 0.001;
    mouseX += (targetMouseX - mouseX) * 0.06;
    mouseY += (targetMouseY - mouseY) * 0.06;

    coreMesh.rotation.x = time * 0.28 + mouseY;
    coreMesh.rotation.y = time * 0.46 + mouseX;
    coreMesh.rotation.z = Math.sin(time * 0.42) * 0.12;

    ring.rotation.z = time * 0.22;
    ring2.rotation.z = -time * 0.18;
    ring2.rotation.y = 0.38 + Math.sin(time * 0.35) * 0.08;

    points.rotation.y = time * 0.035;
    points.rotation.x = time * 0.018;

    const breath = Math.sin(time * 0.9) * 0.06;
    coreMesh.position.y = breath;
    ring.position.y = breath * 0.5;
    ring2.position.y = -breath * 0.4;

    camera.position.x += (mouseX * 0.45 - camera.position.x) * 0.02;
    camera.position.y += ((0.4 - mouseY * 0.42) - camera.position.y) * 0.02;
    camera.lookAt(0, 0, 0);

    renderer.render(scene, camera);
    raf = requestAnimationFrame(animate);
  };

  onResize();
  raf = requestAnimationFrame(animate);

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) cancelAnimationFrame(raf);
    else raf = requestAnimationFrame(animate);
  });

  function initFallback3D(container) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    container.appendChild(canvas);

    const particles = Array.from({ length: 40 }, () => ({
      x: Math.random(),
      y: Math.random(),
      r: Math.random() * 2 + 0.8,
      s: Math.random() * 0.004 + 0.001
    }));

    const resize = () => {
      canvas.width = container.clientWidth;
      canvas.height = container.clientHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    let frame = 0;
    const draw = () => {
      frame += 0.01;
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      const cx = w / 2;
      const cy = h / 2;
      const grad = ctx.createRadialGradient(cx * 0.9, cy * 0.8, 20, cx, cy, Math.max(w, h) * 0.55);
      grad.addColorStop(0, 'rgba(196,129,255,0.32)');
      grad.addColorStop(1, 'rgba(8,8,12,0.02)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(frame * 0.7);
      ctx.strokeStyle = 'rgba(188,142,255,0.85)';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.ellipse(0, 0, w * 0.24, h * 0.2, 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.rotate(-frame * 1.35);
      ctx.strokeStyle = 'rgba(126,184,255,0.72)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.ellipse(0, 0, w * 0.18, h * 0.29, 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();

      particles.forEach((p) => {
        p.y += p.s;
        if (p.y > 1.08) p.y = -0.08;
        ctx.fillStyle = 'rgba(211,173,255,0.75)';
        ctx.beginPath();
        ctx.arc(p.x * w, p.y * h, p.r, 0, Math.PI * 2);
        ctx.fill();
      });

      requestAnimationFrame(draw);
    };
    requestAnimationFrame(draw);
  }
})();
