#!/bin/bash

set -e

echo "================================"
echo "HostEver - Script de Instalação"
echo "================================"
echo ""

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Função para log
log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Verificar se está rodando como root
if [ "$EUID" -eq 0 ]; then 
    log_warn "Não é recomendado rodar como root. Considere usar um usuário com sudo."
fi

# 1. Atualizar sistema
log_info "Atualizando sistema..."
sudo apt update && sudo apt upgrade -y

# 2. Instalar dependências do sistema
log_info "Instalando dependências do sistema..."
sudo apt install -y curl wget git build-essential python3 nginx

# 3. Instalar Node.js (v18 LTS)
log_info "Instalando Node.js..."
if ! command -v node &> /dev/null; then
    curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
    sudo apt install -y nodejs
    log_info "Node.js $(node -v) instalado com sucesso"
else
    log_info "Node.js já está instalado: $(node -v)"
fi

# 4. Instalar PM2 globalmente
log_info "Instalando PM2..."
if ! command -v pm2 &> /dev/null; then
    sudo npm install -g pm2
    log_info "PM2 instalado com sucesso"
else
    log_info "PM2 já está instalado"
fi

# 5. Instalar MySQL (se ainda não estiver instalado)
log_info "Verificando MySQL..."
if ! command -v mysql &> /dev/null; then
    log_warn "MySQL não encontrado. Instalando..."
    sudo apt install -y mysql-server
    sudo systemctl start mysql
    sudo systemctl enable mysql
    log_info "MySQL instalado. Configure a senha root com: sudo mysql_secure_installation"
else
    log_info "MySQL já está instalado"
fi

# 6. Clonar repositório do GitHub
log_info "Clonando repositório do GitHub..."
if [ -d "/var/www/hostever" ]; then
    log_warn "Diretório /var/www/hostever já existe. Removendo..."
    sudo rm -rf /var/www/hostever
fi

sudo mkdir -p /var/www
cd /var/www

read -p "URL do repositório GitHub (ex: https://github.com/usuario/hostever.git): " REPO_URL
if [ -z "$REPO_URL" ]; then
    log_error "URL do repositório é obrigatória!"
    exit 1
fi

log_info "Clonando $REPO_URL..."
sudo git clone $REPO_URL hostever

sudo chown -R $USER:$USER /var/www/hostever
cd /var/www/hostever

log_info "Repositório clonado com sucesso!"

# 7. Configurar variáveis de ambiente do Backend
log_info "Configurando variáveis de ambiente do Backend..."
if [ ! -f "backend/.env" ]; then
    if [ -f "backend/.env.example" ]; then
        cp backend/.env.example backend/.env
        log_warn "Arquivo backend/.env criado. EDITE-O com suas configurações!"
        
        read -p "Porta do Backend (padrão: 3001): " BACKEND_PORT
        BACKEND_PORT=${BACKEND_PORT:-3001}
        
        read -p "Host MySQL (padrão: localhost): " MYSQL_HOST
        MYSQL_HOST=${MYSQL_HOST:-localhost}
        
        read -p "Porta MySQL (padrão: 3306): " MYSQL_PORT
        MYSQL_PORT=${MYSQL_PORT:-3306}
        
        read -p "Usuário MySQL: " MYSQL_USER
        read -sp "Senha MySQL: " MYSQL_PASSWORD
        echo ""
        read -p "Nome do banco de dados (padrão: hostever): " MYSQL_DATABASE
        MYSQL_DATABASE=${MYSQL_DATABASE:-hostever}
        
        cat > backend/.env << EOF
PORT=$BACKEND_PORT

# MySQL Database
MYSQL_HOST=$MYSQL_HOST
MYSQL_PORT=$MYSQL_PORT
MYSQL_USER=$MYSQL_USER
MYSQL_PASSWORD=$MYSQL_PASSWORD
MYSQL_DATABASE=$MYSQL_DATABASE

# MercadoPago
MERCADOPAGO_ACCESS_TOKEN=your_mercadopago_access_token_here

# Frontend URL
VITE_APP_URL=http://localhost:3000

# Virtualizor
VITE_VIRTUALIZOR_HOST=https://panel.hostever.com:4083
VITE_VIRTUALIZOR_API_KEY=your_virtualizor_api_key
VITE_VIRTUALIZOR_API_PASS=your_virtualizor_api_pass
EOF
        log_info "Arquivo backend/.env configurado"
    else
        log_error "Arquivo backend/.env.example não encontrado!"
        exit 1
    fi
else
    log_info "Arquivo backend/.env já existe"
fi

# 8. Instalar dependências do Backend
log_info "Instalando dependências do Backend..."
cd backend
npm install
cd ..

# 9. Instalar dependências do Frontend
log_info "Instalando dependências do Frontend..."
cd frontend
npm install
cd ..

# 10. Configurar banco de dados
log_info "Configurando banco de dados..."
read -p "Deseja criar o banco de dados automaticamente? (s/n): " CREATE_DB
if [ "$CREATE_DB" = "s" ] || [ "$CREATE_DB" = "S" ]; then
    cd backend
    
    # Criar banco de dados
    mysql -h $MYSQL_HOST -P $MYSQL_PORT -u $MYSQL_USER -p$MYSQL_PASSWORD << EOF
CREATE DATABASE IF NOT EXISTS $MYSQL_DATABASE CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE $MYSQL_DATABASE;
EOF
    
    # Executar schema
    if [ -f "database/01-schema.sql" ]; then
        log_info "Executando schema..."
        mysql -h $MYSQL_HOST -P $MYSQL_PORT -u $MYSQL_USER -p$MYSQL_PASSWORD $MYSQL_DATABASE < database/01-schema.sql
    fi
    
    # Executar dados iniciais
    if [ -f "database/02-initial-data.sql" ]; then
        log_info "Executando dados iniciais..."
        mysql -h $MYSQL_HOST -P $MYSQL_PORT -u $MYSQL_USER -p$MYSQL_PASSWORD $MYSQL_DATABASE < database/02-initial-data.sql
    fi
    
    cd ..
    log_info "Banco de dados configurado com sucesso"
else
    log_warn "Configure o banco de dados manualmente"
fi

# 11. Build do Frontend
log_info "Fazendo build do Frontend..."
cd frontend
npm run build
cd ..

# 12. Configurar PM2 para o Backend
log_info "Configurando PM2 para o Backend..."
pm2 delete hostever-backend 2>/dev/null || true
pm2 start backend/server.js --name hostever-backend
pm2 save
pm2 startup

# 13. Configurar Nginx
log_info "Configurando Nginx..."
read -p "Domínio do projeto (ex: hostever.com): " DOMAIN
if [ ! -z "$DOMAIN" ]; then
    sudo tee /etc/nginx/sites-available/hostever > /dev/null << EOF
server {
    listen 80;
    server_name $DOMAIN www.$DOMAIN;

    # Frontend (arquivos estáticos)
    location / {
        root /var/www/hostever/frontend/dist;
        try_files \$uri \$uri/ /index.html;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:$BACKEND_PORT;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }

    # Uploads
    location /uploads {
        proxy_pass http://localhost:$BACKEND_PORT;
    }
}
EOF

    sudo ln -sf /etc/nginx/sites-available/hostever /etc/nginx/sites-enabled/
    sudo nginx -t && sudo systemctl reload nginx
    log_info "Nginx configurado para $DOMAIN"
    
    # Oferecer instalação de SSL
    read -p "Deseja instalar SSL com Let's Encrypt? (s/n): " INSTALL_SSL
    if [ "$INSTALL_SSL" = "s" ] || [ "$INSTALL_SSL" = "S" ]; then
        if ! command -v certbot &> /dev/null; then
            sudo apt install -y certbot python3-certbot-nginx
        fi
        sudo certbot --nginx -d $DOMAIN -d www.$DOMAIN
        log_info "SSL instalado com sucesso"
    fi
else
    log_warn "Configuração do Nginx ignorada. Configure manualmente."
fi

# 14. Configurar permissões
log_info "Configurando permissões..."
sudo chown -R $USER:$USER /var/www/hostever
chmod -R 755 /var/www/hostever
mkdir -p /var/www/hostever/backend/uploads
mkdir -p /var/www/hostever/backend/sandbox-storage
mkdir -p /var/www/hostever/backend/sandbox-temp
chmod -R 775 /var/www/hostever/backend/uploads
chmod -R 775 /var/www/hostever/backend/sandbox-storage
chmod -R 775 /var/www/hostever/backend/sandbox-temp

# 15. Finalização
echo ""
echo "================================"
log_info "Instalação concluída com sucesso!"
echo "================================"
echo ""
log_info "Próximos passos:"
echo "1. Edite o arquivo backend/.env com suas configurações"
echo "2. Crie um usuário admin: cd /var/www/hostever/backend && node scripts/createAdmin.js"
echo "3. Reinicie o backend: pm2 restart hostever-backend"
echo "4. Acesse o sistema em: http://$DOMAIN"
echo ""
log_info "Comandos úteis:"
echo "- Ver logs do backend: pm2 logs hostever-backend"
echo "- Reiniciar backend: pm2 restart hostever-backend"
echo "- Status do backend: pm2 status"
echo "- Recarregar Nginx: sudo systemctl reload nginx"
echo ""
