const Task = require('../models/Task');
const Project = require('../models/Project');
const { validationResult } = require('express-validator');

// @desc    Create a task
// @route   POST /api/tasks
// @access  Private/ProjectAdmin
const createTask = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  const { title, description, projectId, assigneeId, priority, dueDate, tags } = req.body;

  try {
    const task = await Task.create({
      title,
      description,
      project: projectId,
      assignee: assigneeId || null,
      createdBy: req.user._id,
      priority: priority || 'medium',
      dueDate,
      tags: tags || []
    });

    const populatedTask = await Task.findById(task._id)
      .populate('assignee', 'name avatar')
      .populate('createdBy', 'name avatar');

    res.status(201).json({ success: true, data: populatedTask });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// @desc    Get tasks by project
// @route   GET /api/tasks/project/:id
// @access  Private
const getTasksByProject = async (req, res) => {
  try {
    const projectId = req.params.id;
    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    if (!project.isMember(req.user._id) && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to view tasks in this project' });
    }

    // Build query
    const query = { project: projectId };

    // Apply filters from req.query
    if (req.query.status) query.status = req.query.status;
    if (req.query.priority) query.priority = req.query.priority;
    if (req.query.assignee) query.assignee = req.query.assignee === 'unassigned' ? null : req.query.assignee;
    
    if (req.query.search) {
      query.title = { $regex: req.query.search, $options: 'i' };
    }

    // Member access restriction: only return assigned/created if not project admin
    // Member access restriction: only return assigned tasks if not project admin
    if (!project.isAdmin(req.user._id) && req.user.role !== 'admin') {
      query.assignee = req.user._id;
    }

    const tasks = await Task.find(query)
      .populate('assignee', 'name avatar')
      .populate('createdBy', 'name')
      .sort('dueDate');

    res.json({ success: true, count: tasks.length, data: tasks });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// @desc    Get task by ID
// @route   GET /api/tasks/:id
// @access  Private
const getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate('project', 'name members owner')
      .populate('assignee', 'name email avatar')
      .populate('createdBy', 'name email avatar')
      .populate('comments.user', 'name avatar');

    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    const project = task.project;
    // Check if user is a member of the project
    const isMember = project.owner.toString() === req.user._id.toString() || 
                     project.members.some(m => m.user.toString() === req.user._id.toString());
                     
    if (!isMember && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to view this task' });
    }

    // Clean up project field so we don't return all project members arrays if not needed, 
    // or keep it if frontend uses it. We'll replace it with just the ID to match standard behavior, 
    // but the prompt says "Populate all refs". We'll just leave it populated.
    
    res.json({ success: true, data: task });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// @desc    Update task
// @route   PUT /api/tasks/:id
// @access  Private
const updateTask = async (req, res) => {
  try {
    let task = await Task.findById(req.params.id).populate('project');

    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    const project = await Project.findById(task.project._id || task.project);
    const isAdmin = req.user.role === 'admin' || project.isAdmin(req.user._id);
    const isAssignee = task.assignee && task.assignee.toString() === req.user._id.toString();

    if (!isAdmin && !isAssignee) {
      return res.status(403).json({ success: false, message: 'Not authorized to update this task' });
    }

    // Members can only update status
    if (!isAdmin && isAssignee) {
      if (req.body.status) task.status = req.body.status;
    } else {
      // Admin can update all fields
      task.title = req.body.title || task.title;
      task.description = req.body.description !== undefined ? req.body.description : task.description;
      task.status = req.body.status || task.status;
      task.priority = req.body.priority || task.priority;
      task.dueDate = req.body.dueDate !== undefined ? req.body.dueDate : task.dueDate;
      task.tags = req.body.tags || task.tags;
      if (req.body.assigneeId !== undefined) task.assignee = req.body.assigneeId;
    }

    await task.save();
    
    // Return populated task
    task = await Task.findById(task._id)
      .populate('assignee', 'name avatar')
      .populate('createdBy', 'name');

    res.json({ success: true, data: task });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// @desc    Delete task
// @route   DELETE /api/tasks/:id
// @access  Private/ProjectAdmin
const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    const project = await Project.findById(task.project);
    if (!project.isAdmin(req.user._id) && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this task' });
    }

    await Task.deleteOne({ _id: task._id });

    res.json({ success: true, message: 'Task removed' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// @desc    Assign task
// @route   PUT /api/tasks/:id/assign
// @access  Private/ProjectAdmin
const assignTask = async (req, res) => {
  const { assigneeId } = req.body;

  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    const project = await Project.findById(task.project);
    if (!project.isAdmin(req.user._id) && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to assign tasks in this project' });
    }

    if (assigneeId) {
      // Verify assignee is part of the project
      if (!project.isMember(assigneeId)) {
        return res.status(400).json({ success: false, message: 'Assignee must be a member of the project' });
      }
    }

    task.assignee = assigneeId || null;
    await task.save();

    const updatedTask = await Task.findById(task._id).populate('assignee', 'name avatar');
    res.json({ success: true, data: updatedTask });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// @desc    Add a comment
// @route   POST /api/tasks/:id/comment
// @access  Private
const addComment = async (req, res) => {
  const { text } = req.body;

  if (!text) {
    return res.status(400).json({ success: false, message: 'Comment text is required' });
  }

  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    const project = await Project.findById(task.project);
    if (!project.isMember(req.user._id) && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to comment on this task' });
    }

    task.comments.push({
      user: req.user._id,
      text,
      createdAt: new Date()
    });

    await task.save();

    const updatedTask = await Task.findById(task._id)
      .populate('comments.user', 'name avatar');

    res.json({ success: true, data: updatedTask });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

module.exports = {
  createTask,
  getTasksByProject,
  getTaskById,
  updateTask,
  deleteTask,
  assignTask,
  addComment
};
