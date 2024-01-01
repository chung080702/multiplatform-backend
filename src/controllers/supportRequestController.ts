import { Request, Response } from "express";
import logger from "../logger.js";
import { SupportRequest } from "../models/supportRequest.js";
import { PersonalContribute } from "../models/contribute.js";

export async function getSupportRequets(req: Request, res: Response) {
    try {
        let { pageNumber, search = "" } = req.params;
        let { filter = ["Pending", "Accepted", "Rejected"] } = req.body;
        let perPage = 10;
        let skip = (Number(pageNumber) - 1) * perPage;

        let supportRequests = await SupportRequest.find({ title: { $regex: search, $options: 'i' }, $or: filter.map((e: String) => { return { status: e } }) })
            .sort({ createAt: 1 }).skip(skip).limit(perPage)
            .populate("accountId").lean();

        let resData = {
            supportRequests
        }
        logger.info(resData);

        res.status(200).send(resData);
    }
    catch (e: any) {
        logger.error(e);
        res.status(400).send(e?.message);
    }
}

export async function getSupportRequetsOfUser(req: Request, res: Response) {
    try {
        let { accountId, pageNumber, search = "" } = req.params;
        let { filter = ["Pending", "Accepted", "Rejected"] } = req.body;

        let perPage = 10;
        let skip = (Number(pageNumber) - 1) * perPage;

        let supportRequests = await SupportRequest.find({ accountId, title: { $regex: search, $options: 'i' }, $or: filter.map((e: String) => { return { status: e } }) })
            .sort({ createAt: 1 }).skip(skip).limit(perPage)
            .populate("accountId").lean();

        let resData = {
            supportRequests
        }
        logger.info(resData);

        res.status(200).send(resData);
    }
    catch (e: any) {
        logger.error(e);
        res.status(400).send(e?.message);
    }
}


export async function getSupportRequet(req: Request, res: Response) {
    try {
        let { supportRequestId } = req.params;
        let supportRequest = await SupportRequest.findById(supportRequestId)
            .populate("accountId").lean();

        if (supportRequest == null) throw new Error("Support request is not existed")
        let resData = {
            supportRequest
        }
        logger.info(resData);

        res.status(200).send(resData);
    }
    catch (e: any) {
        logger.error(e);
        res.status(400).send(e?.message);
    }
}

export async function createSupportRequest(req: Request, res: Response) {
    try {
        let { username } = req.body;

        let supportRequest = new SupportRequest({
            ...req.body,
            accountId: username
        })

        supportRequest.status = "Pending";

        await supportRequest.save();

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

export async function updateSupportRequest(req: Request, res: Response) {
    try {
        let { username } = req.body;
        let { supportRequestId } = req.params;

        await SupportRequest.updateOne({ _id: supportRequestId, accountId: username }, req.body)

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

export async function acceptSupportRequest(req: Request, res: Response) {
    try {
        let { accountRole } = req.body;
        let { supportRequestId } = req.params;

        if (accountRole != "Admin") throw new Error("Permission denied");

        let supportRequest = await SupportRequest.findById(supportRequestId)

        if (supportRequest == null) throw new Error("Support request is not existed");

        supportRequest.status = "Accepted";

        await supportRequest.save();

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

export async function rejectSupportRequest(req: Request, res: Response) {
    try {
        let { accountRole } = req.body;
        let { supportRequestId } = req.params;

        if (accountRole != "Admin") throw new Error("Permission denied");

        let supportRequest = await SupportRequest.findById(supportRequestId)

        if (supportRequest == null) throw new Error("Support request is not existed");

        supportRequest.status = "Rejected";

        await supportRequest.save();

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

export async function createPersonalContribute(req: Request, res: Response) {
    try {
        let { supportRequestId } = req.params;
        let { username } = req.body;

        let supportRequest = await SupportRequest.findById(supportRequestId);
        if (supportRequest == null) throw new Error("Support request is not existed");
        if (supportRequest.status != "Accepted") throw new Error("Support request is not accepted");
        let personalContribute = new PersonalContribute({
            ...req.body,
            supportRequestId,
            accountId: username
        })

        personalContribute.status = "Pending";

        await personalContribute.save();

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

export async function getPersonalContributesOfSupportRequest(req: Request, res: Response) {
    try {
        let { pageNumber, supportRequestId } = req.params;
        let { filter = ["Pending", "Accepted", "Rejected"] } = req.body;

        let perPage = 10;
        let skip = (Number(pageNumber) - 1) * perPage;

        let groupContributes = await PersonalContribute.find({ supportRequestId, $or: filter.map((e: String) => { return { status: e } }) })
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

export async function getPersonalContribute(req: Request, res: Response) {
    try {
        let { personalContributeId } = req.params;
        let personalContribute = await PersonalContribute.findById(personalContributeId)
            .populate("accountId")
            .populate("supportRequestId")
            .lean();

        if (personalContribute == null) throw new Error("personal contribute is not existed")
        let resData = {
            personalContribute
        }
        logger.info(resData);

        res.status(200).send(resData);
    }
    catch (e: any) {
        logger.error(e);
        res.status(400).send(e?.message);
    }
}

export async function acceptPersonalContribute(req: Request, res: Response) {
    try {
        let { personalContributeId } = req.params;
        let { username } = req.body;

        let personalContribute = await PersonalContribute.findById(personalContributeId);

        if (personalContribute == null) throw new Error("Personal contribute is not existed");

        let supportRequest = await SupportRequest.findOne({ _id: personalContribute.supportRequestId, accountId: username });

        if (supportRequest == null) throw new Error("You are not owner of support request")


        supportRequest.status = "Accepted";

        await supportRequest.save();

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

export async function rejectPersonalContribute(req: Request, res: Response) {
    try {
        let { personalContributeId } = req.params;
        let { username } = req.body;

        let personalContribute = await PersonalContribute.findById(personalContributeId);

        if (personalContribute == null) throw new Error("Personal contribute is not existed");

        let supportRequest = await SupportRequest.findOne({ _id: personalContribute.supportRequestId, accountId: username });

        if (supportRequest == null) throw new Error("You are not owner of support request")


        supportRequest.status = "Rejected";

        await supportRequest.save();

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