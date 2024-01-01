import { Request, Response } from "express";
import logger from "../logger.js";
import { Account } from "../models/account.js";
import { GroupContribute, PersonalContribute } from "../models/contribute.js";

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

        if (username != accountId && accountRole != "Admin") throw new Error("Permission denied");

        await Account.updateOne({ _id: accountId }, req.body);

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

export async function getGroupContributesOfAccount(req: Request, res: Response) {
    try {
        let { pageNumber, accountId } = req.params;
        let { filter = ["Pending", "Accepted", "Rejected"] } = req.body;

        let perPage = 10;
        let skip = (Number(pageNumber) - 1) * perPage;

        let groupContributes = await GroupContribute.find({ accountId, $or: filter.map((e: String) => { return { status: e } }) })
            .sort({ createAt: 1 }).skip(skip).limit(perPage)
            .populate("accountId")
            .populate("eventId")
            .lean();

        let resData = {
            groupContributes
        }
        logger.info(resData);

        res.status(200).send(resData);
    }
    catch (e: any) {
        logger.error(e);
        res.status(400).send(e?.message);
    }
}

export async function getPersonalContributesOfAccount(req: Request, res: Response) {
    try {
        let { pageNumber, accountId } = req.params;
        let { filter = ["Pending", "Accepted", "Rejected"] } = req.body;

        let perPage = 10;
        let skip = (Number(pageNumber) - 1) * perPage;

        let groupContributes = await PersonalContribute.find({ accountId, $or: filter.map((e: String) => { return { status: e } }) })
            .sort({ createAt: 1 }).skip(skip).limit(perPage)
            .populate("accountId")
            .populate("supportRequestId")
            .lean();

        let resData = {
            groupContributes
        }
        logger.info(resData);

        res.status(200).send(resData);
    }
    catch (e: any) {
        logger.error(e);
        res.status(400).send(e?.message);
    }
}