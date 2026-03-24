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
  if (!mount || typeof THREE === 'undefined') return;

  const scene = new THREE.Scene();
  scene.fog = new THREE.Fog(0x09090d, 4, 11);

  const camera = new THREE.PerspectiveCamera(45, mount.clientWidth / mount.clientHeight, 0.1, 100);
  camera.position.set(0, 0.4, 4.8);

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setSize(mount.clientWidth, mount.clientHeight);
  mount.appendChild(renderer.domElement);

  const ambient = new THREE.AmbientLight(0xffffff, 0.45);
  const key = new THREE.PointLight(0xc481ff, 1.35, 12);
  key.position.set(2, 2, 3);
  const fill = new THREE.PointLight(0x6cc6ff, 0.9, 12);
  fill.position.set(-2, -1.2, 2);
  scene.add(ambient, key, fill);

  const coreGeo = new THREE.TorusKnotGeometry(0.9, 0.25, 160, 24);
  const coreMat = new THREE.MeshStandardMaterial({
    color: 0xb98bff,
    roughness: 0.28,
    metalness: 0.5,
    emissive: 0x2b1748,
    emissiveIntensity: 0.8
  });
  const coreMesh = new THREE.Mesh(coreGeo, coreMat);
  scene.add(coreMesh);

  const ringGeo = new THREE.TorusGeometry(1.9, 0.04, 20, 120);
  const ringMat = new THREE.MeshBasicMaterial({ color: 0x85b6ff, transparent: true, opacity: 0.65 });
  const ring = new THREE.Mesh(ringGeo, ringMat);
  ring.rotation.x = 1.15;
  scene.add(ring);

  const particlesCount = 350;
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
  window.addEventListener('mousemove', (e) => {
    const nx = (e.clientX / window.innerWidth) * 2 - 1;
    const ny = (e.clientY / window.innerHeight) * 2 - 1;
    mouseX = nx * 0.35;
    mouseY = ny * 0.2;
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
})();
