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
    });

    res.status(201).json({
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        avatar: user.avatar,
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
    console.log("updated user", user);
  } catch (error) {
    next(error);
  }
};
