const { pool } = require('../config/db');

class ComplaintModel {
  static async create({
    complaint_token,
    village_id,
    citizen_id,
    category,
    title,
    description,
    issue_photo_url = null,
  }) {
    const query = `
      INSERT INTO complaints (
        complaint_token,
        village_id,
        citizen_id,
        category,
        title,
        description,
        issue_photo_url
      ) VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    const [result] = await pool.execute(query, [
      complaint_token,
      village_id,
      citizen_id,
      category,
      title,
      description,
      issue_photo_url,
    ]);
    return { complaint_id: result.insertId, complaint_token };
  }

  static async findAll() {
    const query = `
      SELECT c.*, u.full_name AS citizen_name 
      FROM complaints c
      LEFT JOIN users u ON c.citizen_id = u.user_id
      ORDER BY c.created_at DESC
    `;
    const [rows] = await pool.execute(query);
    return rows;
  }

  static async findById(id) {
    const query = 'SELECT * FROM complaints WHERE complaint_id = ?';
    const [rows] = await pool.execute(query, [id]);
    return rows[0] || null;
  }

  static async updateStatus(id, { status, officer_remarks = null, resolution_photo_url = null }) {
    const resolvedAt = status === 'Resolved' ? new Date() : null;
    const query = `
      UPDATE complaints 
      SET status = ?, officer_remarks = ?, resolution_photo_url = ?, resolved_at = ?
      WHERE complaint_id = ?
    `;
    const [result] = await pool.execute(query, [
      status,
      officer_remarks,
      resolution_photo_url,
      resolvedAt,
      id,
    ]);
    return result.affectedRows > 0;
  }
}

module.exports = ComplaintModel;