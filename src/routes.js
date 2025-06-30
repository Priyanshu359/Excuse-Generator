// src/routes.js
const express = require('express');
const router = express.Router();

const authRoutes = require('./auth/authRoute');
// More to come later .....


router.use('/auth', authRoutes);

// TODO: add more features as they are built
router.get('/', (req, res) => res.send('Excuse Generator API Running'));

module.exports = router;
