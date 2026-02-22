# Painel Central de Operações de TI

Este é um sistema completo de gestão interna de TI, composto por um backend Node.js + Prisma (PostgreSQL) e um frontend Desktop Windows baseado em Electron + React.

## Arquitetura

- **Backend:** Node.js, Express, Prisma ORM.
- **Banco de Dados:** PostgreSQL.
- **Frontend:** React + Vite + Electron.
- **Autenticação:** JWT com Role-Based Access Control (RBAC).

## Estrutura do Projeto

- `/backend`: API REST e modelagem do banco de dados.
- `/frontend`: Aplicação desktop e interface do usuário.

## Requisitos

- Node.js (v18 ou superior)
- PostgreSQL (Local ou Railway)

## Como rodar o Backend (Desenvolvimento)

1. Entre na pasta `backend`:
   ```bash
   cd backend
   ```
2. Instale as dependências:
   ```bash
   npm install
   ```
3. Configure o arquivo `.env` com sua `DATABASE_URL`.
4. Execute as migrações:
   ```bash
   npx prisma migrate dev --name init
   ```
5. Popule o banco com dados iniciais (Admin):
   ```bash
   npx prisma db seed
   ```
6. Inicie o servidor:
   ```bash
   npm run dev
   ```

## Como rodar o Frontend (Desenvolvimento)

1. Entre na pasta `frontend`:
   ```bash
   cd frontend
   ```
2. Instale as dependências:
   ```bash
   npm install
   ```
3. Inicie o Vite e o Electron:
   ```bash
   npm start
   ```

## Manual de Deploy na Railway

### 1. Criar Banco de Dados PostgreSQL
- No painel da Railway, clique em "New Project" -> "Provision PostgreSQL".
- Copie a `DATABASE_URL` fornecida.

### 2. Deploy do Backend
- Adicione um novo serviço apontando para o seu repositório Git ou use o CLI da Railway.
- Configure as seguintes variáveis de ambiente:
  - `DATABASE_URL`: A URL do banco provisionado.
  - `JWT_SECRET`: Uma chave segura qualquer.
  - `PORT`: 5000 (ou o valor desejado).
- O arquivo `railway.json` cuidará de rodar as migrações e iniciar o servidor.

## Geração do Executável Windows (.exe)

Para gerar o instalador Windows, execute dentro da pasta `frontend`:
```bash
npm run electron:build
```
O arquivo `.exe` será gerado na pasta `frontend/dist-electron`.

## Usuário Padrão (após o seed)
- **Email:** admin@painelti.com
- **Senha:** admin123
