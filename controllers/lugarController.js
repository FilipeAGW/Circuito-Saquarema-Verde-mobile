const { readData, writeData } = require('../config/database');

function list(req, res) {
  const data = readData();
  return res.json(data.lugares || []);
}

function getOne(req, res) {
  const id = String(req.params.id);
  const data = readData();
  const item = (data.lugares || []).find(lugar => String(lugar.id) === id);

  if (!item) return res.status(404).json({ error: 'Lugar não encontrado.' });

  return res.json(item);
}

function create(req, res) {
  const { name, description, rules } = req.body;

  if (!name) return res.status(400).json({ error: 'Nome obrigatório.' });

  const data = readData();
  const id = Date.now();
  const item = {
    id,
    name,
    description: description || '',
    rules: rules || ''
  };

  data.lugares = data.lugares || [];
  data.lugares.push(item);
  writeData(data);

  return res.status(201).json({ created: true, id });
}

function update(req, res) {
  const id = String(req.params.id);
  const data = readData();
  data.lugares = data.lugares || [];

  const index = data.lugares.findIndex(item => String(item.id) === id);
  if (index === -1) return res.status(404).json({ error: 'Lugar não encontrado.' });

  data.lugares[index] = { ...data.lugares[index], ...req.body };
  writeData(data);

  return res.json({ updated: true });
}

function remove(req, res) {
  const id = String(req.params.id);
  const data = readData();
  const before = data.lugares ? data.lugares.length : 0;

  data.lugares = (data.lugares || []).filter(item => String(item.id) !== id);
  writeData(data);

  if ((data.lugares || []).length === before) {
    return res.status(404).json({ error: 'Lugar não encontrado.' });
  }

  return res.json({ deleted: true });
}

module.exports = { list, getOne, create, update, remove };
