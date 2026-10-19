import path from 'path'
import crypto from 'crypto'

const VIDEO_DIR = path.resolve("uploads", "videos");

export const buildVideoName = (file) => {
    return `${crypto.randomUUID()}${path.extname(file.name).toLowerCase()}`
}

export const saveVideo = (file, name) => file.mv(path.join(VIDEO_DIR, name))