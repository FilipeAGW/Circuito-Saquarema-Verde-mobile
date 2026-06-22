const fs = require('fs');
const path = require('path');

const DATA_PATH = path.join(__dirname, '..', 'data.json');

const defaultData = {
  trails: [
    {
      id: 1,
      name: 'Circuito Verde de Saquarema',
      description: 'Percurso introdutorio para consulta de regras, cuidados e pontos naturais do circuito.',
      difficulty: 'Leve',
      location: 'Saquarema, RJ',
      rules: 'Permaneça na trilha, recolha seu lixo, respeite a fauna e evite som alto.',
      season_start: 'Ano todo',
      season_end: 'Ano todo',
      available: true
    }
  ],
  lugares: [
    {
      id: 1,
      name: 'Area natural de visitação',
      description: 'Ponto de apoio para orientar visitantes antes do passeio.',
      rules: 'Nao descarte residuos, nao retire plantas e siga a sinalizacao local.'
    }
  ],
  recomendacoes: [
    {
      id: 1,
      title: 'Antes de sair',
      text: 'Leve agua, protecao solar, calcado adequado e avise alguem sobre o trajeto.',
      trailId: null
    },
    {
      id: 2,
      title: 'Durante a visita',
      text: 'Caminhe apenas por areas permitidas, mantenha distancia de animais e nao acenda fogueiras.',
      trailId: null
    }
  ],
  admins: []
};

function ensureDataFile() {
  if (!fs.existsSync(DATA_PATH)) {
    fs.writeFileSync(DATA_PATH, JSON.stringify(defaultData, null, 2));
  }
}

function readData() {
  ensureDataFile();
  const data = fs.readFileSync(DATA_PATH, 'utf8');
  return JSON.parse(data);
}

function writeData(data) {
  fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2));
}

module.exports = { readData, writeData };
