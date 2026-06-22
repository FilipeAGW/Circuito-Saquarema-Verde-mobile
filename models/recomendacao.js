// models/recomendacao.js
const { readData, writeData } = require('../config/database');

function getAll() {
  const data = readData();
  return data.recomendacoes || [];
}

function getById(id) {
  const data = readData();
  return (data.recomendacoes || []).find(x => String(x.id) === String(id)) || null;
}

function create(payload) {
  const data = readData();
  data.recomendacoes = data.recomendacoes || [];
  const id = Date.now();
  const newItem = {
    id,
    title: payload.title,
    text: payload.text,
    trailId: payload.trailId || null
  };
  data.recomendacoes.push(newItem);
  writeData(data);
  return newItem;
}

function remove(id) {
  const data = readData();
  const before = (data.recomendacoes || []).length;
  data.recomendacoes = (data.recomendacoes || []).filter(x => String(x.id) !== String(id));
  writeData(data);
  return (data.recomendacoes || []).length < before;
}

module.exports = { getAll, getById, create, remove };
