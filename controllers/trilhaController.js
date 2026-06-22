const { readData, writeData } = require('../config/database');

function list(req, res) {
  const { available, q } = req.query;
  const data = readData();
  let items = data.trails || [];

  if (available !== undefined) {
    items = items.filter(trilha => trilha.available === (available === '1' || available === 'true' || available === true));
  }

  if (q) {
    const query = q.toLowerCase();
    items = items.filter(trilha =>
      (trilha.name || '').toLowerCase().includes(query) ||
      (trilha.description || '').toLowerCase().includes(query) ||
      (trilha.location || '').toLowerCase().includes(query)
    );
  }

  return res.json(items);
}

function getOne(req, res) {
  const id = String(req.params.id);
  const data = readData();
  const trilha = (data.trails || []).find(item => String(item.id) === id);

  if (!trilha) return res.status(404).json({ error: 'Trilha não encontrada.' });

  return res.json(trilha);
}

function create(req, res) {
  const { name, description, difficulty, location, rules, season_start, season_end, available } = req.body;

  if (!name) return res.status(400).json({ error: 'Nome obrigatório.' });

  const data = readData();
  const id = Date.now();
  const trilha = {
    id,
    name,
    description: description || '',
    difficulty: difficulty || '',
    location: location || '',
    rules: rules || '',
    season_start: season_start || '',
    season_end: season_end || '',
    available: !!available
  };

  data.trails = data.trails || [];
  data.trails.push(trilha);
  writeData(data);

  return res.status(201).json({ created: true, id });
}

function update(req, res) {
  const id = String(req.params.id);
  const data = readData();
  data.trails = data.trails || [];

  const index = data.trails.findIndex(item => String(item.id) === id);
  if (index === -1) return res.status(404).json({ error: 'Trilha não encontrada.' });

  const body = req.body;
  data.trails[index] = {
    ...data.trails[index],
    ...body,
    available: body.available === undefined ? data.trails[index].available : !!body.available
  };

  writeData(data);
  return res.json({ updated: true });
}

function remove(req, res) {
  const id = String(req.params.id);
  const data = readData();
  const before = data.trails ? data.trails.length : 0;

  data.trails = (data.trails || []).filter(item => String(item.id) !== id);
  writeData(data);

  if ((data.trails || []).length === before) {
    return res.status(404).json({ error: 'Trilha não encontrada.' });
  }

  return res.json({ deleted: true });
}

module.exports = { list, getOne, create, update, remove };
