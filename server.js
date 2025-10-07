// server.js
const express = require('express');
const app = express();
require('dotenv').config();
const cors = require('cors');

// Tratamento de erros não capturados
process.on('uncaughtException', (error) => {
  console.error('💥 ERRO NÃO CAPTURADO:', error);
  console.error('📝 Stack:', error.stack);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('💥 PROMISE REJEITADA não tratada:', reason);
  console.error('📝 Na promise:', promise);
});

app.use(cors());
app.use(express.json());

// Middleware de log
app.use((req, res, next) => {
  console.log(`📥 ${req.method} ${req.url}`);
  next();
});

// Rota de saúde
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Importar e usar rotas
try {
  const userRoutes = require('./routes/userRoutes');
  app.use('/api/users', userRoutes);
  console.log('✅ Rotas carregadas com sucesso');
} catch (error) {
  console.error('❌ Erro ao carregar rotas:', error);
}

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
  console.log(`🌐 Health check: http://localhost:${PORT}/health`);
}).on('error', (err) => {
  console.error('❌ Erro no servidor:', err);
});