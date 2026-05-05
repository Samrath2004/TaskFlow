const express = require('express');
const { check } = require('express-validator');
const router = express.Router();
const {
  createProject,
  getAllProjects,
  getProjectById,
  updateProject,
  deleteProject,
  addMember,
  removeMember,
  getProjectMembers
} = require('../controllers/projectController');
const { protect } = require('../middleware/authMiddleware');
const { requireProjectAdmin } = require('../middleware/roleMiddleware');

// Validation rules
const createProjectValidation = [
  check('name', 'Project name is required').not().isEmpty()
];

// All routes are protected
router.use(protect);

router.route('/')
  .get(getAllProjects)
  .post(createProjectValidation, createProject);

router.route('/:id')
  .get(getProjectById)
  .put(requireProjectAdmin, updateProject)
  .delete(requireProjectAdmin, deleteProject);

router.route('/:id/members')
  .get(getProjectMembers)
  .post(requireProjectAdmin, addMember);

router.route('/:id/members/:uid')
  .delete(requireProjectAdmin, removeMember);

module.exports = router;
