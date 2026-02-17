import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import connection from '../config/database.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function createStatusTables() {
  try {
    console.log('Criando tabelas de status...');
    
    const sqlPath = path.join(__dirname, '..', 'database', 'create-status-table.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');
    
    const statements = sql
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0);
    
    for (const statement of statements) {
      await connection.query(statement);
    }
    
    console.log('Tabelas de status criadas com sucesso!');
    process.exit(0);
  } catch (error) {
    console.error('Erro ao criar tabelas:', error);
    process.exit(1);
  }
}

createStatusTables();
