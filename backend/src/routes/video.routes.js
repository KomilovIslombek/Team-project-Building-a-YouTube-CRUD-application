import { Router } from "express";
import { getVideos, getVideosByUserId, createVideo, updateVideo, deleteVideo } from "../controllers/video.controllers.js";
import { auth } from "../middlewares/auth.js";
import { validate } from "../middlewares/validate.js";
import { validateVideoUpdate } from "../middlewares/validateVideoUpdate.js";
import { videoSchema } from "../validators/video.validator.js";

const router = Router()

router
    .get('/', getVideos)
    .get('/:id', getVideosByUserId)
    .post('/one', auth, validate(videoSchema), createVideo)
    .patch('/:id', auth, validateVideoUpdate, updateVideo)
    .delete('/:id', auth, deleteVideo)

export default router