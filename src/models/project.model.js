const { pool } = require('../config/db');

class ProjectModel {
  // Create a new village development project
  static async create({
    village_id,
    taluk_officer_id,
    assigned_panchayat_id = null,
    project_title,
    category,
    description = null,
    sanctioned_budget,
    start_date = null,
    expected_completion_date = null,
  }) {
    const query = `
      INSERT INTO projects (
        village_id,
        taluk_officer_id,
        assigned_panchayat_id,
        project_title,
        category,
        description,
        sanctioned_budget,
        start_date,
        expected_completion_date
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const [result] = await pool.execute(query, [
      village_id,
      taluk_officer_id,
      assigned_panchayat_id,
      project_title,
      category,
      description,
      sanctioned_budget,
      start_date,
      expected_completion_date,
    ]);
    return { project_id: result.insertId, project_title, category, sanctioned_budget };
  }

  // Get all projects with village and officer info
  static async findAll() {
    const query = `
      SELECT p.*, v.village_name, u.full_name AS officer_name
      FROM projects p
      LEFT JOIN villages v ON p.village_id = v.village_id
      LEFT JOIN users u ON p.taluk_officer_id = u.user_id
      ORDER BY p.created_at DESC
    `;
    const [rows] = await pool.execute(query);
    return rows;
  }

  // Get single project with all its milestones
  static async findById(id) {
    const projectQuery = 'SELECT * FROM projects WHERE project_id = ?';
    const [projectRows] = await pool.execute(projectQuery, [id]);
    if (!projectRows[0]) return null;

    const milestonesQuery = `
      SELECT * FROM project_milestones 
      WHERE project_id = ? 
      ORDER BY recorded_at DESC
    `;
    const [milestones] = await pool.execute(milestonesQuery, [id]);

    return { ...projectRows[0], milestones };
  }

  // Add milestone & sync project's progress and funds_spent
  static async addMilestone({
    project_id,
    panchayat_officer_id,
    milestone_title,
    progress_percentage,
    funds_utilized,
    site_photo_url = null,
    notes = null,
  }) {
    const milestoneQuery = `
      INSERT INTO project_milestones (
        project_id,
        panchayat_officer_id,
        milestone_title,
        progress_percentage,
        funds_utilized,
        site_photo_url,
        notes
      ) VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    const [mResult] = await pool.execute(milestoneQuery, [
      project_id,
      panchayat_officer_id,
      milestone_title,
      progress_percentage,
      funds_utilized,
      site_photo_url,
      notes,
    ]);

    // Update parent project progress and funds_spent
    const updateProjectQuery = `
      UPDATE projects 
      SET 
        progress_percentage = ?,
        funds_spent = funds_spent + ?,
        status = CASE 
          WHEN ? >= 100 THEN 'Completed' 
          ELSE 'In Progress' 
        END
      WHERE project_id = ?
    `;
    await pool.execute(updateProjectQuery, [
      progress_percentage,
      funds_utilized || 0,
      progress_percentage,
      project_id,
    ]);

    return { milestone_id: mResult.insertId, project_id, progress_percentage };
  }
}

module.exports = ProjectModel;