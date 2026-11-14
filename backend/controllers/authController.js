const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { isMongoConnected } = require('../config/db');

const generateToken = (payload) => {
  const secret = process.env.JWT_SECRET || 'super_secret_tech_blog_jwt_token_2026_xyz';
  return jwt.sign(payload, secret, { expiresIn: '7d' });
};

// @desc Auth admin & get token
// @route POST /api/auth/login
const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Please provide email and password' });
  }

  const defaultAdminEmail = (process.env.ADMIN_EMAIL || 'admin@techblog.com').toLowerCase();
  const defaultAdminPassword = process.env.ADMIN_PASSWORD || 'admin123';

  // Check default admin credentials
  if (email.toLowerCase() === defaultAdminEmail && password === defaultAdminPassword) {
    const user = {
      id: 'admin-1',
      name: 'System Admin',
      email: defaultAdminEmail,
      role: 'admin',
    };
    const token = generateToken(user);
    return res.json({
      success: true,
      message: 'Login successful',
      token,
      user,
    });
  }

  // If Mongo is connected, check DB users
  if (isMongoConnected()) {
    try {
      const user = await User.findOne({ email: email.toLowerCase() });
      if (user && (await user.matchPassword(password))) {
        const userInfo = {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        };
        const token = generateToken(userInfo);
        return res.json({
          success: true,
          message: 'Login successful',
          token,
          user: userInfo,
        });
      }
    } catch (e) {
      console.error('Mongo user auth error:', e.message);
    }
  }

  return res.status(401).json({
    success: false,
    message: 'Invalid credentials. Default admin is: admin@techblog.com / admin123',
  });
};

// @desc Get current authenticated user
// @route GET /api/auth/me
const getMe = async (req, res) => {
  return res.json({
    success: true,
    user: req.user,
  });
};

module.exports = {
  login,
  getMe,
};
