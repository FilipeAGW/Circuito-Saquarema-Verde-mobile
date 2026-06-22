// models/trilha.js
const { readData, writeData } = require('../config/database');

function getAll({ available, q } = {}) {
  const data = readData();
  let items = data.trails || [];
  if (available !== undefined) {
    const want = (available === '1' || available === 'true' || available === 1 || available === true);
    items = items.filter(t => !!t.available === want);
  }
  if (q) {
    const ql = String(q).toLowerCase();
    items = items.filter(t => (t.name||'').toLowerCase().includes(ql) || (t.description||'').toLowerCase().includes(ql));
  }
  return items;
}

function getById(id) {
  const data = readData();
  return (data.trails || []).find(t => String(t.id) === String(id)) || null;
}

function create(payload) {
  const data = readData();
  data.trails = data.trails || [];
  const id = Date.now();
  const newItem = {
    id,
    name: payload.name,
    description: payload.description || '',
    rules: payload.rules || '',
    season_start: payload.season_start || '',
    season_end: payload.season_end || '',
    available: !!payload.available
  };
  data.trails.push(newItem);
  writeData(data);
  return newItem;
}

function update(id, payload) {
  const data = readData();
  data.trails = data.trails || [];
  const idx = data.trails.findIndex(t => String(t.id) === String(id));
  if (idx === -1) return null;
  data.trails[idx] = {
    ...data.trails[idx],
    ...payload,
    available: payload.available === undefined ? data.trails[idx].available : !!payload.available
  };
  writeData(data);
  return data.trails[idx];
}

