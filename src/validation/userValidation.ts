import Joi from 'joi';

export const createUserSchema = Joi.object({
    firstName: Joi.string().trim().min(2).max(30).required(),
    lastName: Joi.string().trim().min(2).max(30).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    phone: Joi.string().pattern(/^[0-9]{10,15}$/).required(),
    address: Joi.string().required()
});

export const updateUserSchema = Joi.object({
    firstName: Joi.string().trim().min(2).max(30),
    lastName: Joi.string().trim().min(2).max(30),
    phone: Joi.string().pattern(/^[0-9]{10,15}$/),
    address: Joi.string(),
});

export const updateUserEmailSchema = Joi.object({
    email: Joi.string().email().required()
});

export const updateUserPasswordSchema = Joi.object({
    password: Joi.string().min(6).required()
});
