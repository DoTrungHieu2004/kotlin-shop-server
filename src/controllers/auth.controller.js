const User = require('../models/User');
const Address = require('../models/Address');
const { generateToken } = require('../utils/jwt');
const { hashPassword, comparePassword } = require('../utils/password');

// Register
const register = async (req, res) => {
  try {
    const { username, email, password, phone } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    // Hash password
    const password_hash = await hashPassword(password);

    // Create user
    const user = await User.create({
      username,
      email,
      password_hash,
      phone,
      role: 'user',
    });

    // Generate token
    const token = generateToken(user._id, user.role);

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        avatar_url: user.avatar_url,
      },
    });
  } catch (error) {
    res.status(500).json({ error: 'Registration failed' });
  }
};

// Login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await comparePassword(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Update last login
    user.last_login_at = new Date();
    await user.save();

    // Generate token
    const token = generateToken(user._id, user.role);

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        avatar_url: user.avatar_url,
      },
    });
  } catch (error) {
    res.status(500).json({ error: 'Login failed' });
  }
};

// Get current user
const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId)
      .select('-password_hash -__v')
      .populate('addresses', 'type street city state zip_code is_default');

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user' });
  }
};

// Update profile
const updateProfile = async (req, res) => {
  try {
    const updates = req.body;

    // Remove restricted fields
    delete updates.role;
    delete updates.status;
    delete updates.password_hash;

    const user = await User.findByIdAndUpdate(req.user.userId, updates, {
      new: true,
      runValidators: true,
    }).select('-password_hash -__v');

    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ error: 'Update failed' });
  }
};

// Change password
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user.userId);

    // Verify current password
    const isMatch = await comparePassword(currentPassword, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Current password is incorrect' });
    }

    // Hash new password
    user.password_hash = await hashPassword(newPassword);
    await user.save();

    res.json({ success: true, message: 'Password updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Password change failed' });
  }
};

module.exports = {
  register,
  login,
  getCurrentUser,
  updateProfile,
  changePassword,
};
