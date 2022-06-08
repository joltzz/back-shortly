import { v4 as uuid } from "uuid";
import db from "../db.js";

export async function shortenURL(req, res){
    const { url } = req.body;
    try{
        const { session } = res.locals;
        const shortUrl = uuid();
        await db.query(`INSERT INTO urls ("userId", url, "shortUrl") VALUES ($1, $2, $3)`, [session.userId, url, shortUrl]);
        res.status(201).send({shortUrl});
    }catch(err){
        res.sendStatus(500);
    }
}

export async function getURL(req, res){
    const { id } = req.params;
    try{
        const url = await db.query(`SELECT id, "shortUrl", url FROM urls WHERE id = $1`, [id]);
        if(!url.rows[0]) return res.sendStatus(404);
        res.status(200).send(url.rows[0]);
    }catch(err){
        res.sendStatus(500);
    }
}

export async function openShortUrl(req, res){
    const { shortUrl } = req.params;
    try{
        const url = await db.query(`SELECT * FROM urls WHERE "shortUrl" = $1`, [shortUrl]);
        if(!url.rows[0]) return res.sendStatus(404);
        await db.query(`UPDATE urls SET visits = visits + 1 WHERE "shortUrl" = $1`, [shortUrl]);
        res.redirect(url.rows[0].url);
    }catch(err){
        res.sendStatus(500);
    }
}

export async function deleteURL(req, res){
    const { id } = req.params;
    const { session } = res.locals;
    try{
        const url = await db.query(`SELECT "userId" FROM urls WHERE id = $1`, [id]);
        if( url.rows[0].userId !== session.userId ) return res.sendStatus(401);
        await db.query(`DELETE FROM urls WHERE id = $1`, [id]);	
        res.sendStatus(204);
    }catch(err){
        console.log(err);
        res.sendStatus(500);
    }
}