const state = {
  trilhas: [],
  lugares: [],
  recomendacoes: [],
  activeTab: 'trilhas',
  query: ''
};

const endpoints = {
  trilhas: '/api/trilhas',
  lugares: '/api/lugares',
  recomendacoes: '/api/recomendacoes'
};

const statusLine = document.getElementById('statusLine');
const searchInput = document.getElementById('searchInput');

function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined && text !== null) node.textContent = text;
  return node;
}

async function getJson(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Falha ao carregar ${url}`);
  }
  return response.json();
}

function normalize(value) {
  return String(value || '').toLowerCase();
}

function matchesQuery(item, fields) {
  if (!state.query) return true;
  return fields.some(field => normalize(item[field]).includes(state.query));
}

function setStatus(message, tone = 'muted') {
  statusLine.textContent = message;
  statusLine.dataset.tone = tone;
}

function emptyMessage(message) {
  const box = el('div', 'empty-state');
  box.appendChild(el('strong', '', message));
  box.appendChild(el('p', '', 'Atualize os dados no painel administrativo ou tente outra busca.'));
  return box;
}

function renderTrail(trilha) {
  const card = el('article', 'info-card');
  const header = el('div', 'card-header');
  const title = el('h3', '', trilha.name || 'Trilha sem nome');
  const tag = el('span', trilha.available ? 'pill pill--open' : 'pill pill--closed', trilha.available ? 'Aberta' : 'Fechada');

  header.append(title, tag);
  card.appendChild(header);
  card.appendChild(el('p', 'card-copy', trilha.description || 'Sem descrição cadastrada.'));

  const meta = el('div', 'meta-grid');
  meta.appendChild(metaItem('Dificuldade', trilha.difficulty || 'Não informada'));
  meta.appendChild(metaItem('Local', trilha.location || 'Saquarema'));
  meta.appendChild(metaItem('Período', `${trilha.season_start || 'A consultar'} até ${trilha.season_end || 'A consultar'}`));
  card.appendChild(meta);

  if (trilha.rules) {
    card.appendChild(el('p', 'rules', trilha.rules));
  }

  return card;
}

function renderPlace(lugar) {
  const card = el('article', 'info-card');
  card.appendChild(el('h3', '', lugar.name || 'Lugar sem nome'));
  card.appendChild(el('p', 'card-copy', lugar.description || 'Sem descrição cadastrada.'));
  if (lugar.rules) card.appendChild(el('p', 'rules', lugar.rules));
  return card;
}

function renderRecommendation(recomendacao) {
  const card = el('article', 'info-card info-card--accent');
  card.appendChild(el('h3', '', recomendacao.title || 'Recomendação'));
  card.appendChild(el('p', 'card-copy', recomendacao.text || 'Sem texto cadastrado.'));
  return card;
}

function metaItem(label, value) {
  const item = el('div', 'meta-item');
  item.appendChild(el('span', '', label));
  item.appendChild(el('strong', '', value));
  return item;
}

function renderList(id, items, renderer, emptyText) {
  const container = document.getElementById(id);
  container.innerHTML = '';
  if (!items.length) {
    container.appendChild(emptyMessage(emptyText));
    return;
  }
  items.forEach(item => container.appendChild(renderer(item)));
}

function render() {
  const filteredTrails = state.trilhas.filter(item =>
    matchesQuery(item, ['name', 'description', 'difficulty', 'location', 'rules'])
  );
  const filteredPlaces = state.lugares.filter(item =>
    matchesQuery(item, ['name', 'description', 'rules'])
  );
  const filteredRecommendations = state.recomendacoes.filter(item =>
    matchesQuery(item, ['title', 'text'])
  );

  renderList('trilhas', filteredTrails, renderTrail, 'Nenhuma trilha encontrada.');
  renderList('lugares', filteredPlaces, renderPlace, 'Nenhum lugar encontrado.');
  renderList('recomendacoes', filteredRecommendations, renderRecommendation, 'Nenhuma regra encontrada.');

  document.getElementById('trailCount').textContent = filteredTrails.length;
  document.getElementById('placeCount').textContent = filteredPlaces.length;
  document.getElementById('recommendationCount').textContent = filteredRecommendations.length;
}

function setActiveTab(tabName) {
  state.activeTab = tabName;
  document.querySelectorAll('.tabbar__button').forEach(button => {
    button.classList.toggle('is-active', button.dataset.tab === tabName);
  });
  document.querySelectorAll('.panel').forEach(panel => {
    panel.classList.toggle('is-active', panel.id === `panel-${tabName}`);
  });
}

async function carregarDados() {
  try {
    const [trilhas, lugares, recomendacoes] = await Promise.all([
      getJson(endpoints.trilhas),
      getJson(endpoints.lugares),
      getJson(endpoints.recomendacoes)
    ]);

    state.trilhas = Array.isArray(trilhas) ? trilhas : [];
    state.lugares = Array.isArray(lugares) ? lugares : [];
    state.recomendacoes = Array.isArray(recomendacoes) ? recomendacoes : [];

    render();
    setStatus('Informações atualizadas.', 'success');
  } catch (error) {
    console.error(error);
    setStatus('Não foi possível carregar os dados agora.', 'error');
  }
}

document.querySelectorAll('.tabbar__button').forEach(button => {
  button.addEventListener('click', () => setActiveTab(button.dataset.tab));
});

searchInput.addEventListener('input', event => {
  state.query = normalize(event.target.value).trim();
  render();
});

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(error => console.warn('Service worker não registrado.', error));
  });
}

carregarDados();
