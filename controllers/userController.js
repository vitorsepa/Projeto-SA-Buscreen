const pool = require('../config/db');
const { validateEmail, validatePassword } = require('../utils/validators');
const { hashPassword } = require('../utils/passwordUtils');

exports.createUser = async (req, res) => {
  const { nome, email, senha } = req.body;

  if (!nome || !email || !senha) {
    return res.status(400).json({ mensagem: 'Todos os campos são obrigatórios.' });
  }

  if (!validateEmail(email)) {
    return res.status(400).json({ mensagem: 'E-mail inválido.' });
  }

  if (!validatePassword(senha)) {
    return res.status(400).json({ mensagem: 'Senha deve ter pelo menos 6 caracteres.' });
  }

  try {
    const checkUser = await pool.query(
      'SELECT * FROM usuarios WHERE LOWER(email) = LOWER($1)',
      [email]
    );

    if (checkUser.rows.length > 0) {
      return res.status(409).json({ mensagem: 'E-mail já cadastrado.' });
    }

    const senhaHash = await hashPassword(senha);

    const insertQuery = `
      INSERT INTO usuarios (nome, email, senha)
      VALUES ($1, LOWER($2), $3)
      RETURNING id, nome, email
    `;

    const novoUsuario = await pool.query(insertQuery, [nome.trim(), email.trim(), senhaHash]);

    res.status(201).json({
      mensagem: 'Usuário cadastrado com sucesso.',
      usuario: novoUsuario.rows[0]
    });
  } catch (error) {
    console.error('Erro ao criar usuário:', error);
    res.status(500).json({ mensagem: 'Erro interno do servidor.' });
  }
};
