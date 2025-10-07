// controllers/userController.js
const admin = require('../config/firebaseConfig');
const { validateEmail, validateCPF, validatePassword } = require('../utils/validators');
const { hashPassword } = require('../utils/passwordUtils');

exports.createUser = async (req, res) => {
  const { nome, email, cpf, senha } = req.body;

  console.log('Dados recebidos:', { nome, email, cpf, senha: '***' });

  // Validações robustas
  if (!nome || !email || !cpf || !senha) {
    return res.status(400).json({ 
      mensagem: 'Todos os campos são obrigatórios: nome, email, cpf, senha.' 
    });
  }

  if (!validateEmail(email)) {
    return res.status(400).json({ mensagem: 'E-mail inválido.' });
  }

  if (!validateCPF(cpf)) {
    return res.status(400).json({ mensagem: 'CPF inválido. Use o formato: 000.000.000-00' });
  }

  if (!validatePassword(senha)) {
    return res.status(400).json({ mensagem: 'Senha deve ter pelo menos 6 caracteres.' });
  }

  try {
    console.log('Iniciando cadastro no Firebase...');
    
    const db = admin.firestore();
    const userRef = db.collection('usuarios');
    
    console.log('Verificando duplicatas...');
    
    // Verificar duplicatas
    const [cpfExistente, emailExistente] = await Promise.all([
      userRef.where('cpf', '==', cpf).get(),
      userRef.where('email', '==', email.toLowerCase()).get()
    ]);

    console.log(`CPF existe? ${!cpfExistente.empty}`);
    console.log(`Email existe? ${!emailExistente.empty}`);

    if (!cpfExistente.empty) {
      return res.status(409).json({ mensagem: 'CPF já cadastrado.' });
    }

    if (!emailExistente.empty) {
      return res.status(409).json({ mensagem: 'E-mail já cadastrado.' });
    }

    console.log('Gerando hash da senha...');
    
    // ---------- Hash da senha ----------
    const senhaHash = await hashPassword(senha);

    console.log('Salvando usuário no Firestore...');
    
    // ---------- Criar usuário ----------
    const userDoc = await userRef.add({
      nome: nome.trim(),
      email: email.toLowerCase().trim(),
      cpf: cpf.trim(),
      senha: senhaHash,
      dataCriacao: new Date().toISOString()
    });

    console.log('Usuário criado com ID:', userDoc.id);

    res.status(201).json({ 
      mensagem: 'Usuário cadastrado com sucesso.',
      usuario: { nome, email },
      id: userDoc.id
    });

  } catch (error) {
    console.error('ERRO DETALHADO:', error);
    console.error('Stack trace:', error.stack);
    
    res.status(500).json({ 
      mensagem: 'Erro interno do servidor. Tente novamente.',
      erro: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};