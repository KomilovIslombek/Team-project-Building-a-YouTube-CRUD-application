import chalk from "chalk";
import { Pool } from "pg";

const pool = new Pool({
    user: 'postgres',
    password: 'admin',
    database: 'youtube',
    host: 'localhost',
    port: 5432
})

pool.on('connect', () => {
    console.log(chalk.yellow(`We're connected efficiently to youtube db`))
})

pool.on('error', (err) => {
    console.error('Unexpected error on idle client', err);
    process.exit(-1)
})


// export default pool;

export default {
    query : (text, params) => pool.query(text, params),
}