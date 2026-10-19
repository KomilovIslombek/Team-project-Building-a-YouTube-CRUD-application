import db from "../db/db.js";

export const registerUser = async (req, res) => {
    let  { username, password } = req.body;
    let file = req.files.file;
    console.log('file', file)

    try {
        let insertQuery = `INSERT INTO users (username, password, profile_img) VALUES ('${username}', '${password}', '${file.name}')`

        let result = await db.query(insertQuery)
        res.status(201).json({
            status: 201,
            message: 'User created properly',
            data: result.rows[0] || 'data'
        });
    } catch (err) {
        console.error('Error during inserting a new user', err.message);
        return res.status(500).json({
            status: 500,
            message: 'Server Error / cannot add a new user'
        });
    }
} 


export const getUsers = async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM users')

        return res.status(200).json({
            status: 200,
            message: 'Users fetched successfully',
            data: result.rows
        })
    } catch (err) {
        console.error(err.message);
        return res.status(500).send('Server Error');
    }
}