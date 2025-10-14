const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

pool.on('connect', () => {
  console.log('Conectado ao banco PostgreSQL com sucesso');
});

pool.on('error', (err) => {
  console.error('Erro de conexão com PostgreSQL:', err);
});

module.exports = pool;
