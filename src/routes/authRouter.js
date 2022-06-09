import { Router } from "express";
import { newUser, login, getInfoUsers, getRanking } from "../controllers/userController.js";
import { validateTokenMiddleware } from "../middlewares/validateTokenMiddleware.js";

const authRouter = Router();

authRouter.post("/signup", newUser);
authRouter.post("/signin", login);
authRouter.get("/users/:id", validateTokenMiddleware, getInfoUsers);
authRouter.get("/ranking", getRanking);

export default authRouter;
