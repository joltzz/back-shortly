import { Router } from "express";
import { login } from "../controllers/authController.js";
import { validatesSchemaMiddleware } from "../middlewares/validateSchemaMiddleware.js";
import loginSchema from "../schemas/loginSchema.js";

const authRouter = Router();

authRouter.post("/login", validatesSchemaMiddleware(loginSchema), login);

export default authRouter;
