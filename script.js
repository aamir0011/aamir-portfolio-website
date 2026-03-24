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
