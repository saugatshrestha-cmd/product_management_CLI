import Joi from 'joi';

export const createSellerSchema = Joi.object({
    storeName: Joi.string().trim().min(2).max(30).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    phone: Joi.string().pattern(/^[0-9]{10,15}$/).required(),
    address: Joi.string().required()
});

export const updateSellerSchema = Joi.object({
    storeName: Joi.string().trim().min(2).max(30),
    phone: Joi.string().pattern(/^[0-9]{10,15}$/),
    address: Joi.string(),
});

export const updateSellerEmailSchema = Joi.object({
    email: Joi.string().email().required()
});

export const updateSellerPasswordSchema = Joi.object({
    password: Joi.string().min(6).required()
});
