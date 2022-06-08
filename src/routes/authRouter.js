import { Router } from "express";
import { newUser, login } from "../controllers/userController.js";

const authRouter = Router();

authRouter.post("/signup", newUser);
authRouter.post("/signin", login);

export default authRouter;
