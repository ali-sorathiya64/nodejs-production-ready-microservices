import express from 'express';
import { validateBody } from 'shared';
import { loginSchema, registerSchema } from '../schemas/auth.schema';
import * as authController from '../controllers/auth.controller'

const router =express.Router();

router.post('/register',validateBody(registerSchema) ,authController.registerController)
router.post('/login',validateBody(loginSchema) ,authController.loginController)
router.get("/get-me",authController.getMe)


export default router;