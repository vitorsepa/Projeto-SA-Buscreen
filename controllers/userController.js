const pool = require('../config/db');
const { validateEmail, validatePassword } = require('../utils/validators');
const { hashPassword, comparePassword } = require('../utils/passwordUtils');

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

exports.loginUserGet = async (req, res) => {
  const { email, senha } = req.query;

  if (!email || !senha) {
    return res.status(400).json({ mensagem: 'Informe email e senha na URL.' });
  }

  if (!validateEmail(email)) {
    return res.status(400).json({ mensagem: 'E-mail inválido.' });
  }

  try {
    const result = await pool.query('SELECT * FROM usuarios WHERE LOWER(email) = LOWER($1)', [email]);

    if (result.rows.length === 0) {
      return res.status(404).json({ mensagem: 'Usuário não encontrado.' });
    }

    const usuario = result.rows[0];

    const senhaCorreta = await comparePassword(senha, usuario.senha);
    if (!senhaCorreta) {
      return res.status(401).json({ mensagem: 'Senha incorreta.' });
    }

    res.status(200).json({
      mensagem: 'Login bem-sucedido.',
      usuario: {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email
      }
    });
  } catch (error) {
    console.error('Erro no login GET:', error);
    res.status(500).json({ mensagem: 'Erro interno no servidor.' });
  }
};