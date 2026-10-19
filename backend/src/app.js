import express from 'express'

import userRoutes from './routes/user.routes.js'

import fileUpload from 'express-fileupload'
import { errorHandler } from './middlewares/errorHandler.js'

import dotenv from 'dotenv'
dotenv.config()

const app = express()
app.use(express.json())
app.use(fileUpload())
// app.use("/uploads", express.static("uploads"))

app.use('/api/v1/users', userRoutes)


app.use(errorHandler); // must be last

export default app