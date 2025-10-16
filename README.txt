BUSCREEN BACKEND
Backend desenvolvido em **Node.js + Express + PostgreSQL** para o sistema **Buscreen**, que gerencia usuários e linhas de ônibus.  
O projeto inclui cadastro e login de usuários, além do gerenciamento de linhas (criação e consulta).

TECNOLOGIAS UTILIZADAS
- **Node.js**
- **Express.js**
- **PostgreSQL**
- **bcrypt** → Criptografia de senhas
- **dotenv** → Variáveis de ambiente
- **pg** → Driver PostgreSQL

CONFIGURAÇÕES DO AMBIENTE
- Para clonar o repositório bash
  https://github.com/vitorsepa/Projeto-SA-Buscreen.gitcd buscreen-backend
  cd SA-Mobilidade-3B-backend

- Nosso ENV
  PORT=3000
  DATABASE_URL=postgres://usuario:senha@localhost:5432/buscreen
  NODE_ENV=development

FUNCIONALIDADES
- 1 CADASTRO DE USUÁRIO
  Endpoint: POST /api/users/cadastro

  Exemplo:
  {
  "nome": "Seu nome",
  "email": "exemplo@teste.com",
  "senha": "123456"
  }

- 2 LOGIN
  Endpoint: GET /api/users/login?email=exemplo@teste.com&senha=123456

- 3 CADASTRO DE LINHAS DE ÔNIBUS
  Endpoint: POST /api/linhas/cadastro

  Exemplo: 
  {
  "companhia": "Biguaçu",
  "nome_linha": "Diretão",
  "lotacao_maxima": 50,
  "horario": "06:00 - 22:00"
  }

- 4 LISTAGEM DE TODAS AS LINHAS DE ÔNIBUS
  Endpoint: GET /api/linhas

- 5 RESGATANDO LINHA POR ID
  Endpoint: GET /api/linhas/1
