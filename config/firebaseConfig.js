const admin = require('firebase-admin');
console.log('Iniciando configuração do Firebase...');

try {
  const serviceAccount = require('./firebase-key.json');
  
  console.log('rquivo firebase-key.json carregado');
  console.log('Project ID:', serviceAccount.project_id);
  
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: process.env.FIREBASE_DB_URL || `https://${serviceAccount.project_id}.firebaseio.com`
  });
  
  console.log('Firebase inicializado com sucesso!');
  
} catch (error) {
  console.error('ERRO no Firebase Config:', error.message);
  
  if (error.code === 'MODULE_NOT_FOUND') {
    console.log('O arquivo firebase-key.json não foi encontrado');
    console.log('Verifique se está na pasta config/');
  } else if (error.message.includes('private key')) {
    console.log('Problema na chave privada');
  }
  
  console.log('Continuando sem Firebase...');
}

module.exports = admin;