import db from "../db/db.js"

export const findAllVideos = async () => {
    let result = await db.query(`SELECT * FROM videos ORDER BY id DESC LIMIT 10`)
    return result.rows
}

export const findUserVideos = async (id) => {
    let result = await db.query(`SELECT * FROM videos WHERE user_id = $1 `, [id])
    return result.rows
}

export const insertVideo = async ({ title, user_id, url }) => {

    try {
        let result = await db.query(`INSERT INTO videos (title, user_id, url) VALUES ($1, $2, $3) RETURNING id, title, user_id, url`, [title, user_id, url])
        return result.rows[0]
    } catch (err) {
        if (err.code === "23505") throw new AppError("Video already inserted", 409);
        throw err;
    }
} 