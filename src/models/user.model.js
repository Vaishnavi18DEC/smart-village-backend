const { pool } = require('../config/db');

class UserModel {
  static async create({ full_name, email, phone, password_hash, role = 'citizen', village_id = null }) {
    const query = `
      INSERT INTO users (full_name, email, phone, password_hash, role, village_id) 
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    const [result] = await pool.execute(query, [
      full_name,
      email,
      phone,
      password_hash,
      role,
      village_id,
    ]);
    return { user_id: result.insertId, full_name, email, phone, role, village_id };
  }

static async findByEmail(email) {
  const query = 'SELECT * FROM users WHERE email = ? LIMIT 1';
  const [rows] = await pool.execute(query, [email]);
  return rows.length > 0 ? rows[0] : null;
}

  static async findAll() {
    const query = 'SELECT user_id, full_name, email, phone, role, village_id, created_at FROM users';
    const [rows] = await pool.execute(query);
    return rows;
  }
}

module.exports = UserModel;