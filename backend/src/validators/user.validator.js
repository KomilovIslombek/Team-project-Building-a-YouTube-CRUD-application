import Joi from "joi";

export const userSchema = Joi.object({
    username: Joi.string().trim().alphanum().min(3).max(60).required(),
    password: Joi.string().min(8).max(72).required()
})

export const loginSchema = Joi.object({
    username: Joi.string().trim().required(),
    password: Joi.string().required(),
})