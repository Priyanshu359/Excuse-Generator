const express = require('express');
const router = express.Router();
const controller = require('./authController');
const validator = require('./authValidator');
const validate = require('../../middleware/validate');

router.post('/register', validate(validator.registerSchema), controller.register);
router.post('/login', validate(validator.loginSchema), controller.login);

module.exports = router;
