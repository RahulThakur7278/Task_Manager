import { z } from 'zod';
import User from '../models/User.js';
import AppError from '../utils/AppError.js';
import { generateAccessToken, generateRefreshToken } from '../utils/generateToken.js';
import jwt from 'jsonwebtoken';
import transporter from '../config/mail.js';

// Zod schemas
export const registerSchema = z.object({
  name: z.string().min(1, 'Name is required').max(50, 'Name cannot exceed 50 characters').trim(),
  email: z.string().email('Please provide a valid email').trim().toLowerCase(),
  phone: z.string().min(1, 'Phone number is required').trim(),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const loginSchema = z.object({
  email: z.string().email('Please provide a valid email').trim().toLowerCase(),
  password: z.string().min(1, 'Password is required'),
});

// Cookie options for refresh token
const refreshCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  path: '/',
};

/**
 * @desc    Register a new user
 * @route   POST /api/auth/register
 * @access  Public
 */
export const register = async (req, res, next) => {
  try {
    const { name, email, phone, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new AppError('User with this email already exists', 400);
    }
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Welcome to Task Manager - Registration Successful',
      html: `
        <h3>Hello ${name},</h3>
        <p>Congratulations! Your Admin account has been successfully created on the Task Manager platform.</p>
        <p>Here are your registration details:</p>
        <ul>
          <li><strong>Email:</strong> ${email}</li>
          <li><strong>Password:</strong> ${password}</li>
        </ul>
        <p>You can now log in and start managing your team.</p>
        <br>
        <p>Best Regards,<br>Task Manager Team</p>
      `,
    };

    try {
      // Use await to make sure the email actually sends successfully
      await transporter.sendMail(mailOptions);
    } catch (error) {
      console.error('Error sending welcome email:', error);
      throw new AppError('Failed to send welcome email. Admin account was not created. Please check email configuration.', 500);
    }
    const user = await User.create({ name, email, phone, password, role: 'admin' });
    const accessToken = generateAccessToken(user._id, user.role, user.tokenVersion);
    const refreshToken = generateRefreshToken(user._id, user.role, user.tokenVersion);

    res.cookie('refreshToken', refreshToken, refreshCookieOptions);

    res.status(201).json({
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
      accessToken,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Login user
 * @route   POST /api/auth/login
 * @access  Public
 */
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      throw new AppError('Invalid email or password', 401);
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      throw new AppError('Invalid email or password', 401);
    }

    const accessToken = generateAccessToken(user._id, user.role, user.tokenVersion);
    const refreshToken = generateRefreshToken(user._id, user.role, user.tokenVersion);

    res.cookie('refreshToken', refreshToken, refreshCookieOptions);

    res.json({
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      accessToken,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Logout user (clear refresh token cookie)
 * @route   POST /api/auth/logout
 * @access  Public
 */
export const logout = (req, res) => {
  res.cookie('refreshToken', '', {
    httpOnly: true,
    expires: new Date(0),
    path: '/',
  });
  res.json({ success: true, message: 'Logged out successfully' });
};

/**
 * @desc    Refresh access token using refresh token cookie
 * @route   POST /api/auth/refresh
 * @access  Public
 */
export const refreshAccessToken = async (req, res, next) => {
  try {
    const token = req.cookies?.refreshToken;

    if (!token) {
      throw new AppError('No refresh token provided', 401);
    }

    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      throw new AppError('User not found', 401);
    }

    if (user.tokenVersion !== decoded.tokenVersion) {
      throw new AppError('Invalid or expired refresh token', 401);
    }

    const accessToken = generateAccessToken(user._id, user.role, user.tokenVersion);

    res.json({
      success: true,
      accessToken,
    });
  } catch (error) {
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      return next(new AppError('Invalid or expired refresh token', 401));
    }
    next(error);
  }
};

/**
 * @desc    Get current user profile
 * @route   GET /api/auth/me
 * @access  Private
 */
export const getMe = async (req, res, next) => {
  try {
    if (!req.user) {
      throw new AppError('User not found', 404);
    }
    res.json({
      success: true,
      user: {
        _id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const logoutAllDevices = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (user) {
      user.tokenVersion += 1;
      await user.save();
      res.json({ message: 'Logged out from all devices successfully' });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};
