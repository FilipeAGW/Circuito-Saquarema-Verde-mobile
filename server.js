require('dotenv').config();

const express = require('express');
const path = require('path');
const bcrypt = require('bcrypt');
const cors = require('cors');
const jwt = require('jsonwebtoken');

const { readData, writeData } = require('./config/database');

const trilhaRoutes = require('./routes/trilhaRoutes');
const lugarRoutes = require('./routes/lugarRoutes');
const recomendacaoRoutes = require('./routes/recomendacaoRoutes');

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'troque_por_uma_chave_local';

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/trilhas', trilhaRoutes);
app.use('/api/lugares', lugarRoutes);
app.use('/api/recomendacoes', recomendacaoRoutes);

function authMiddleware(req, res, next) {
  const header = req.headers.authorization;
  if (!header) return res.status(401).json({ error: 'Token ausente.' });

  const [scheme, token] = header.split(' ');
  if (scheme !== 'Bearer' || !token) {
    return res.status(401).json({ error: 'Token invalido.' });
  }

  try {
    req.user = jwt.verify(token, JWT_SECRET);
    return next();
  } catch (error) {
    return res.status(401).json({ error: 'Token invalido ou expirado.' });
  }
}

app.post('/api/auth/create-admin', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'Informe usuario e senha.' });
  }

  const data = readData();
  data.admins = data.admins || [];

  if (data.admins.length > 0) {
    return res.status(403).json({ error: 'Administrador inicial ja foi criado.' });
  }

  const hash = await bcrypt.hash(password, 10);
  const id = Date.now();
  data.admins.push({ id, username, password_hash: hash });
  writeData(data);

  return res.status(201).json({ id, username });
});

app.post('/api/auth/login', async (req, res) => {
  const { username, password } = req.body;
  const data = readData();
  const admin = (data.admins || []).find(item => item.username === username);

  if (!admin) return res.status(401).json({ error: 'Credenciais invalidas.' });

  const passwordOk = await bcrypt.compare(password, admin.password_hash);
  if (!passwordOk) return res.status(401).json({ error: 'Credenciais invalidas.' });

  const token = jwt.sign(
    { id: admin.id, username: admin.username },
    JWT_SECRET,
    { expiresIn: '8h' }
  );

  return res.json({ token, user: { id: admin.id, username: admin.username } });
});

app.use('/api/admin/trilhas', authMiddleware, trilhaRoutes);
app.use('/api/admin/lugares', authMiddleware, lugarRoutes);
app.use('/api/admin/recomendacoes', authMiddleware, recomendacaoRoutes);

app.get('/api/health', (req, res) => {
  res.json({ ok: true, app: 'Saquarema Verde' });
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
