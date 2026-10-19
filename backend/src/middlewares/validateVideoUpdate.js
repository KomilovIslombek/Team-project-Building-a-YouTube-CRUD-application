import { updateVideoSchema } from "../validators/video.validator.js"

export const validateVideoUpdate = (req, res, next) => {
    const id = Number(req.params.id)
    if (!Number.isSafeInteger(id) || id < 1) {
        return res.status(400).json({
            status: 400,
            message: "Invalid video id",
        })
    }

    const file = req.files?.file
    if (Array.isArray(file)) {
        return res.status(400).json({
            status: 400,
            message: "Upload only one video file",
        })
    }

    const { error, value } = updateVideoSchema.validate(req.body ?? {}, {
        abortEarly: false,
        stripUnknown: true,
    })

    if (error) {
        return res.status(400).json({
            status: 400,
            message: "Validation error",
            errors: error.details.map((detail) => ({
                field: detail.path[0],
                message: detail.message,
            })),
        })
    }

    if (value.title === undefined && !file) {
        return res.status(400).json({
            status: 400,
            message: "Provide a title or replacement video file",
        })
    }

    req.body = value
    next()
}
