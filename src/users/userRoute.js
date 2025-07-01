const express = require('express');
const router = express.Router();
const userController = require('./userController');
const validate = require('../../middleware/validate');
const auth = require('../../middleware/auth');
const { updateProfileSchema } = require('./userValidator');

router.get('/profile', auth, userController.getProfile);
router.put('/profile', auth, validate(updateProfileSchema), userController.updateProfile);
router.get('/token-balance', auth, userController.getTokenBalance);

module.exports = router;


