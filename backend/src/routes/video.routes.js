import { Router } from "express";
import { getVideos, getVideosByUserId, createVideo } from "../controllers/video.controllers.js";
import { auth } from "../middlewares/auth.js";
import { validate } from "../middlewares/validate.js";
import { videoSchema } from "../validators/video.validator.js";

const router = Router()

router
    .get('/', getVideos)
    .get('/:id', getVideosByUserId)
    .post('/one', auth, validate(videoSchema), createVideo)
    
export default router