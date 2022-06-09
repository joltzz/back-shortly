import bcrypt from 'bcrypt';
import db from "../db.js";
import { v4 as uuid } from 'uuid';

export async function newUser(req, res) {
    const { name, email, password, confirmPassword } = req.body;
    if (password !== confirmPassword) {
        return res.sendStatus(404);
    }
    try {
        const user = await db.query('SELECT * FROM users WHERE email = $1', [email]);
        if (user.rows[0]) {
            return res.sendStatus(409);
        }
        await db.query(`INSERT INTO users (name, email, password) VALUES ($1, $2, $3)`, [name, email, bcrypt.hashSync(password, 10)]);
        res.sendStatus(201);

    } catch (err) {
        res.sendStatus(500);
    }
}

export async function login(req, res) {
    const { email, password } = req.body;
    try {
        const user = await db.query('SELECT * FROM users WHERE email = $1', [email]);
        if (user && bcrypt.compareSync(password, user.rows[0].password)) {
            const token = uuid();

            await db.query(`INSERT INTO sessions (token, "userId") VALUES ($1, $2)`, [token, user.rows[0].id]);
            return res.status(200).send({ token });
        }
        res.status(401).send("Usuário ou senha incorretos");
    } catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
}

export async function getInfoUsers(req, res) {
    const { id } = req.params;
    const { session } = req.locals;

    try {
        const user = await db.query('SELECT id FROM users WHERE id=$1', [id]);
        if (user.rows[0].id !== session.userId) {
            return
        }

        const visitCount = await db.query(`
            SELECT users.id, users.name, SUM(urls.visits)
            FROM users
            JOIN urls ON users.id = urls."userId"
            WHERE users.id = $1
            GROUP BY users.id`, [id]
        );
        const infos = await db.query(`
            SELECT urls.id, urls.url, urls."shortUrl", urls.visits
            FROM users 
            JOIN urls ON users.id = urls."userId"
            WHERE users.id = $1`, [id]
        );
        res.status(200).send(
            {
                "id": visitCount.rows[0].id,
                "name": visitCount.rows[0].name,
                "visitCount": Number(visitCount.rows[0].sum),
                "shortenedUrls": infos.rows
            }
        )
    }
    catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
}

export async function getRanking(req, res) {
    try {
        const rank = await db.query(`
            SELECT users.id, users.name,
            COUNT(urls.id) AS "linksCount", 
            SUM(urls.visits) AS "visitCount"
            FROM users
            JOIN urls ON users.id = urls."userId"
            GROUP BY users.id
            ORDER BY "visitCount" DESC LIMIT 10`
        );
        res.status(200).send(rank.rows);
    }
    catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
}