const Joi = require('joi');

exports.sellValidator = Joi.object({
    excuse_id: Joi.number().required(),
    price: Joi.number().integer().min(1).required()
});