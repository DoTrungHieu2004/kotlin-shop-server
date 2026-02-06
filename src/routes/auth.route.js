const express = require('express');
const router = express.Router();

const authCtrl = require('../controllers/auth.controller');
const { authenticate } = require('../utils/jwt');
const validate = require('../middleware/validate');

// Public routes
router.post('/register', validate.validateRegister, authCtrl.register);
router.post('/login', validate.validateLogin, authCtrl.login);

// Protected routes (require authentication)
router.get('/me', authenticate, authCtrl.getCurrentUser);
router.patch('/profile', authenticate, authCtrl.updateProfile);
router.patch(
  '/password',
  authenticate,
  validate.validatePassChange,
  authCtrl.changePassword
);

module.exports = router;
