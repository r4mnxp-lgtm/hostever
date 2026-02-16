@echo off
echo ========================================
echo CORRECAO URGENTE - HostEver
echo ========================================
echo.

echo [1/3] Verificando se o MySQL esta acessivel...
mysql --version >nul 2>&1
if errorlevel 1 (
    echo ERRO: MySQL nao encontrado no PATH
    echo Por favor, execute a migracao manualmente via phpMyAdmin ou MySQL Workbench
    echo Arquivo: backend\database\MIGRATION_URGENTE.sql
    pause
    exit /b 1
)

echo.
echo [2/3] Executando migracao do banco de dados...
echo Digite a senha do MySQL root:
mysql -u root -p hostever_db < backend\database\MIGRATION_URGENTE.sql

if errorlevel 1 (
    echo.
    echo ERRO ao executar migracao!
    echo Tente executar manualmente:
    echo mysql -u root -p hostever_db ^< backend\database\MIGRATION_URGENTE.sql
    pause
    exit /b 1
)

echo.
echo [3/3] Migracao concluida com sucesso!
echo.
echo ========================================
echo PROXIMOS PASSOS:
echo ========================================
echo.
echo 1. REINICIE O FRONTEND:
echo    - Pare o servidor (Ctrl+C)
echo    - Execute: npm run dev
echo.
echo 2. Acesse: http://localhost:5173/setup
echo    - Crie o primeiro administrador
echo.
echo 3. Teste o cadastro de clientes
echo.
echo ========================================
echo.
pause
