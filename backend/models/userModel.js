import { query } from '../config/database.js';

export async function getAllUsers() {
  return await query('SELECT * FROM users ORDER BY created_at DESC');
}

export async function getUserById(id) {
  const results = await query('SELECT * FROM users WHERE id = ?', [id]);
  return results[0];
}

export async function getUserByEmail(email) {
  const results = await query('SELECT * FROM users WHERE email = ?', [email]);
  return results[0];
}

export async function createUser(userData) {
  const { 
    email, 
    password_hash, 
    name, 
    phone, 
    cpf_cnpj, 
    cep,
    street,
    number,
    complement,
    neighborhood,
    city,
    state,
    country = 'Brasil',
    accepted_terms = false,
    role = 'client' 
  } = userData;
  
  const result = await query(
    `INSERT INTO users (
      email, password_hash, name, phone, cpf_cnpj,
      cep, street, number, complement, neighborhood, city, state, country,
      accepted_terms, accepted_terms_at, role, created_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
    [
      email, password_hash, name, phone, cpf_cnpj,
      cep, street, number, complement, neighborhood, city, state, country,
      accepted_terms, accepted_terms ? new Date() : null, role
    ]
  );
  
  return result.insertId;
}

export async function updateUser(id, userData) {
  const fields = [];
  const values = [];
  
  Object.keys(userData).forEach(key => {
    if (userData[key] !== undefined) {
      fields.push(`${key} = ?`);
      values.push(userData[key]);
    }
  });
  
  values.push(id);
  
  await query(
    `UPDATE users SET ${fields.join(', ')}, updated_at = NOW() WHERE id = ?`,
    values
  );
}

export async function deleteUser(id) {
  await query('DELETE FROM users WHERE id = ?', [id]);
}
