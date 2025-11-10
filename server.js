const express = require('express');
const app = express();
require('dotenv').config();
const cors = require('cors');
const pool = require('./config/db');

app.use(cors());
app.use(express.json());

const userRoutes = require('./routes/userRoutes');
const linhaRoutes = require('./routes/linhaRoutes');

app.use('/api/users', userRoutes);
app.use('/api/linhas', linhaRoutes);

app.get('/health', async (req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({ status: 'OK', db: 'PostgreSQL', timestamp: new Date().toISOString() });
  } catch (err) {
    res.status(500).json({ status: 'Erro de conexão com DB', erro: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));