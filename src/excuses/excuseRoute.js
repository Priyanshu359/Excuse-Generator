const express = require('express');
const router = express.Router();
const controller = require('./excuseController');
const auth = require('../../middleware/auth');
const validate = require('../../middleware/validate');
const { submitExcuseSchema, updateExcuseSchema } = require('./excuseValidator');

router.post('/', auth, validate(submitExcuseSchema), controller.submitExcuse);
router.get('/:id', controller.getExcuse);  // Public Route
router.get('/', controller.getAllExcuses); // Public Route
router.put('/:id', auth, validate(updateExcuseSchema), controller.updateExcuse);
router.delete('/:id', auth, controller.deleteExcuse);

module.exports = router;