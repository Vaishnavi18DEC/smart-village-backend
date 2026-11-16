const express = require('express');
const router = express.Router();
const projectController = require('../controllers/project.controller');
const { authenticateToken, authorizeRoles } = require('../middlewares/auth.middleware');

// Public: Anyone can view ongoing projects
router.get('/', projectController.getProjects);
router.get('/:id', projectController.getProjectById);

// Protected: Only Taluk officers can create projects
router.post(
  '/',
  authenticateToken,
  authorizeRoles('taluk'),
  projectController.createProject
);

// Protected: Only Panchayat officers can record milestones
router.post(
  '/:id/milestones',
  authenticateToken,
  authorizeRoles('panchayat', 'taluk'),
  projectController.createMilestone
);

module.exports = router;