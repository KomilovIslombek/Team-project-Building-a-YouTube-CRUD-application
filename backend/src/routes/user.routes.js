import { Router } from "express";
import { registerUser, loginUser, getUsers, getUser  } from "../controllers/user.controllers.js";
import { validate } from "../middlewares/validate.js";
import { loginSchema, userSchema } from "../validators/user.validator.js";
import { validateAvatar } from "../middlewares/validateAvatar.js";
import { auth } from "../middlewares/auth.js";

const router = Router()

router.get('/', auth, getUsers)
router.get('/:id', auth, getUser)
router.post('/register', validateAvatar, validate(userSchema), registerUser)
router.post('/login', validate(loginSchema), loginUser)


export default router