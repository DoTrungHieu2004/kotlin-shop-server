const validator = require('validator');

const validateRegister = (req, res, next) => {
  const { username, email, password } = req.body;

  if (!username || username.length < 3) {
    return res
      .status(400)
      .json({ error: 'Username must be at least 3 characters' });
  }

  if (!validator.isEmail(email)) {
    return res.status(400).json({ error: 'Invalid email format' });
  }

  if (!password || password.length < 6) {
    return res
      .status(400)
      .json({ error: 'Password must be at least 6 characters' });
  }

  next();
};

const validateLogin = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  if (!validator.isEmail(email)) {
    return res.status(400).json({ error: 'Invalid email format' });
  }

  next();
};

const validatePassChange = (req, res, next) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return res.status(400).json({ error: 'Both passwords are required' });
  }

  if (newPassword.length < 6) {
    return res
      .status(400)
      .json({ error: 'New password must be at least 6 characters' });
  }

  next();
};

module.exports = { validateRegister, validateLogin, validatePassChange };
