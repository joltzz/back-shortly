import { Router } from "express";
import authRouter from "./authRouter";
import urlRouter from "./urlRouter";

const router= Router();
router.use(authRouter);
router.use(urlRouter);

export default router;