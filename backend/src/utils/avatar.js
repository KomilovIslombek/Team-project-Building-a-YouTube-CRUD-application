import path from 'path'
import crypto from 'crypto'

const AVATAR_DIR = path.resolve("uploads", "avatars");

export const buildAvatarName = (file) => {
    return `${crypto.randomUUID()}${path.extname(file.name).toLowerCase()}`
}

export const saveAvatar = (file, name) => file.mv(path.join(AVATAR_DIR, name))