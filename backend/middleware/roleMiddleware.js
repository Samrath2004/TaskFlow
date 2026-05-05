const Project = require('../models/Project');

const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Not authorized' });
    }
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ success: false, message: `User role ${req.user.role} is not authorized to access this route` });
    }
    next();
  };
};

const requireProjectAdmin = async (req, res, next) => {
  try {
    // Project ID could be in params (e.g., /api/projects/:id) or body (e.g., creating task { projectId })
    const projectId = req.params.id || req.body.projectId || req.params.projectId;
    
    if (!projectId) {
      return res.status(400).json({ success: false, message: 'Project ID is required to verify permissions' });
    }

    const project = await Project.findById(projectId);
    
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    // Check if user is system admin OR project admin
    if (req.user.role === 'admin' || project.isAdmin(req.user._id)) {
      req.project = project; // Pass project down so we don't have to query again
      return next();
    }

    return res.status(403).json({ success: false, message: 'Not authorized to manage this project' });
  } catch (error) {
    console.error('Role Middleware Error:', error.message);
    return res.status(500).json({ success: false, message: 'Server error verifying permissions' });
  }
};

module.exports = { requireRole, requireProjectAdmin };
