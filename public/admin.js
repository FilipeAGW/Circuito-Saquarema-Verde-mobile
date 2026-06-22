let token = sessionStorage.getItem('saquarema_token') || '';

const statusBox = document.getElementById('adminStatus');

function setAdminStatus(message, tone = 'muted') {
  statusBox.textContent = message;
  statusBox.dataset.tone = tone;
}

function readValue(id) {
  return document.getElementById(id).value.trim();
}

function setLockedFormsEnabled(enabled) {
  document.querySelectorAll('.locked-form input, .locked-form textarea, .locked-form select, .locked-form button')
    .forEach(field => {
      field.disabled = !enabled;
    });
}

async function postJson(url, body, authenticated = false) {
  const headers = { 'Content-Type': 'application/json' };
  if (authenticated) headers.Authorization = `Bearer ${token}`;

  const response = await fetch(url, {
    method: 'POST',
    headers,
    body: JSON.stringify(body)
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.error || 'Não foi possível concluir a operação.');
  }

  return data;
}

document.getElementById('setupForm').addEventListener('submit', async event => {
  event.preventDefault();
  try {
    await postJson('/api/auth/create-admin', {
      username: readValue('setupUser'),
      password: readValue('setupPass')
    });
    event.target.reset();
    setAdminStatus('Administrador criado. Agora faça login.', 'success');
  } catch (error) {
    setAdminStatus(error.message, 'error');
  }
});

document.getElementById('loginForm').addEventListener('submit', async event => {
  event.preventDefault();
  try {
    const data = await postJson('/api/auth/login', {
      username: readValue('loginUser'),
      password: readValue('loginPass')
    });
    token = data.token;
    sessionStorage.setItem('saquarema_token', token);
    setLockedFormsEnabled(true);
    setAdminStatus('Login realizado. Cadastros liberados.', 'success');
  } catch (error) {
    setAdminStatus(error.message, 'error');
  }
});

document.getElementById('trailForm').addEventListener('submit', async event => {
  event.preventDefault();
  try {
    await postJson('/api/admin/trilhas', {
      name: readValue('tNome'),
      description: readValue('tDesc'),
      difficulty: readValue('tDifficulty'),
      location: readValue('tLocation'),
      rules: readValue('tRules'),
      season_start: readValue('tStart'),
      season_end: readValue('tEnd'),
      available: document.getElementById('tAtiva').value === 'true'
    }, true);
    event.target.reset();
    setAdminStatus('Trilha cadastrada.', 'success');
  } catch (error) {
    setAdminStatus(error.message, 'error');
  }
});

document.getElementById('placeForm').addEventListener('submit', async event => {
  event.preventDefault();
  try {
    await postJson('/api/admin/lugares', {
      name: readValue('lNome'),
      description: readValue('lDesc'),
      rules: readValue('lRules')
    }, true);
    event.target.reset();
    setAdminStatus('Lugar cadastrado.', 'success');
  } catch (error) {
    setAdminStatus(error.message, 'error');
  }
});

document.getElementById('recommendationForm').addEventListener('submit', async event => {
  event.preventDefault();
  try {
    await postJson('/api/admin/recomendacoes', {
      title: readValue('rTitulo'),
      text: readValue('rTexto')
    }, true);
    event.target.reset();
    setAdminStatus('Recomendação cadastrada.', 'success');
  } catch (error) {
    setAdminStatus(error.message, 'error');
  }
});

setLockedFormsEnabled(Boolean(token));
if (token) {
  setAdminStatus('Sessão recuperada. Cadastros liberados.', 'success');
}
