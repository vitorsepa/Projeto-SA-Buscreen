const admin = require('../config/firebaseConfig');

exports.createUser = async (req, res) => {
  const { nome, email, cpf, senha } = req.body;

  // Validação básica
  if (!nome || !email || !cpf || !senha) {
    return res.status(400).json({ mensagem: 'Preencha todos os campos.' });
  }

  try {
    const db = admin.firestore();
    const userRef = db.collection('usuarios');
    const cpfExistente = await userRef.where('cpf', '==', cpf).get();
    const emailExistente = await userRef.where('email', '==', email).get();

    if (!cpfExistente.empty || !emailExistente.empty) {
      return res.status(409).json({ mensagem: 'CPF ou e-mail já cadastrado.' });
    }

    await userRef.add({ nome, email, cpf, senha });
    res.status(201).json({ mensagem: 'Usuário cadastrado com sucesso.' });
  } catch (error) {
    res.status(500).json({ mensagem: 'Erro ao cadastrar usuário.' });
  }
};
