import { Router } from "express";
import { login } from "../controllers/authController.js";
import { validatesSchemaMiddleware } from "../middlewares/validateSchemaMiddleware.js";
import loginSchema from "../schemas/loginSchema.js";


