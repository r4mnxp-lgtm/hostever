# HostEver - Guia de Instalação em VPS

Este guia explica como instalar e configurar o HostEver em um servidor VPS Ubuntu/Debian.

## Pré-requisitos

- VPS com Ubuntu 20.04+ ou Debian 11+
- Acesso root ou sudo
- Domínio apontando para o IP do servidor (opcional, mas recomendado)
- MySQL instalado ou acesso a um servidor MySQL

## Instalação Automática

### 1. Fazer upload dos arquivos

Faça upload de todos os arquivos do projeto para o servidor:

```bash
# Opção 1: Via Git (recomendado)
cd /var/www
sudo git clone <seu-repositorio> hostever

# Opção 2: Via SCP/SFTP
# Faça upload dos arquivos para /var/www/hostever
```

### 2. Executar o script de instalação

```bash
cd /var/www/hostever
chmod +x install.sh
./install.sh
```

O script irá:
- Atualizar o sistema
- Instalar Node.js, PM2, Nginx e MySQL (se necessário)
- Configurar variáveis de ambiente
- Instalar dependências do Backend e Frontend
- Criar banco de dados e executar migrations
- Fazer build do Frontend
- Configurar PM2 para o Backend
- Configurar Nginx como proxy reverso
- Opcionalmente instalar SSL com Let's Encrypt

### 3. Criar usuário administrador

Após a instalação, crie um usuário admin:

```bash
cd /var/www/hostever/backend
node scripts/createAdmin.js
```

Siga as instruções para criar o usuário admin.

### 4. Reiniciar o backend

```bash
pm2 restart hostever-backend
```

### 5. Acessar o sistema

Acesse o sistema através do domínio configurado ou IP do servidor.

## Instalação Manual

Se preferir instalar manualmente, siga os passos abaixo:

### 1. Instalar Node.js

```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs
```

### 2. Instalar PM2

```bash
sudo npm install -g pm2
```

### 3. Instalar MySQL

```bash
sudo apt install -y mysql-server
sudo mysql_secure_installation
```

### 4. Configurar projeto

```bash
cd /var/www/hostever

# Configurar Backend
cd backend
cp .env.example .env
nano .env  # Edite com suas configurações
npm install

# Configurar Frontend
cd ../frontend
npm install
npm run build

cd ..
```

### 5. Criar banco de dados

```bash
mysql -u root -p

CREATE DATABASE hostever CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
exit;

# Executar migrations
cd /var/www/hostever/backend
mysql -u root -p hostever < database/01-schema.sql
mysql -u root -p hostever < database/02-initial-data.sql
```

### 6. Criar usuário admin

```bash
cd /var/www/hostever/backend
node scripts/createAdmin.js
```

### 7. Iniciar Backend com PM2

```bash
pm2 start /var/www/hostever/backend/server.js --name hostever-backend
pm2 save
pm2 startup
```

### 8. Configurar Nginx

Crie o arquivo `/etc/nginx/sites-available/hostever`:

```nginx
server {
    listen 80;
    server_name seu-dominio.com www.seu-dominio.com;

    # Frontend
    location / {
        root /var/www/hostever/frontend/dist;
        try_files $uri $uri/ /index.html;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Uploads
    location /uploads {
        proxy_pass http://localhost:3001;
    }
}
```

Ative o site:

```bash
sudo ln -s /etc/nginx/sites-available/hostever /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### 9. Instalar SSL (opcional, mas recomendado)

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d seu-dominio.com -d www.seu-dominio.com
```

## Configuração das Variáveis de Ambiente

### Backend (.env)

```env
# Porta do servidor
PORT=3001

# MySQL
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_USER=seu_usuario
MYSQL_PASSWORD=sua_senha
MYSQL_DATABASE=hostever

# MercadoPago
MERCADOPAGO_ACCESS_TOKEN=seu_token_aqui

# Frontend URL
VITE_APP_URL=https://seu-dominio.com

# Virtualizor
VITE_VIRTUALIZOR_HOST=https://panel.hostever.com:4083
VITE_VIRTUALIZOR_API_KEY=sua_api_key
VITE_VIRTUALIZOR_API_PASS=sua_api_pass
```

## Comandos Úteis

### PM2

```bash
# Ver logs
pm2 logs hostever-backend

# Reiniciar
pm2 restart hostever-backend

# Parar
pm2 stop hostever-backend

# Status
pm2 status

# Monitorar
pm2 monit
```

### Nginx

```bash
# Testar configuração
sudo nginx -t

# Recarregar
sudo systemctl reload nginx

# Reiniciar
sudo systemctl restart nginx

# Ver logs
sudo tail -f /var/log/nginx/error.log
sudo tail -f /var/log/nginx/access.log
```

### MySQL

```bash
# Acessar MySQL
mysql -u root -p

# Backup do banco
mysqldump -u root -p hostever > backup.sql

# Restaurar backup
mysql -u root -p hostever < backup.sql
```

## Estrutura de Diretórios

```
/var/www/hostever/
├── backend/
│   ├── config/          # Configurações
│   ├── database/        # Scripts SQL
│   ├── jobs/            # Jobs automatizados
│   ├── models/          # Modelos de dados
│   ├── routes/          # Rotas da API
│   ├── scripts/         # Scripts auxiliares
│   ├── services/        # Serviços
│   ├── uploads/         # Arquivos enviados
│   ├── utils/           # Utilitários
│   ├── .env             # Variáveis de ambiente
│   ├── package.json     # Dependências
│   └── server.js        # Servidor principal
├── frontend/
│   ├── dist/            # Build do frontend
│   ├── public/          # Arquivos públicos
│   ├── src/             # Código fonte
│   └── package.json     # Dependências
└── install.sh           # Script de instalação
```

## Permissões

Certifique-se de que as permissões estão corretas:

```bash
sudo chown -R $USER:$USER /var/www/hostever
chmod -R 755 /var/www/hostever
chmod -R 775 /var/www/hostever/backend/uploads
chmod -R 775 /var/www/hostever/backend/sandbox-storage
chmod -R 775 /var/www/hostever/backend/sandbox-temp
```

## Firewall

Configure o firewall para permitir as portas necessárias:

```bash
# UFW (Ubuntu)
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw allow 22/tcp
sudo ufw enable
```

## Solução de Problemas

### Backend não inicia

1. Verifique os logs: `pm2 logs hostever-backend`
2. Verifique as variáveis de ambiente: `cat backend/.env`
3. Verifique a conexão com MySQL: `mysql -u usuario -p`

### Erro 502 Bad Gateway

1. Verifique se o backend está rodando: `pm2 status`
2. Verifique os logs do Nginx: `sudo tail -f /var/log/nginx/error.log`
3. Reinicie o backend: `pm2 restart hostever-backend`

### Erro de conexão com banco de dados

1. Verifique se o MySQL está rodando: `sudo systemctl status mysql`
2. Verifique as credenciais no arquivo `.env`
3. Teste a conexão: `mysql -h localhost -u usuario -p`

## Atualização

Para atualizar o sistema:

```bash
cd /var/www/hostever

# Pull das alterações (se usando Git)
git pull

# Atualizar Backend
cd backend
npm install
pm2 restart hostever-backend

# Atualizar Frontend
cd ../frontend
npm install
npm run build

# Recarregar Nginx
sudo systemctl reload nginx
```

## Backup

Recomendamos fazer backup regular de:

1. Banco de dados MySQL
2. Arquivos em `/var/www/hostever/backend/uploads`
3. Arquivo `.env` com as configurações

Script de backup automático:

```bash
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backup/hostever"

mkdir -p $BACKUP_DIR

# Backup do banco
mysqldump -u root -p hostever > $BACKUP_DIR/db_$DATE.sql

# Backup dos uploads
tar -czf $BACKUP_DIR/uploads_$DATE.tar.gz /var/www/hostever/backend/uploads

# Manter apenas últimos 7 dias
find $BACKUP_DIR -type f -mtime +7 -delete
```

## Suporte

Para suporte, entre em contato com a equipe de desenvolvimento.
