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

const DUMMY_HASH = "$2b$10$CwTycUXWue0Thq9StjUM0uJ8.cK1fS2C6hG1Z0bq1m6v8Zr1Gm1kG";

export const authenticateUser = async ({ username, password }) => {
    const result = await db.query(
        "SELECT id, username, password, profile_img FROM users WHERE username = $1",
        [username]
    );
    const user = result.rows[0];

    // Always run bcrypt.compare, even if the user doesn't exist
    const isMatch = await bcrypt.compare(password, user ? user.password : DUMMY_HASH);

    if (!user || !isMatch) {
        throw new AppError("Invalid username or password", 401);
    }

    const { password: _removed, ...safeUser } = user; // never return the hash
    return safeUser;
}

export const findUser = async ({id}) => {
    if(!id || !isFinite(id)) return false

    let result = await db.query(`SELECT id, username, profile_img FROM users WHERE id = $1`, [id])
    return result.rows[0];
}

export const findAllUsers = async () => {
  const result = await db.query("SELECT id, username, profile_img FROM users");
  return result.rows;
};