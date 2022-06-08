import bcrypt from 'bcrypt';
import db from "../db.js";
import { v4 as uuid } from 'uuid';

export async function newUser(req, res){
    const { name, email, password, confirmPassword } = req.body;
    if(password !== confirmPassword) return res.sendStatus(404);
    try{
        const user = await db.query('SELECT * FROM users WHERE email = $1', [email]);
        if(user.rows[0]) return res.sendStatus(409);

        await db.query(`INSERT INTO users (name, email, password) VALUES ($1, $2, $3)`, [name, email, bcrypt.hashSync(password,10)]);
        res.sendStatus(201);

    }catch(err){
        res.sendStatus(500);
    }
}

export async function login(req, res){
    const { email, password } = req.body;
    try{
        const user = await db.query('SELECT * FROM users WHERE email = $1', [email]);
        if(user && bcrypt.compareSync(password, user.rows[0].password)){
            const token = uuid();

            await db.query(`INSERT INTO sessions (token, "userId") VALUES ($1, $2)`, [token, user.rows[0].id]);
            return res.status(200).send({token});
        }
        res.status(401).send("Usuário ou senha incorretos");
    }catch(err){
        console.log(err);
        res.sendStatus(500);
    }
}