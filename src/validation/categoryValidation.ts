import Joi from 'joi';

export const createCategorySchema = Joi.object({
    name: Joi.string().trim().min(2).max(50).required(),
    description: Joi.string().trim().max(300),
});

export const updateCategorySchema = Joi.object({
    name: Joi.string().trim().min(2).max(50),
    description: Joi.string().trim().max(300),
});
