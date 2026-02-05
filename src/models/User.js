const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 30,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      validate: [validator.isEmail, 'Invalid email'],
    },
    password_hash: {
      type: String,
      required: true,
      minlength: 6,
    },
    phone: {
      type: String,
      validate: {
        validator: function (w) {
          // Accepts various formats: +1 (555) 123-4567, 555-123-4567, 5551234567
          return /^[\+]?[1-9][\d]{0,15}$/.test(v.replace(/[\s\(\)\-]/g, ''));
        },
        message: 'Invalid phone number',
      },
    },
    addresses: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'address',
      },
    ],
    role: {
      type: String,
      enum: ['user', 'moderator', 'admin'],
      default: 'user',
    },
    status: {
      type: String,
      enum: ['active', 'inactive', 'suspended'],
      default: 'active',
    },
    avatar_url: { type: String, default: '' },
    preferences: {
      type: Map,
      of: mongoose.Schema.Types.Mixed,
      default: {},
    },
    last_login_at: { type: Date, default: null },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: false },
    toJSON: {
      virtuals: true,
      transform: function (doc, ret) {
        delete ret.password_hash;
        delete ret.__v;
        return ret;
      },
    },
  }
);

// Indexes
userSchema.index({ email: 1 }, { unique: true });
userSchema.index({ last_login_at: -1 });
userSchema.index({ role: 1, status: 1 });

module.exports = mongoose.model('user', userSchema);
