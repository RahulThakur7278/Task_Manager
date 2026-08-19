import { z } from 'zod';
import User from '../models/User.js';
import Task from '../models/Task.js';
import AppError from '../utils/AppError.js';
import bcrypt from 'bcryptjs';

// Schema for adding a new team member
export const addMemberSchema = z.object({
  name: z.string().min(1, 'Name is required').trim(),
  email: z.string().email('Please provide a valid email').trim().toLowerCase(),
  phone: z.string().min(1, 'Phone number is required').trim(),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

/**
 * @desc    Get all users (Team Members) with their task stats
 * @route   GET /api/users
 * @access  Private
 */
export const getUsers = async (req, res, next) => {
  try {
    // Find all users (excluding passwords)
    const users = await User.find({}).select('-password');

    // Aggregate tasks to get counts per user
    const taskStats = await Task.aggregate([
      {
        $unwind: '$assignees',
      },
      {
        $group: {
          _id: {
            user: '$assignees',
            status: '$status',
          },
          count: { $sum: 1 },
        },
      },
    ]);

    // Format the response to attach stats to users
    const usersWithStats = users.map((user) => {
      let pending = 0;
      let inProgress = 0;
      let completed = 0;

      taskStats.forEach((stat) => {
        if (stat._id.user.toString() === user._id.toString()) {
          if (stat._id.status === 'Pending') pending = stat.count;
          if (stat._id.status === 'In Progress') inProgress = stat.count;
          if (stat._id.status === 'Completed') completed = stat.count;
        }
      });

      return {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        avatar: user.avatar,
        role: user.role || 'user',
        pending,
        inProgress,
        completed,
      };
    });

    res.json({
      success: true,
      users: usersWithStats,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Add a new team member
 * @route   POST /api/users
 * @access  Private
 */
export const addMember = async (req, res, next) => {
  try {
    const { name, email, phone, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new AppError('User with this email already exists', 400);
    }

    // Generate a default avatar if none provided (using UI Avatars or Pravatar)
    const avatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`;

    const user = await User.create({
      name,
      email,
      phone,
      password,
      avatar,
      role: 'user',
    });

    res.status(201).json({
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        avatar: user.avatar,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const updateMember = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      throw new AppError('User not found', 404);
    }
    const { name, phone, password } = req.body;
    user.name = name || user.name;
    if (phone) {
      user.phone = phone;
    }
    if (password) {
      user.password = password;
    }
    await user.save();
    res.json({
      success: true,
      user,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get user-specific dashboard statistics & analytics
 * @route   GET /api/users/dashboard
 * @access  Private (Logged-in user)
 */
export const getUserDashboard = async (req, res, next) => {
  try {
    const userId = req.user._id;

    // Filter tasks created by or assigned to this user
    const userTaskFilter = {
      $or: [{ user: userId }, { assignees: userId }],
    };

    // Calculate total, pending, in-progress, completed counts and fetch recent tasks
    const [totalTasks, pendingTasks, inProgressTasks, completedTasks, recentTasks] = await Promise.all([
      Task.countDocuments(userTaskFilter),
      Task.countDocuments({ ...userTaskFilter, status: 'Pending' }),
      Task.countDocuments({ ...userTaskFilter, status: 'In Progress' }),
      Task.countDocuments({ ...userTaskFilter, status: 'Completed' }),
      Task.find(userTaskFilter)
        .select('title status priority createdAt dueDate')
        .sort({ createdAt: -1 })
        .limit(5),
    ]);

    // Calculate weekly stats for the bar chart
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
    sevenDaysAgo.setHours(0, 0, 0, 0);

    const dailyCreated = await Task.aggregate([
      {
        $match: {
          ...userTaskFilter,
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

    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const barData = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(sevenDaysAgo);
      date.setDate(date.getDate() + i);
      const dateStr = date.toISOString().split('T')[0];
      const dayName = daysOfWeek[date.getDay()];
      const dayData = dailyCreated.find((d) => d._id === dateStr);
      barData.push({
        date: dayName,
        created: dayData?.created || 0,
        completed: dayData?.completed || 0,
        inProgress: dayData?.inProgress || 0,
      });
    }

    res.json({
      success: true,
      stats: {
        totalTasks,
        pendingTasks,
        inProgressTasks,
        completedTasks,
      },
      recentTasks,
      barData,
      user: {
        name: req.user.name,
        email: req.user.email,
        avatar: req.user.avatar,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getTask = async (req, res, next) => {
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
