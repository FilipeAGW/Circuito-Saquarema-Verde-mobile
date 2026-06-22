const { readData, writeData } = require('../config/database');

function list(req, res) {
  const data = readData();
  return res.json(data.recomendacoes || []);
}

function create(req, res) {
  const { title, text, trailId } = req.body;

  if (!title || !text) {
    return res.status(400).json({ error: 'Título e texto são obrigatórios.' });
  }

  const data = readData();
  const id = Date.now();
  const item = {
    id,
    title,
    text,
    trailId: trailId || null
  };

  data.recomendacoes = data.recomendacoes || [];
  data.recomendacoes.push(item);
  writeData(data);

  return res.status(201).json({ created: true, id });
}

function remove(req, res) {
  const id = String(req.params.id);
  const data = readData();
  const before = data.recomendacoes ? data.recomendacoes.length : 0;

  data.recomendacoes = (data.recomendacoes || []).filter(item => String(item.id) !== id);
  writeData(data);

  if ((data.recomendacoes || []).length === before) {
    return res.status(404).json({ error: 'Recomendação não encontrada.' });
  }

  return res.json({ deleted: true });
}

module.exports = { list, create, remove };
