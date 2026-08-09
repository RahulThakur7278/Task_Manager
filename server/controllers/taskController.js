import { z } from 'zod';
import Task from '../models/Task.js';
import AppError from '../utils/AppError.js';

// Zod schemas
export const createTaskSchema = z.object({
  title: z
    .string()
    .min(1, 'Task title is required')
    .max(200, 'Task title cannot exceed 200 characters')
    .trim(),
});

export const updateTaskSchema = z.object({
  title: z
    .string()
    .min(1, 'Task title is required')
    .max(200, 'Task title cannot exceed 200 characters')
    .trim()
    .optional(),
  completed: z.boolean().optional(),
});

export const reorderSchema = z.object({
  orderedIds: z.array(z.string()).min(1, 'orderedIds array is required'),
});

/**
 * @desc    Get tasks with pagination, search, and filter
 * @route   GET /api/tasks?page=1&limit=10&status=all&q=search
 * @access  Private
 */
export const getTasks = async (req, res, next) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit) || 10));
    const status = req.query.status || 'all';
    const search = req.query.q || '';

    // Build filter
    const filter = { user: req.user._id };

    if (status === 'completed') {
      filter.completed = true;
    } else if (status === 'pending') {
      filter.completed = false;
    }

    if (search) {
      filter.title = { $regex: search, $options: 'i' };
    }

    const totalTasks = await Task.countDocuments(filter);
    const totalPages = Math.ceil(totalTasks / limit);

    const tasks = await Task.find(filter)
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

/**
 * @desc    Create a new task
 * @route   POST /api/tasks
 * @access  Private
 */
export const createTask = async (req, res, next) => {
  try {
    // Get the highest order value for the user's tasks
    const lastTask = await Task.findOne({ user: req.user._id }).sort({ order: -1 });
    const order = lastTask ? lastTask.order + 1 : 0;

    const task = await Task.create({
      title: req.body.title,
      user: req.user._id,
      order,
    });

    res.status(201).json({
      success: true,
      task,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update a task
 * @route   PUT /api/tasks/:id
 * @access  Private
 */
export const updateTask = async (req, res, next) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, user: req.user._id });

    if (!task) {
      throw new AppError('Task not found', 404);
    }

    if (req.body.title !== undefined) task.title = req.body.title;
    if (req.body.completed !== undefined) task.completed = req.body.completed;

    await task.save();

    res.json({
      success: true,
      task,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete a task
 * @route   DELETE /api/tasks/:id
 * @access  Private
 */
export const deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, user: req.user._id });

    if (!task) {
      throw new AppError('Task not found', 404);
    }

    res.json({
      success: true,
      message: 'Task deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Reorder tasks after drag-and-drop
 * @route   PUT /api/tasks/reorder
 * @access  Private
 */
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

/**
 * @desc    Get task analytics/stats
 * @route   GET /api/tasks/analytics
 * @access  Private
 */
export const getAnalytics = async (req, res, next) => {
  try {
    const userId = req.user._id;

    // Get total counts
    const [total, completed] = await Promise.all([
      Task.countDocuments({ user: userId }),
      Task.countDocuments({ user: userId, completed: true }),
    ]);

    const pending = total - completed;
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

    // Get daily stats for the last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
    sevenDaysAgo.setHours(0, 0, 0, 0);

    const dailyCreated = await Task.aggregate([
      {
        $match: {
          user: userId,
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
            $sum: { $cond: ['$completed', 1, 0] },
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
      });
    }

    res.json({
      success: true,
      analytics: {
        total,
        completed,
        pending,
        completionRate,
        dailyStats,
      },
    });
  } catch (error) {
    next(error);
  }
};
