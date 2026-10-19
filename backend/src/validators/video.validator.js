import Joi from 'joi'

export const videoSchema = Joi.object({
    title: Joi.string().alphanum().min(3).required(),
    // user_id: Joi.number().required(),
})

export const updateVideoSchema = Joi.object({
    title: Joi.string().trim().min(3),
})