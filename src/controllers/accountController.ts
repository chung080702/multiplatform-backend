import { Request, Response } from "express";
import logger from "../logger.js";
import { Account } from "../models/account.js";

export async function getAccount(req: Request, res: Response) {
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

export async function getProfile(req: Request, res: Response) {
    try {
        let { accountId } = req.params;
        let account = await Account.findById(accountId).lean();

        let resData = {
            username: accountId,
            ...account,
            password: null,
        }
        logger.info(resData);

        res.status(200).send(resData);
    }
    catch (e: any) {
        logger.error(e);
        res.status(400).send(e?.message);
    }
}

export async function updateAccount(req: Request, res: Response) {
    try {
        let { username, accountRole } = req.body;
        let { accountId } = req.params;
        let account = await Account.findById(accountId);

        if (username != accountId && accountRole != "Admin") throw new Error("Permission denied");

        await Account.updateOne({ _id: account?._id }, req.body);

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