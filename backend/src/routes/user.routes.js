import { Router } from "express";
import { registerUser, getUsers } from "../controllers/user.controllers.js";
import { validate } from "../middlewares/validate.js";
import { userSchema } from "../validators/user.validator.js";
import { validateAvatar } from "../middlewares/validateAvatar.js";
import { auth } from "../middlewares/auth.js";

const router = Router()

router.get('/', auth, getUsers)
router.post('/register', validateAvatar, validate(userSchema), registerUser)


export default router