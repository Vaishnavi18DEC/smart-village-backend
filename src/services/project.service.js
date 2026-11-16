const ProjectModel = require('../models/project.model');

class ProjectService {
  static async createProject(data) {
    return await ProjectModel.create(data);
  }

  static async getAllProjects() {
    return await ProjectModel.findAll();
  }

  static async getProjectDetails(id) {
    const project = await ProjectModel.findById(id);
    if (!project) {
      const error = new Error('Project not found');
      error.statusCode = 404;
      throw error;
    }
    return project;
  }

  static async addProjectMilestone(milestoneData) {
    return await ProjectModel.addMilestone(milestoneData);
  }
}

module.exports = ProjectService;