# 🚨 CORREÇÃO URGENTE - HostEver

## Problemas Identificados e Corrigidos

### 1. ❌ Erro de CORS
**Problema:** API retornando HTML ao invés de JSON  
**Causa:** Vite não estava usando proxy para as requisições `/api`  
**Solução:** Adicionado proxy no `vite.config.js`

### 2. ❌ Página de Setup em Branco
**Problema:** Página `/setup` não carregava  
**Causa:** Coluna `password` incorreta (deveria ser `password_hash`)  
**Solução:** Corrigido em `backend/routes/setup.js`

### 3. ❌ Registro de Clientes Não Funcionando
**Problema:** Botão de cadastro não finalizava  
**Causa:** Falta de colunas no banco de dados  
**Solução:** Criado script de migração urgente

## 🔧 Ações Necessárias IMEDIATAMENTE

### Passo 1: REINICIAR O FRONTEND
```bash
# Parar o frontend (Ctrl+C no terminal)
# Depois reiniciar:
cd c:\Users\Ramon\Desktop\HostEver\frontend
npm run dev
```

**IMPORTANTE:** O Vite precisa ser reiniciado para aplicar a configuração de proxy!

### Passo 2: EXECUTAR MIGRAÇÃO DO BANCO
```bash
# Opção 1: Via linha de comando
mysql -u root -p hostever_db < c:\Users\Ramon\Desktop\HostEver\backend\database\MIGRATION_URGENTE.sql

# Opção 2: Via phpMyAdmin ou MySQL Workbench
# Abra o arquivo MIGRATION_URGENTE.sql e execute todo o conteúdo
```

### Passo 3: VERIFICAR SE O BACKEND ESTÁ RODANDO
```bash
# O backend deve estar rodando em http://localhost:3001
# Verifique no terminal se não há erros
```

### Passo 4: CRIAR PRIMEIRO ADMINISTRADOR

Depois de reiniciar o frontend e executar a migração:

1. Acesse: `http://localhost:5173/setup`
2. Preencha:
   - Nome: Seu nome
   - E-mail: seu@email.com
   - Senha: Mínimo 8 caracteres (use uma senha forte!)
   - Confirme a senha
3. Clique em "Criar Administrador"

### Passo 5: TESTAR CADASTRO DE CLIENTE

1. Acesse: `http://localhost:5173/register`
2. Preencha todos os dados
3. Use dois e-mails iguais
4. Crie uma senha forte
5. Clique em "Criar Conta"

## ✅ Correções Aplicadas

### Backend
- ✅ `routes/setup.js` - Corrigido `password` → `password_hash`
- ✅ `server.js` - CORS já estava configurado corretamente
- ✅ `MIGRATION_URGENTE.sql` - Script de migração completo

### Frontend
- ✅ `vite.config.js` - Adicionado proxy `/api` → `http://localhost:3001`
- ✅ Todas as páginas usando URLs relativas `/api/...`

## 🔍 Como Validar se Está Funcionando

### 1. Página de Setup
- Acesse `http://localhost:5173/setup`
- Deve aparecer o formulário de criação
- Se aparecer "Verificando configuração..." e depois o formulário = OK
- Se redirecionar para login = Já existe admin (OK também)

### 2. Registro de Cliente
- Acesse `http://localhost:5173/register`
- Preencha o formulário
- Observe o console do navegador (F12)
- Não deve ter erros de CORS
- Não deve ter erros "Unexpected token '<'"
- Deve criar o usuário e redirecionar

### 3. Verificar Backend
Abra no navegador: `http://localhost:3001/api/health`

Deve retornar algo como:
```json
{
  "status": "ok",
  "message": "HostEver Backend API is running",
  "database": "connected",
  "timestamp": "2026-02-16T..."
}
```

## 🐛 Problemas Comuns

### "Fetch error" ou "CORS error"
**Solução:** Reinicie o frontend (Ctrl+C e `npm run dev` novamente)

### "Column doesn't exist"
**Solução:** Execute a migração SQL (Passo 2)

### Página em branco
**Solução:** 
1. Limpe o cache do navegador (Ctrl+Shift+Delete)
2. Recarregue a página (F5)
3. Verifique o console (F12)

### "Admin já cadastrado"
**Solução:** 
- Se você já criou um admin, use `/login` ao invés de `/setup`
- Para criar outros admins, use `/admin-dashboard/admins` após fazer login

## 📊 Status Atual

- ✅ CORS configurado
- ✅ Proxy do Vite configurado
- ✅ Rota de setup corrigida
- ✅ Script de migração criado
- ⚠️ **AGUARDANDO:** Reiniciar frontend
- ⚠️ **AGUARDANDO:** Executar migração SQL

## 🔒 Segurança em Produção

Após resolver o problema imediato:

1. **Altere o JWT_SECRET** no `backend/.env`
2. **Use HTTPS** em produção
3. **Configure SMTP** para envio de e-mails
4. **Faça backup** do banco de dados regularmente
5. **Altere a senha** do admin após primeiro login

## 📞 Próximos Passos

1. **Agora:** Execute os 5 passos acima
2. **Depois:** Configure SMTP em `/admin-dashboard/settings`
3. **Depois:** Teste todo o fluxo de cadastro
4. **Depois:** Adicione outros administradores se necessário

---

**Tempo estimado para correção:** 5-10 minutos

Se após seguir todos os passos ainda houver erro, envie:
1. Print do console do navegador (F12)
2. Logs do terminal do backend
3. Logs do terminal do frontend
