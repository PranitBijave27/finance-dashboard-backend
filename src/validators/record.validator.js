const Joi = require("joi");

const createRecordSchema = Joi.object({
    amount: Joi.number().positive().required(),
    type: Joi.string().valid("income", "expense").required(),
    category: Joi.string().min(2).max(50).required(),
    date: Joi.date().required(),
    notes: Joi.string().max(300).optional().allow(""),
});

const updateRecordSchema = Joi.object({
    amount: Joi.number().positive(),
    type: Joi.string().valid("income", "expense"),
    category: Joi.string().min(2).max(50),
    date: Joi.date(),
    notes: Joi.string().max(300).allow(""),
}).min(1);

module.exports = { createRecordSchema, updateRecordSchema };