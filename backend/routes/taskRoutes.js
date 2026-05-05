const express = require('express');
const { check } = require('express-validator');
const router = express.Router();
const {
  createTask,
  getTasksByProject,
  getTaskById,
  updateTask,
  deleteTask,
  assignTask,
  addComment
} = require('../controllers/taskController');
const { protect } = require('../middleware/authMiddleware');
const { requireProjectAdmin } = require('../middleware/roleMiddleware');

// Validation
const createTaskValidation = [
  check('title', 'Task title is required').not().isEmpty(),
  check('projectId', 'Project ID is required').not().isEmpty()
];

const commentValidation = [
  check('text', 'Comment text is required').not().isEmpty()
];

// All routes protected
router.use(protect);

router.route('/')
  .post(createTaskValidation, requireProjectAdmin, createTask);

router.get('/project/:id', getTasksByProject);

router.route('/:id')
  .get(getTaskById)
  .put(updateTask)
  .delete(deleteTask); // Controller handles admin check

router.put('/:id/assign', assignTask); // Controller handles admin check

router.post('/:id/comment', commentValidation, addComment);

module.exports = router;
