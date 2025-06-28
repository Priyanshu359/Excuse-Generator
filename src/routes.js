// src/routes.js
const express = require('express');
const router = express.Router();

// Import feature routes (commented out for now)
// const authRoutes = require('./auth/auth.routes');
// const userRoutes = require('./users/user.routes');

// router.use('/auth', authRoutes);
// router.use('/users', userRoutes);

// TODO: add more features as they are built
router.get('/', (req, res) => res.send('Excuse Generator API Running'));

module.exports = router;
