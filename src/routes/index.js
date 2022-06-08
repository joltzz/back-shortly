import { Router } from "express";
import authRouter from "../routes/authRouter.js";
import urlRouter from "../routes/urlRouter.js";

const router= Router();
router.use(authRouter);
router.use(urlRouter);

export default router;