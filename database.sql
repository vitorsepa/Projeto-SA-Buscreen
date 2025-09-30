CREATE TABLE usuarios (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(100),
  email VARCHAR(100) UNIQUE,
  cpf VARCHAR(14) UNIQUE,
  senha VARCHAR(255)
);

CREATE TABLE linhas (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(100),
  horario VARCHAR(50),
  rota TEXT
);

CREATE TABLE notificacoes (
  id SERIAL PRIMARY KEY,
  usuario_id INT REFERENCES usuarios(id),
  linha_id INT REFERENCES linhas(id),
  tipo_alerta VARCHAR(50),
  horario_alerta TIME
);
