import { Request, Response } from "express";
import logger from "../logger.js";
import { Event } from "../models/event.js";
import { Membership } from "../models/membership.js";
import { GroupContribute } from "../models/contribute.js";

export async function getEvents(req: Request, res: Response) {
    try {
        let { pageNumber, search = "" } = req.params;

        let perPage = 10;
        let skip = (Number(pageNumber) - 1) * perPage;

        let events = await Event.find({ name: { $regex: search, $options: 'i' } })
            .sort({ createAt: 1 }).skip(skip).limit(perPage).populate("supportRequestId").lean();

        let resData = {
            events
        }
        logger.info(resData);

        res.status(200).send(resData);
    }
    catch (e: any) {
        logger.error(e);
        res.status(400).send(e?.message);
    }
}

export async function getPendingEvents(req: Request, res: Response) {
    try {
        let { pageNumber, search = "" } = req.params;

        let perPage = 10;
        let skip = (Number(pageNumber) - 1) * perPage;

        let events = await Event.find({ name: { $regex: search, $options: 'i' }, status: 'Pending' })
            .sort({ createAt: 1 }).skip(skip).limit(perPage).populate("supportRequestId").lean();

        let resData = {
            events
        }
        logger.info(resData);

        res.status(200).send(resData);
    }
    catch (e: any) {
        logger.error(e);
        res.status(400).send(e?.message);
    }
}

export async function getEvent(req: Request, res: Response) {
    try {
        let { eventId } = req.params;

        let event = await Event.findById(eventId).populate("supportRequestId").lean();
        if (event == null) throw new Error("Event is not existed");

        let resData = {
            event
        }
        logger.info(resData);

        res.status(200).send(resData);
    }
    catch (e: any) {
        logger.error(e);
        res.status(400).send(e?.message);
    }
}

export async function acceptEvent(req: Request, res: Response) {
    try {
        let { eventId } = req.params;
        let { accountRole } = req.body;

        if (accountRole != "Admin") throw new Error("Permission denied");

        let event = await Event.findById(eventId);
        if (event == null) throw new Error("Event is not existed");

        event.status = "Accepted";

        await event.save();

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

export async function rejectEvent(req: Request, res: Response) {
    try {
        let { eventId } = req.params;
        let { accountRole } = req.body;

        if (accountRole != "Admin") throw new Error("Permission denied");

        let event = await Event.findById(eventId);
        if (event == null) throw new Error("Event is not existed");

        event.status = "Rejected";
        await event.save();

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

export async function createGroupContribute(req: Request, res: Response) {
    try {
        let { eventId } = req.params;
        let { username } = req.body;

        let event = await Event.findById(eventId);
        if (event == null) throw new Error("Event is not existed");

        if (await Membership.findOne({ accountId: username, groupId: event.groupId }) == null)
            throw new Error("User is not in event");

        let groupContribute = new GroupContribute({
            ...req.body,
            eventId,
            accountId: username
        })

        groupContribute.status = "Pending";

        await groupContribute.save();

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

export async function getGroupContributesOfEvent(req: Request, res: Response) {
    try {
        let { pageNumber, eventId } = req.params;
        let { filter = ["Pending", "Accepted", "Rejected"] } = req.body;

        let perPage = 10;
        let skip = (Number(pageNumber) - 1) * perPage;

        let groupContributes = await GroupContribute.find({ eventId, $or: filter.map((e: String) => { return { status: e } }) })
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


export async function getNotJoinEvents(req: Request, res: Response) {
    try {
        let { pageNumber, search = "" } = req.params;
        let { username } = req.body;
        let perPage = 10;
        let skip = (Number(pageNumber) - 1) * perPage;

        let events = await Event.aggregate([
            {
                $lookup: {
                    from: 'group contributes',
                    localField: '_id',
                    foreignField: 'eventId',
                    as: 'groupContributes'
                },

            },
            {
                $addFields: {
                    groupContributes: {
                        $filter: {
                            input: '$groupContributes',
                            as: 'm',
                            cond: {
                                $and: [
                                    { $eq: ['$$m.accountId', username] }
                                ]
                            }
                        }
                    }
                }
            },
            {
                $match: {
                    'name': { $regex: search, $options: 'i' },
                    'status': { $eq: 'Accepted' },
                    'groupContributes': { $eq: [] }
                }

            },
            {
                $skip: skip
            },
            {
                $limit: perPage
            }
        ]);

        let resData = {
            events
        }
        logger.info(resData);

        res.status(200).send(resData);
    }
    catch (e: any) {
        logger.error(e);
        res.status(400).send(e?.message);
    }
}

export async function getPendingJoinEvents(req: Request, res: Response) {
    try {
        let { pageNumber, search = "" } = req.params;
        let { username } = req.body;
        let perPage = 10;
        let skip = (Number(pageNumber) - 1) * perPage;

        let events = await Event.aggregate([
            {
                $lookup: {
                    from: 'group contributes',
                    localField: '_id',
                    foreignField: 'eventId',
                    as: 'groupContributes'
                },

            },
            {
                $addFields: {
                    groupContributes: {
                        $filter: {
                            input: '$groupContributes',
                            as: 'm',
                            cond: {
                                $and: [
                                    { $eq: ['$$m.accountId', username] }
                                ]
                            }
                        }
                    }
                }
            },
            {
                $match: {
                    'name': { $regex: search, $options: 'i' },
                    'status': { $eq: 'Accepted' },
                    'groupContributes.0.status': { $eq: 'Pending' }
                }

            },
            {
                $skip: skip
            },
            {
                $limit: perPage
            }
        ]);

        let resData = {
            events
        }
        logger.info(resData);

        res.status(200).send(resData);
    }
    catch (e: any) {
        logger.error(e);
        res.status(400).send(e?.message);
    }
}

export async function getAcceptedJoinEvents(req: Request, res: Response) {
    try {
        let { pageNumber, search = "" } = req.params;
        let { username } = req.body;
        let perPage = 10;
        let skip = (Number(pageNumber) - 1) * perPage;

        let events = await Event.aggregate([
            {
                $lookup: {
                    from: 'group contributes',
                    localField: '_id',
                    foreignField: 'eventId',
                    as: 'groupContributes'
                },

            },
            {
                $addFields: {
                    groupContributes: {
                        $filter: {
                            input: '$groupContributes',
                            as: 'm',
                            cond: {
                                $and: [
                                    { $eq: ['$$m.accountId', username] }
                                ]
                            }
                        }
                    }
                }
            },
            {
                $match: {
                    'name': { $regex: search, $options: 'i' },
                    'status': { $eq: 'Accepted' },
                    'groupContributes.0.status': { $eq: 'Accepted' }
                }

            },
            {
                $skip: skip
            },
            {
                $limit: perPage
            }
        ]);

        let resData = {
            events
        }
        logger.info(resData);

        res.status(200).send(resData);
    }
    catch (e: any) {
        logger.error(e);
        res.status(400).send(e?.message);
    }
}

export async function getGroupContribute(req: Request, res: Response) {
    try {
        let { groupContributeId } = req.params;
        let groupContribute = await GroupContribute.findById(groupContributeId)
            .populate("accountId")
            .populate("eventId")
            .lean();

        if (groupContribute == null) throw new Error("Group contribute is not existed")
        let resData = {
            groupContribute
        }
        logger.info(resData);

        res.status(200).send(resData);
    }
    catch (e: any) {
        logger.error(e);
        res.status(400).send(e?.message);
    }
}

export async function acceptGroupContribute(req: Request, res: Response) {
    try {
        let { groupContributeId } = req.params;
        let { username } = req.body;

        let groupContribute = await GroupContribute.findById(groupContributeId);

        if (groupContribute == null) throw new Error("Group contribute is not existed");

        let event = await Event.findById(groupContribute.eventId);

        if (event == null) throw new Error("Event is not existed")

        if ((await Membership.findOne({ accountId: username, groupId: event.groupId }))?.role != "Admin")
            throw new Error("You are not admin of event");

        groupContribute.status = "Accepted";

        await groupContribute.save();

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

export async function rejectGroupContribute(req: Request, res: Response) {
    try {
        let { groupContributeId } = req.params;
        let { username } = req.body;

        let groupContribute = await GroupContribute.findById(groupContributeId);

        if (groupContribute == null) throw new Error("Group contribute is not existed");

        let event = await Event.findById(groupContribute.eventId);

        if (event == null) throw new Error("Event is not existed")

        if ((await Membership.findOne({ accountId: username, groupId: event.groupId }))?.role != "Admin")
            throw new Error("You are not admin of event");

        groupContribute.status = "Rejected";

        await groupContribute.save();

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