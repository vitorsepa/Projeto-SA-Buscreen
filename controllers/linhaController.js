// controllers/linhaController.js
const pool = require('../config/db');

exports.createLinha = async (req, res) => {
  const { companhia, nome_linha, lotacao_maxima, horario } = req.body;

  if (!companhia || !nome_linha || !lotacao_maxima || !horario) {
    return res.status(400).json({ mensagem: 'Todos os campos são obrigatórios.' });
  }

  try {
    const insertQuery = `
      INSERT INTO linhas (companhia, nome_linha, lotacao_maxima, horario)
      VALUES ($1, $2, $3, $4)
      RETURNING id, companhia, nome_linha, lotacao_maxima, horario
    `;

    const result = await pool.query(insertQuery, [
      companhia.trim(),
      nome_linha.trim(),
      lotacao_maxima,
      horario.trim()
    ]);

    res.status(201).json({
      mensagem: 'Linha cadastrada com sucesso.',
      linha: result.rows[0]
    });

  } catch (error) {
    console.error('Erro ao cadastrar linha:', error);
    res.status(500).json({ mensagem: 'Erro interno do servidor.' });
  }
};
