import { Request, Response, NextFunction } from "express";
import { Account } from "../models/account.js";
import jwt from "jsonwebtoken"
import dotenv from "dotenv";
import logger from "../logger.js";

dotenv.config();
const secretKey = process.env.JWTKEY || "1234";

export async function authenticateToken(req: Request, res: Response, next: NextFunction) {
    try {
        const token = req.header('Authorization');

        if (!token) return res.status(401).json({ message: 'Unauthorized' });

        jwt.verify(token, secretKey, async (err, data) => {
            let username = null;
            if (typeof data == 'object')
                username = data?.username;
            if (username == null) throw new Error("Invalid token");
            if (err) return res.status(403).json({ message: 'Forbidden' });
            if (await Account.findById(username) == null)
                throw new Error("username is not existed");
            req.body.username = username;

            next();
        });
    }
    catch (e: any) {
        logger.error(e);
        res.status(400).send(e);
    }
}

export async function register(req: Request, res: Response) {
    try {
        let { username } = req.body;

        if (await Account.findById(username) != null)
            throw new Error("username is existed");
        let account = new Account({
            _id: username,
            ...req.body
        });

        await account.save();

        let resData = {}
        logger.info(resData);

        res.status(200).send(resData);
    }
    catch (e: any) {
        logger.error(e);
        res.status(400).send(e);
    }
}

export async function login(req: Request, res: Response) {
    try {
        let { username, password } = req.body;
        let account = await Account.findById(username);
        if (account == null)
            throw new Error("username is not existed");

        if (account.password != password)
            throw new Error("wrong password");

        const token = jwt.sign({ username }, secretKey, { expiresIn: '1m' });

        let resData = {
            token
        }
        logger.info(resData);

        res.status(200).send(resData);

    }
    catch (e: any) {
        logger.error(e);
        res.status(400).send(e);
    }
}


