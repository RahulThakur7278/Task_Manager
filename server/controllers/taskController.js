import { z } from 'zod';
import Task from '../models/Task.js';
import AppError from '../utils/AppError.js';

// Zod schemas
export const createTaskSchema = z.object({
  title: z.string().min(1, 'Task title is required').max(200, 'Task title cannot exceed 200 characters').trim(),
  description: z.string().optional(),
  priority: z.enum(['Low', 'Medium', 'High']).optional(),
  status: z.enum(['Pending', 'In Progress', 'Completed']).optional(),
  startDate: z.string().optional(),
  dueDate: z.string().optional(),
  assignees: z.array(z.string()).optional(),
  checklist: z.array(
    z.object({
      title: z.string().min(1, 'Checklist title is required'),
      completed: z.boolean().optional(),
    })
  ).optional(),
  attachments: z.array(z.string()).optional(),
});

export const updateTaskSchema = z.object({
  title: z.string().min(1, 'Task title is required').max(200, 'Task title cannot exceed 200 characters').trim().optional(),
  description: z.string().optional(),
  priority: z.enum(['Low', 'Medium', 'High']).optional(),
  status: z.enum(['Pending', 'In Progress', 'Completed']).optional(),
  startDate: z.string().optional(),
  dueDate: z.string().optional(),
  assignees: z.array(z.string()).optional(),
  checklist: z.array(
    z.object({
      title: z.string().min(1, 'Checklist title is required'),
      completed: z.boolean().optional(),
    })
  ).optional(),
  attachments: z.array(z.string()).optional(),
});

export const reorderSchema = z.object({
  orderedIds: z.array(z.string()).min(1, 'orderedIds array is required'),
});

export const getTasks = async (req, res, next) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit) || 10));
    const status = req.query.status || 'all';
    const search = req.query.q || '';
    const userId = req.query.userId || req.user?._id;

    if (!userId) {
      throw new AppError('User ID is required', 400);
    }

    // Build filter: Tasks created by user OR tasks assigned to user
    let filter;
    if (req.query.mode === 'created') {
      filter = { user: userId };
    } else if (req.query.mode === 'assigned') {
      filter = { assignees: userId };
    } else {
      filter = { $or: [{ user: userId }, { assignees: userId }] };
    }

    if (status !== 'all') {
      if (status.toLowerCase() === 'completed') filter.status = 'Completed';
      else if (status.toLowerCase() === 'pending') filter.status = 'Pending';
      else if (status.toLowerCase() === 'in progress' || status.toLowerCase() === 'inprogress') filter.status = 'In Progress';
    }

    if (search) {
      filter.title = { $regex: search, $options: 'i' };
    }

    const totalTasks = await Task.countDocuments(filter);
    const totalPages = Math.ceil(totalTasks / limit);

    const tasks = await Task.find(filter)
      .populate('assignees', 'name email avatar')
      .populate('user', 'name email avatar')
      .sort({ order: 1, createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    res.json({
      success: true,
      tasks,
      page,
      totalPages,
      totalTasks,
    });
  } catch (error) {
    next(error);
  }
};

export const createTask = async (req, res, next) => {
  try {
    const lastTask = await Task.findOne({ user: req.user._id }).sort({ order: -1 });
    const order = lastTask ? lastTask.order + 1 : 0;

    const task = await Task.create({
      ...req.body,
      user: req.user._id,
      order,
    });

    const populatedTask = await Task.findById(task._id).populate('assignees', 'name email avatar');

    res.status(201).json({
      success: true,
      task: populatedTask,
    });
  } catch (error) {
    next(error);
  }
};

export const updateTask = async (req, res, next) => {
  try {
    // Allows creator or assignee to update
    const task = await Task.findOne({ _id: req.params.id, $or: [{ user: req.user._id }, { assignees: req.user._id }] });

    if (!task) {
      throw new AppError('Task not found or unauthorized', 404);
    }

    Object.assign(task, req.body);
    await task.save();

    const populatedTask = await Task.findById(task._id).populate('assignees', 'name email avatar');

    res.json({
      success: true,
      task: populatedTask,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteTask = async (req, res, next) => {
  try {
    // Only creator can delete
    const task = await Task.findOneAndDelete({ _id: req.params.id, user: req.user._id });

    if (!task) {
      throw new AppError('Task not found or unauthorized (only creator can delete)', 404);
    }

    res.json({
      success: true,
      message: 'Task deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

export const reorderTasks = async (req, res, next) => {
  try {
    const { orderedIds } = req.body;

    const bulkOps = orderedIds.map((id, index) => ({
      updateOne: {
        filter: { _id: id, user: req.user._id },
        update: { $set: { order: index } },
      },
    }));

    await Task.bulkWrite(bulkOps);

    res.json({
      success: true,
      message: 'Tasks reordered successfully',
    });
  } catch (error) {
    next(error);
  }
};

export const getAnalytics = async (req, res, next) => {
  try {
    const userId = req.user._id;

    // Get total counts
    const [total, completedCount, inProgressCount, pendingCount] = await Promise.all([
      Task.countDocuments({ $or: [{ user: userId }, { assignees: userId }] }),
      Task.countDocuments({ $or: [{ user: userId }, { assignees: userId }], status: 'Completed' }),
      Task.countDocuments({ $or: [{ user: userId }, { assignees: userId }], status: 'In Progress' }),
      Task.countDocuments({ $or: [{ user: userId }, { assignees: userId }], status: 'Pending' }),
    ]);

    const completionRate = total > 0 ? Math.round((completedCount / total) * 100) : 0;

    // Get daily stats for the last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
    sevenDaysAgo.setHours(0, 0, 0, 0);

    const dailyCreated = await Task.aggregate([
      {
        $match: {
          $or: [{ user: userId }, { assignees: userId }],
          createdAt: { $gte: sevenDaysAgo },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' },
          },
          created: { $sum: 1 },
          completed: {
            $sum: { $cond: [{ $eq: ['$status', 'Completed'] }, 1, 0] },
          },
          inProgress: {
            $sum: { $cond: [{ $eq: ['$status', 'In Progress'] }, 1, 0] },
          },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Fill in missing days with zeros
    const dailyStats = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(sevenDaysAgo);
      date.setDate(date.getDate() + i);
      const dateStr = date.toISOString().split('T')[0];
      const dayData = dailyCreated.find((d) => d._id === dateStr);
      dailyStats.push({
        date: dateStr,
        created: dayData?.created || 0,
        completed: dayData?.completed || 0,
        inProgress: dayData?.inProgress || 0,
      });
    }

    res.json({
      success: true,
      analytics: {
        total,
        completed: completedCount,
        inProgress: inProgressCount,
        pending: pendingCount,
        completionRate,
        dailyStats,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getRecentTasks = async (req, res, next) => {
  try {
    const recentTasks = await Task.find()
      .select('title status priority createdAt dueDate')
      .sort({ createdAt: -1 })
      .limit(10);

    res.json({
      success: true,
      recentTasks,
    });
  } catch (error) {
    next(error);
  }
};