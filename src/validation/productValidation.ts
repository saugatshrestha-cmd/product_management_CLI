import Joi from 'joi';

export const createProductSchema = Joi.object({
    name: Joi.string().trim().min(2).max(100).required(),
    description: Joi.string().trim().max(500).optional(),
    price: Joi.number().positive().required(),
    quantity: Joi.number().integer().min(0).required(),
    categoryId: Joi.string().required(),
});

export const updateProductSchema = Joi.object({
    name: Joi.string().trim().min(2).max(100),
    description: Joi.string().trim().max(500),
    price: Joi.number().positive(),
    quantity: Joi.number().integer().min(0),
    category: Joi.string(),
});

