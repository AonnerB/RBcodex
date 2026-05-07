// === CURSOR ===
const cursor = document.getElementById('cursor');
const ring = document.getElementById('cursor-ring');
let mx = 0, my = 0, rx = 0, ry = 0;

document.addEventListener('mousemove', e => {
  mx = e.clientX; my = e.clientY;
  cursor.style.left = mx + 'px';
  cursor.style.top = my + 'px';
});

function animateRing() {
  rx += (mx - rx) * 0.12;
  ry += (my - ry) * 0.12;
  ring.style.left = rx + 'px';
  ring.style.top = ry + 'px';
  requestAnimationFrame(animateRing);
}
animateRing();

document.querySelectorAll('a, button, .service-card, .project-card, .team-card, .filter-btn, .add-project-card').forEach(el => {
  el.addEventListener('mouseenter', () => {
    cursor.style.width = '20px';
    cursor.style.height = '20px';
    ring.style.width = '60px';
    ring.style.height = '60px';
    ring.style.opacity = '0.8';
  });
  el.addEventListener('mouseleave', () => {
    cursor.style.width = '12px';
    cursor.style.height = '12px';
    ring.style.width = '36px';
    ring.style.height = '36px';
    ring.style.opacity = '0.5';
  });
});

// === PARTICLES ===
const pc = document.getElementById('particles');
for (let i = 0; i < 40; i++) {
  const p = document.createElement('div');
  p.className = 'particle';
  p.style.left = Math.random() * 100 + '%';
  p.style.width = (Math.random() * 3 + 1) + 'px';
  p.style.height = p.style.width;
  p.style.animationDuration = (Math.random() * 15 + 8) + 's';
  p.style.animationDelay = (Math.random() * 10) + 's';
  p.style.opacity = Math.random() * 0.6;
  pc.appendChild(p);
}

// === SCROLL REVEAL ===
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('visible'); }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

// === COUNT ANIMATION ===
function animateCount(el, target, suffix = '') {
  let start = 0;
  const dur = 1800;
  const step = (timestamp) => {
    if (!start) start = timestamp;
    const progress = Math.min((timestamp - start) / dur, 1);
    const ease = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.floor(ease * target) + suffix;
    if (progress < 1) requestAnimationFrame(step);
    else el.textContent = target + suffix;
  };
  requestAnimationFrame(step);
}

const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.querySelectorAll('[data-count]').forEach(el => {
        animateCount(el, parseInt(el.dataset.count));
      });
      statsObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.3 });

document.querySelector('.stats-grid') && statsObserver.observe(document.querySelector('.stats-grid'));

// === FILTER BUTTONS ===
document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;
    document.querySelectorAll('.project-card').forEach(card => {
      card.style.display = filter === 'all' || card.dataset.cat === filter ? '' : 'none';
    });
  });
});

// === PROJECTS PUBLICOS ===
// Edite esta lista para escolher quais projetos aparecem no site publico.
// Depois salve, envie para o GitHub e faca novo deploy na Vercel.
const projects = [
  {
    name: 'LONGEVITÉ | Geriatria e Medicina Integrada',
    cat: 'web', // web | site | mobile | system
    desc: 'Site institucional para clínica de geriatria e medicina integrada, com apresentação de serviços, programa de longevidade, responsável técnica, avaliações e contato via WhatsApp.',
    url: 'https://www.longevitegeriatria.com.br/',
    tech: 'HTML, CSS, JavaScript, Vercel'
  }
];

function renderProjects() {
  document.querySelectorAll('.project-card').forEach(c => c.remove());
  const grid = document.getElementById('projectsGrid');
  const addBtn = document.getElementById('addProjectBtn');

  // Remove o botao publico de adicionar projeto.
  if (addBtn) addBtn.remove();

  projects.forEach(p => {
    const card = document.createElement('div');
    card.className = 'project-card reveal';

    // Normaliza categorias antigas/alternativas para o filtro funcionar.
    const rawCat = (p.cat || 'web').toLowerCase().trim();
    const catMap = { site: 'web', sites: 'web', website: 'web', sistema: 'system', sistemas: 'system' };
    const cat = catMap[rawCat] || rawCat;
    card.dataset.cat = cat;

    const preview = (p.preview || '').trim();
    const isImage = /\.(png|jpe?g|gif|webp|svg)(\?.*)?$/i.test(preview);

    const previewContent = preview && isImage
      ? `<img src="${preview}" class="project-preview-img" alt="${p.name}">`
      : (p.url || preview)
        ? `<iframe src="${p.url || preview}" scrolling="no" loading="lazy"></iframe>`
        : `<div class="project-preview-placeholder"><div class="icon">⌨</div><span>${cat.toUpperCase()}</span></div>`;

    card.innerHTML = `
      <div class="project-preview">
        ${previewContent}
        <div class="preview-overlay">
          ${p.url ? `<a href="${p.url}" target="_blank" class="preview-btn">Ver Projeto →</a>` : '<span class="preview-btn" style="background:rgba(74,229,74,0.3)">Em Breve</span>'}
        </div>
      </div>
      <div class="project-info">
        <div class="project-cat">${cat}</div>
        <div class="project-name">${p.name}</div>
        <div class="project-desc">${p.desc}</div>
        <div class="project-tech">${(p.tech || 'Web').split(',').map(t => `<span class="tech-tag">${t.trim()}</span>`).join('')}</div>
      </div>
    `;

    grid.appendChild(card);
    setTimeout(() => {
      observer.observe(card);
      card.classList.add('visible');
    }, 50);
  });
}

renderProjects();

// === CONTACT ===
function submitContact() {
  const name = document.getElementById('contactName').value.trim();
  const email = document.getElementById('contactEmail').value.trim();
  const type = document.getElementById('contactType').value.trim();
  const message = document.getElementById('contactMessage').value.trim();
  const status = document.getElementById('formStatus');

  if (!status) {
    console.error('Elemento #formStatus não encontrado no HTML.');
    return;
  }

  status.textContent = '';
  status.style.color = 'red';

  if (!name || !email || !type || !message) {
    status.textContent = 'Preencha todos os campos.';
    showToast('Preencha todos os campos!');
    return;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    status.textContent = 'Digite um e-mail válido.';
    showToast('Digite um e-mail válido!');
    return;
  }

  status.style.color = '#333';
  status.textContent = 'Enviando...';

  fetch('http://localhost:3000/send-email', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      name,
      email,
      type,
      message
    })
  })
    .then(async (response) => {
      const data = await response.json();

      if (response.ok) {
        status.style.color = 'green';
        status.textContent = 'Mensagem enviada com sucesso.';
        showToast('Mensagem enviada com sucesso!');

        document.getElementById('contactName').value = '';
        document.getElementById('contactEmail').value = '';
        document.getElementById('contactType').value = '';
        document.getElementById('contactMessage').value = '';
      } else {
        status.style.color = 'red';
        status.textContent = data.error || 'Erro ao enviar mensagem.';
      }
    })
    .catch((error) => {
      console.error(error);
      status.style.color = 'red';
      status.textContent = 'Erro de conexão com o servidor.';
    });
}

// === TOAST ===
function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = '✓ ' + msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 3000);
}

// === NAVBAR SCROLL ===
window.addEventListener('scroll', () => {
  const nav = document.querySelector('nav');
  nav.style.borderBottomColor = window.scrollY > 50 ? 'rgba(74,229,74,0.3)' : 'rgba(74,229,74,0.1)';
});