import bcrypt from 'bcrypt';
import db from '../db/db.js';
import { AppError } from '../utils/appError.js';

export const createUser = async ({ username, password, profile_img }) => {
    let hash = await bcrypt.hash(password, 10);

    try {
        let result = await db.query(`INSERT INTO users (username, password, profile_img) VALUES ($1, $2, $3) RETURNING id, username, profile_img`, [ username, hash, profile_img ])
        return result.rows[0]
    }  catch (err) {
        if (err.code === "23505") throw new AppError("Username already taken", 409);
        throw err;
    }
}

export const findAllUsers = async () => {
  const result = await db.query("SELECT id, username, profile_img FROM users");
  return result.rows;
};