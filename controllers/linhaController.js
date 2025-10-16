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

exports.getLinhas = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM linhas ORDER BY id ASC');

    res.status(200).json({
      total: result.rows.length,
      linhas: result.rows
    });

  } catch (error) {
    console.error('Erro ao buscar linhas:', error);
    res.status(500).json({ mensagem: 'Erro ao buscar linhas.' });
  }
};

exports.getLinhaById = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query('SELECT * FROM linhas WHERE id = $1', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ mensagem: 'Linha não encontrada.' });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('Erro ao buscar linha:', error);
    res.status(500).json({ mensagem: 'Erro ao buscar linha.' });
  }
};