import { Request, Response } from "express";
import logger from "../logger.js";
import { Account } from "../models/account.js";

export async function getSupportRequets(req: Request, res: Response) {
    try {
        let { username } = req.body;
        let account = await Account.findById(username).lean();

        let resData = {
            username,
            ...account
        }
        logger.info(resData);

        res.status(200).send(resData);
    }
    catch (e: any) {
        logger.error(e);
        res.status(400).send(e?.message);
    }
}

export async function updateProfile(req: Request, res: Response) {
    try {
        let { username, accountId, accountRole } = req.body;
        let account = await Account.findById(accountId);

        if (username != accountId && accountRole != "Admin") throw new Error("Permission denied");

        account?.overwrite(req.body);
        account?.save();

        let resData = {
        }
        logger.info(resData);

        res.status(200).send(resData);
    }
    catch (e: any) {
        logger.error(e);
        res.status(400).send(e?.message);
    }
}