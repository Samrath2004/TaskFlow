const Task = require('../models/Task');
const Project = require('../models/Project');

// @desc    Get dashboard statistics
// @route   GET /api/dashboard
// @access  Private
const getDashboardStats = async (req, res) => {
  try {
    let projectQuery = {};
    let taskQuery = {};

    if (req.user.role !== 'admin') {
      // Find projects where user is a member or owner
      const userProjects = await Project.find({
        $or: [
          { owner: req.user._id },
          { 'members.user': req.user._id }
        ]
      }).select('_id');
      
      const projectIds = userProjects.map(p => p._id);
      
      projectQuery = { _id: { $in: projectIds } };
      
      // For tasks, members see their assigned tasks, and admins of the projects see all tasks in that project.
      // To simplify per the requirement "For member: stats only for their assigned tasks":
      taskQuery = { assignee: req.user._id };
    }

    const totalProjects = await Project.countDocuments(projectQuery);
    const tasks = await Task.find(taskQuery)
      .populate('project', 'name')
      .populate('assignee', 'name');

    const totalTasks = tasks.length;
    
    const tasksByStatus = { todo: 0, in_progress: 0, done: 0 };
    const tasksByPriority = { low: 0, medium: 0, high: 0, critical: 0 };
    const overdueTasks = [];
    const myTasks = [];

    const now = new Date();

    tasks.forEach(task => {
      // Status counts
      if (tasksByStatus[task.status] !== undefined) {
        tasksByStatus[task.status]++;
      }

      // Priority counts
      if (tasksByPriority[task.priority] !== undefined) {
        tasksByPriority[task.priority]++;
      }

      // Overdue tasks
      if (task.dueDate && new Date(task.dueDate) < now && task.status !== 'done') {
        overdueTasks.push(task);
      }

      // My tasks (all tasks in this query are already assigned to the user if they are not admin, but for admin we filter here)
      if (task.assignee && task.assignee._id.toString() === req.user._id.toString()) {
        myTasks.push(task);
      }
    });

    // Tasks Per User aggregation
    const tasksPerUser = {};
    tasks.forEach(task => {
      if (task.assignee) {
        const name = task.assignee.name;
        tasksPerUser[name] = (tasksPerUser[name] || 0) + 1;
      } else {
        tasksPerUser['Unassigned'] = (tasksPerUser['Unassigned'] || 0) + 1;
      }
    });

    // Recent activity (last 5 tasks updated)
    const recentActivity = await Task.find(taskQuery)
      .sort('-updatedAt')
      .limit(5)
      .populate('project', 'name');

    // Completion rate
    const completionRate = totalTasks === 0 ? 0 : Math.round((tasksByStatus.done / totalTasks) * 100);

    res.json({
      success: true,
      data: {
        totalProjects,
        totalTasks,
        tasksByStatus,
        tasksByPriority,
        overdueTasks,
        recentActivity,
        myTasks,
        completionRate,
        tasksPerUser
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

module.exports = { getDashboardStats };
