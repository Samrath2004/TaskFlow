const mongoose = require('mongoose');

const memberSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  role: {
    type: String,
    enum: ['admin', 'member'],
    default: 'member'
  },
  joinedAt: {
    type: Date,
    default: Date.now
  }
}, { _id: false });

const projectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  members: [memberSchema],
  status: {
    type: String,
    enum: ['active', 'completed', 'archived'],
    default: 'active'
  },
  color: {
    type: String,
    default: '#6366f1' // Hex color for UI
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for taskCount
projectSchema.virtual('tasks', {
  ref: 'Task',
  localField: '_id',
  foreignField: 'project'
});

projectSchema.virtual('taskCount', {
  ref: 'Task',
  localField: '_id',
  foreignField: 'project',
  count: true
});

// Method to check if a user is a member
projectSchema.methods.isMember = function(userId) {
  const userIdStr = userId.toString();
  const ownerIdStr = this.owner._id ? this.owner._id.toString() : this.owner.toString();
  
  if (ownerIdStr === userIdStr) return true;
  return this.members.some(member => {
    const memberUserIdStr = member.user._id ? member.user._id.toString() : member.user.toString();
    return memberUserIdStr === userIdStr;
  });
};

// Method to check if a user is an admin
projectSchema.methods.isAdmin = function(userId) {
  const userIdStr = userId.toString();
  const ownerIdStr = this.owner._id ? this.owner._id.toString() : this.owner.toString();
  
  if (ownerIdStr === userIdStr) return true;
  return this.members.some(member => {
    const memberUserIdStr = member.user._id ? member.user._id.toString() : member.user.toString();
    return memberUserIdStr === userIdStr && member.role === 'admin';
  });
};

const Project = mongoose.model('Project', projectSchema);
module.exports = Project;
