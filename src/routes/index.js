const express = require('express');
const mongoose = require('mongoose');

const router = express.Router();

// System health
router.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    service: 'Kotlin Shop API',
    database:
      mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected',
  });
});

// Test database route
router.get('/db-test', async (req, res) => {
  try {
    const dbState = mongoose.connection.readyState;
    const states = ['Disconnected', 'Connected', 'Connecting', 'Disconnecting'];

    res.status(200).json({
      database: states[dbState],
      host: mongoose.connection.host,
      name: mongoose.connection.name,
      models: Object.keys(mongoose.connection.models),
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
