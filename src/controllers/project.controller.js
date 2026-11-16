const ProjectService = require('../services/project.service');

exports.createProject = async (req, res) => {
  try {
    const {
      village_id,
      taluk_officer_id,
      assigned_panchayat_id,
      project_title,
      category,
      description,
      sanctioned_budget,
      start_date,
      expected_completion_date,
    } = req.body;

    if (!village_id || !taluk_officer_id || !project_title || !category || !sanctioned_budget) {
      return res.status(400).json({
        success: false,
        message: 'village_id, taluk_officer_id, project_title, category, and sanctioned_budget are required',
      });
    }

    const project = await ProjectService.createProject({
      village_id,
      taluk_officer_id,
      assigned_panchayat_id,
      project_title,
      category,
      description,
      sanctioned_budget,
      start_date,
      expected_completion_date,
    });

    return res.status(201).json({
      success: true,
      message: 'Project created successfully',
      data: project,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({ success: false, message: error.message });
  }
};

exports.getProjects = async (req, res) => {
  try {
    const projects = await ProjectService.getAllProjects();
    return res.status(200).json({ success: true, data: projects });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.getProjectById = async (req, res) => {
  try {
    const project = await ProjectService.getProjectDetails(req.params.id);
    return res.status(200).json({ success: true, data: project });
  } catch (error) {
    return res.status(error.statusCode || 500).json({ success: false, message: error.message });
  }
};

exports.createMilestone = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      panchayat_officer_id,
      milestone_title,
      progress_percentage,
      funds_utilized,
      site_photo_url,
      notes,
    } = req.body;

    if (!panchayat_officer_id || !milestone_title || progress_percentage === undefined) {
      return res.status(400).json({
        success: false,
        message: 'panchayat_officer_id, milestone_title, and progress_percentage are required',
      });
    }

    const milestone = await ProjectService.addProjectMilestone({
      project_id: id,
      panchayat_officer_id,
      milestone_title,
      progress_percentage,
      funds_utilized,
      site_photo_url,
      notes,
    });

    return res.status(201).json({
      success: true,
      message: 'Milestone added and project progress updated',
      data: milestone,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({ success: false, message: error.message });
  }
};