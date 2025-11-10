CREATE TABLE IF NOT EXISTS usuarios (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  senha TEXT NOT NULL,
  data_criacao TIMESTAMP DEFAULT NOW()
);

-- Linhas de ônibus
CREATE TABLE IF NOT EXISTS linhas (
  id SERIAL PRIMARY KEY,
  companhia VARCHAR(100) NOT NULL,
  nome_linha VARCHAR(100) NOT NULL,
  lotacao_maxima INT NOT NULL,
  horario VARCHAR(20) NOT NULL,
  data_criacao TIMESTAMP DEFAULT NOW()
);
