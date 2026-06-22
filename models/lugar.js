// models/lugar.js
const { readData, writeData } = require('../config/database');

function getAll() {
  const data = readData();
  return data.lugares || [];
}

function getById(id) {
  const data = readData();
  return (data.lugares || []).find(x => String(x.id) === String(id)) || null;
}

function create(payload) {
  const data = readData();
  data.lugares = data.lugares || [];
  const id = Date.now();
  const newItem = {
    id,
    name: payload.name,
    description: payload.description || '',
    rules: payload.rules || ''
  };
  data.lugares.push(newItem);
  writeData(data);
  return newItem;
}

function update(id, payload) {
  const data = readData();
  data.lugares = data.lugares || [];
  const idx = data.lugares.findIndex(x => String(x.id) === String(id));
  if (idx === -1) return null;
  data.lugares[idx] = { ...data.lugares[idx], ...payload };
  writeData(data);
  return data.lugares[idx];
}

function remove(id) {
  const data = readData();
  const before = (data.lugares || []).length;
  data.lugares = (data.lugares || []).filter(x => String(x.id) !== String(id));
  writeData(data);
  return (data.lugares || []).length < before;
}

module.exports = { getAll, getById, create, update, remove };
