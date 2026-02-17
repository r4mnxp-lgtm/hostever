import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env') });

async function updateDatabase() {
  let connection;
  
  try {
    console.log('🔄 Conectando ao banco de dados...');
    console.log('Host:', process.env.DB_HOST);
    console.log('Database:', process.env.DB_NAME);
    
    connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT || 3306,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });

    console.log('✅ Conectado ao banco de dados!');
    console.log('🔄 Verificando e adicionando novos campos...\n');

    // Verificar quais colunas existem
    const [existingColumns] = await connection.query('DESCRIBE users');
    const existingColumnNames = existingColumns.map(col => col.Field);

    // Campos a adicionar
    const fieldsToAdd = [
      { name: 'cep', definition: 'VARCHAR(10)' },
      { name: 'street', definition: 'VARCHAR(255)' },
      { name: 'number', definition: 'VARCHAR(20)' },
      { name: 'complement', definition: 'VARCHAR(100)' },
      { name: 'neighborhood', definition: 'VARCHAR(100)' },
      { name: 'city', definition: 'VARCHAR(100)' },
      { name: 'state', definition: 'VARCHAR(2)' },
      { name: 'country', definition: "VARCHAR(50) DEFAULT 'Brasil'" },
      { name: 'accepted_terms', definition: 'BOOLEAN DEFAULT FALSE' },
      { name: 'accepted_terms_at', definition: 'TIMESTAMP NULL' },
    ];

    let addedCount = 0;

    for (const field of fieldsToAdd) {
      if (!existingColumnNames.includes(field.name)) {
        try {
          const query = `ALTER TABLE users ADD COLUMN ${field.name} ${field.definition}`;
          await connection.query(query);
          console.log(`✅ Campo '${field.name}' adicionado com sucesso`);
          addedCount++;
        } catch (error) {
          console.error(`❌ Erro ao adicionar '${field.name}':`, error.message);
        }
      } else {
        console.log(`⚠️  Campo '${field.name}' já existe`);
      }
    }

    console.log(`\n✅ Atualização concluída! ${addedCount} campos adicionados.`);
    console.log('\n📊 Estrutura atual da tabela users:');
    
    const [columns] = await connection.query('DESCRIBE users');
    console.table(columns.map(col => ({ 
      Campo: col.Field, 
      Tipo: col.Type, 
      Nulo: col.Null, 
      Chave: col.Key,
      Padrão: col.Default 
    })));

  } catch (error) {
    console.error('\n❌ Erro ao atualizar banco de dados:');
    console.error('Mensagem:', error.message);
    console.error('\nVerifique se:');
    console.error('1. O arquivo .env está configurado corretamente');
    console.error('2. As credenciais do banco estão corretas');
    console.error('3. O banco de dados existe');
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
      console.log('\n✅ Conexão encerrada');
    }
  }
}

updateDatabase();
