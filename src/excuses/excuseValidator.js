const Joi = require('joi');

exports.submitExcuseSchema = Joi.object({
    content: Joi.string().min(5).max(500).required(),
    status: Joi.string().valid('pending', 'deleted', 'approved', 'rejected').default('pending'),
});

exports.updateExcuseSchema = Joi.object({
    content: Joi.string().min(5).max(500).required(),
});
