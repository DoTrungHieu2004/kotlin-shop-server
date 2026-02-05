const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: ['home', 'office', 'other'],
      default: 'home',
    },
    street: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    city: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    state: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    zip_code: {
      type: String,
      required: true,
      trim: true,
      maxlength: 20,
    },
    is_default: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: function (doc, ret) {
        delete ret.__v;
        return ret;
      },
    },
  }
);

// Ensure only one default address per user
addressSchema.index(
  { user_id: 1, is_default: 1 },
  { unique: true, partialFilterExpression: { is_default: true } }
);

module.exports = mongoose.model('address', addressSchema);
