import { Router } from "express";
import { getURL, openShortUrl, shortenURL, deleteURL } from '../controllers/urlsControllers.js';
import { validateTokenMiddleware } from "../middlewares/validateTokenMiddleware.js";

const urlRouter = Router();

urlRouter.post("/urls/shorten", validateTokenMiddleware, shortenURL);
urlRouter.get('/urls/:id', getURL);
urlRouter.get('/urls/open/:shortUrl', openShortUrl);
urlRouter.delete('/urls/:id', validateTokenMiddleware, deleteURL);

export default urlRouter;
