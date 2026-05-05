const Project = require('../models/Project');
const Task = require('../models/Task');
const User = require('../models/User');
const { validationResult } = require('express-validator');

// @desc    Create a project
// @route   POST /api/projects
// @access  Private
const createProject = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  const { name, description, color } = req.body;

  try {
    const project = await Project.create({
      name,
      description,
      color,
      owner: req.user._id,
      members: [
        {
          user: req.user._id,
          role: 'admin'
        }
      ]
    });

    res.status(201).json({ success: true, data: project });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// @desc    Get all projects for current user
// @route   GET /api/projects
// @access  Private
const getAllProjects = async (req, res) => {
  try {
    const projects = await Project.find({
      $or: [
        { owner: req.user._id },
        { 'members.user': req.user._id }
      ]
    })
    .populate('owner', 'name avatar')
    .populate('members.user', 'name avatar')
    .sort('-createdAt');

    res.json({ success: true, count: projects.length, data: projects });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// @desc    Get project by ID
// @route   GET /api/projects/:id
// @access  Private
const getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('owner', 'name email avatar')
      .populate('members.user', 'name email avatar role');

    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    if (!project.isMember(req.user._id) && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to view this project' });
    }

    res.json({ success: true, data: project });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// @desc    Update a project
// @route   PUT /api/projects/:id
// @access  Private/ProjectAdmin
const updateProject = async (req, res) => {
  const { name, description, status, color } = req.body;

  try {
    let project = req.project; // Provided by requireProjectAdmin middleware

    project.name = name || project.name;
    project.description = description !== undefined ? description : project.description;
    project.status = status || project.status;
    project.color = color || project.color;

    project = await project.save();

    res.json({ success: true, data: project });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// @desc    Delete a project and its tasks
// @route   DELETE /api/projects/:id
// @access  Private/ProjectAdmin
const deleteProject = async (req, res) => {
  try {
    const project = req.project; // Provided by requireProjectAdmin middleware
    
    // Delete all tasks associated with project
    await Task.deleteMany({ project: project._id });
    
    await Project.deleteOne({ _id: project._id });

    res.json({ success: true, message: 'Project and associated tasks removed' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// @desc    Add member to project
// @route   POST /api/projects/:id/members
// @access  Private/ProjectAdmin
const addMember = async (req, res) => {
  const { email, role } = req.body;

  if (!email) {
    return res.status(400).json({ success: false, message: 'Please provide an email' });
  }

  try {
    const project = req.project; // Provided by requireProjectAdmin middleware

    const userToAdd = await User.findOne({ email });
    if (!userToAdd) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Check if already a member
    if (project.isMember(userToAdd._id)) {
      return res.status(400).json({ success: false, message: 'User is already a member of this project' });
    }

    project.members.push({
      user: userToAdd._id,
      role: role || 'member'
    });

    await project.save();

    // Return populated members
    const updatedProject = await Project.findById(project._id).populate('members.user', 'name email avatar');

    res.json({ success: true, data: updatedProject.members });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// @desc    Remove member from project
// @route   DELETE /api/projects/:id/members/:uid
// @access  Private/ProjectAdmin
const removeMember = async (req, res) => {
  try {
    const project = req.project; // Provided by requireProjectAdmin middleware
    const userIdToRemove = req.params.uid;

    if (project.owner.toString() === userIdToRemove) {
      return res.status(400).json({ success: false, message: 'Cannot remove the project owner' });
    }

    const memberIndex = project.members.findIndex(m => m.user.toString() === userIdToRemove);
    
    if (memberIndex === -1) {
      return res.status(404).json({ success: false, message: 'Member not found in project' });
    }

    project.members.splice(memberIndex, 1);
    await project.save();

    res.json({ success: true, message: 'Member removed successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// @desc    Get project members
// @route   GET /api/projects/:id/members
// @access  Private
const getProjectMembers = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id).populate('members.user', 'name email avatar role');
    
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    if (!project.isMember(req.user._id) && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to view members of this project' });
    }

    res.json({ success: true, data: project.members });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

module.exports = {
  createProject,
  getAllProjects,
  getProjectById,
  updateProject,
  deleteProject,
  addMember,
  removeMember,
  getProjectMembers
};
