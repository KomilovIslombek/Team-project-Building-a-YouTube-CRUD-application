import { Router } from "express";
import { registerUser, getUsers } from "../controllers/user.controllers.js";

const router = Router()

router.get('/users', getUsers)

// New user
router.post('/users/register', registerUser)


export default router