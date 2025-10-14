const pool = require('../config/db');
const { validateEmail, validateCPF, validatePassword } = require('../utils/validators');
const { hashPassword } = require('../utils/passwordUtils');

exports.createUser = async (req, res) => {
  const { nome, email, cpf, senha } = req.body;

  console.log('Dados recebidos:', { nome, email, cpf, senha: '***' });

  if (!nome || !email || !cpf || !senha) {
    return res.status(400).json({ mensagem: 'Todos os campos são obrigatórios.' });
  }

  if (!validateEmail(email)) return res.status(400).json({ mensagem: 'E-mail inválido.' });
  if (!validateCPF(cpf)) return res.status(400).json({ mensagem: 'CPF inválido.' });
  if (!validatePassword(senha)) return res.status(400).json({ mensagem: 'Senha deve ter pelo menos 6 caracteres.' });

  try {
    console.log('Verificando duplicatas no banco...');

    const checkQuery = `
      SELECT * FROM usuarios WHERE cpf = $1 OR LOWER(email) = LOWER($2)
    `;
    const result = await pool.query(checkQuery, [cpf, email]);

    if (result.rows.length > 0) {
      const existente = result.rows[0];
      if (existente.cpf === cpf) return res.status(409).json({ mensagem: 'CPF já cadastrado.' });
      if (existente.email.toLowerCase() === email.toLowerCase()) return res.status(409).json({ mensagem: 'E-mail já cadastrado.' });
    }

    console.log('Gerando hash da senha...');
    const senhaHash = await hashPassword(senha);

    console.log('Inserindo usuário no PostgreSQL...');
    const insertQuery = `
      INSERT INTO usuarios (nome, email, cpf, senha, data_criacao)
      VALUES ($1, LOWER($2), $3, $4, NOW())
      RETURNING id, nome, email
    `;

    const novoUsuario = await pool.query(insertQuery, [nome.trim(), email.trim(), cpf.trim(), senhaHash]);
    const usuario = novoUsuario.rows[0];

    res.status(201).json({
      mensagem: 'Usuário cadastrado com sucesso.',
      usuario
    });

  } catch (error) {
    console.error('ERRO DETALHADO:', error);
    res.status(500).json({ mensagem: 'Erro interno do servidor.' });
  }
};
