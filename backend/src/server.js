import express from 'express'

import userRouter from './routes/user.routes.js'

import chalk from 'chalk'
import dotenv from 'dotenv'

import fileUpload from 'express-fileupload'

dotenv.config()
const PORT  = process.env.PORT

const app = express()
app.use(fileUpload())
app.use(express.json())

app.use('/api/v1', userRouter)

app.listen(PORT, () => {
    console.log(chalk.green(`Server is aggressively running on port ${chalk.red(PORT)}`))
})