import path from 'path'
import crypto from 'crypto'
import { unlink } from 'fs/promises'
import { AppError } from './appError.js'

const VIDEO_DIR = path.resolve("uploads", "videos");

export const buildVideoName = (file) => {
    return `${crypto.randomUUID()}${path.extname(file.name).toLowerCase()}`
}

export const saveVideo = (file, name) => file.mv(path.join(VIDEO_DIR, name))

export const removeVideo = async (name) => {
    if (!name || path.basename(name) !== name) {
        throw new AppError("Invalid stored video filename", 500)
    }

    const filePath = path.resolve(VIDEO_DIR, name)
    if (!filePath.startsWith(`${VIDEO_DIR}${path.sep}`)) {
        throw new AppError("Invalid stored video filename", 500)
    }

    try {
        await unlink(filePath)
    } catch (error) {
        if (error.code !== "ENOENT") throw error
    }
}