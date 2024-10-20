import { Router } from "express";
import { isValid } from "./../middleware/validation.middleware.js";
import { activateSchema, forgetCodeSchema, loginSchema, registerSchema, resetPasswordSchema } from "./user.validation.js";
import { register , activateAccount, login, sendForgetCode, resetPassword} from './user.controller.js'
const router = Router()

export default router

// Register
router.post("/register", isValid(registerSchema), register)



// Activate Account
router.get('/confirmEmail/:activationCode', isValid(activateSchema), activateAccount)

// Login 
router.post('/login', isValid(loginSchema), login)

// send forget password code
router.patch('/forgetCode', isValid(forgetCodeSchema), sendForgetCode)

// Reset Password
router.patch('/resetPassword', isValid(resetPasswordSchema), resetPassword)
