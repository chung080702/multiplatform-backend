import { Request, Response } from "express";
import logger from "../logger.js";
import { Group } from "../models/group.js";
import { Membership } from "../models/membership.js";
import { Event } from "../models/event.js";
import { SupportRequest } from "../models/supportRequest.js";

export async function getGroupsOfUser(req: Request, res: Response) {
    try {
        let { pageNumber, accountId, search = "" } = req.params;
        let perPage = 10;
        let skip = (Number(pageNumber) - 1) * perPage;
        let groups = await Group.aggregate([
            {
                $lookup: {
                    from: 'memberships',
                    localField: '_id',
                    foreignField: 'groupId',
                    as: 'membership'
                },

            },
            {
                $addFields: {
                    membership: {
                        $filter: {
                            input: '$membership',
                            as: 'm',
                            cond: {
                                $and: [
                                    { $eq: ['$$m.accountId', accountId] }
                                ]
                            }
                        }
                    }
                }
            },
            {
                $match: {
                    'membership': { $ne: [] },
                    'membership.0.status': { $eq: 'Accepted' },
                    'name': { $regex: search, $options: 'i' },
                }
            },
            {
                $skip: skip
            },
            {
                $limit: perPage
            }
        ])

        let resData = {
            groups
        }
        logger.info(resData);

        res.status(200).send(resData);
    }
    catch (e: any) {
        logger.error(e);
        res.status(400).send(e?.message);
    }
}

export async function getGroups(req: Request, res: Response) {
    try {
        let { pageNumber, search = "" } = req.params;
        let { username } = req.body;
        let perPage = 10;
        let skip = (Number(pageNumber) - 1) * perPage;

        let groups = await Group.aggregate([
            {
                $lookup: {
                    from: 'memberships',
                    localField: '_id',
                    foreignField: 'groupId',
                    as: 'membership'
                },

            },
            {
                $addFields: {
                    membership: {
                        $filter: {
                            input: '$membership',
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
                    'name': { $regex: search, $options: 'i' }
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
            groups
        }
        logger.info(resData);

        res.status(200).send(resData);
    }
    catch (e: any) {
        logger.error(e);
        res.status(400).send(e?.message);
    }
}

export async function getPendingGroups(req: Request, res: Response) {
    try {
        let { pageNumber, search = "" } = req.params;
        let { username } = req.body;
        let perPage = 10;
        let skip = (Number(pageNumber) - 1) * perPage;

        let groups = await Group.aggregate([
            {
                $lookup: {
                    from: 'memberships',
                    localField: '_id',
                    foreignField: 'groupId',
                    as: 'membership'
                },

            },
            {
                $addFields: {
                    membership: {
                        $filter: {
                            input: '$membership',
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



                    'membership.0.status': { $eq: 'Pending' }



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
            groups
        }
        logger.info(resData);

        res.status(200).send(resData);
    }
    catch (e: any) {
        logger.error(e);
        res.status(400).send(e?.message);
    }
}

export async function getNoneGroups(req: Request, res: Response) {
    try {
        let { pageNumber, search = "" } = req.params;
        let { username } = req.body;
        let perPage = 10;
        let skip = (Number(pageNumber) - 1) * perPage;

        let groups = await Group.aggregate([
            {
                $lookup: {
                    from: 'memberships',
                    localField: '_id',
                    foreignField: 'groupId',
                    as: 'membership'
                },

            },
            {
                $addFields: {
                    membership: {
                        $filter: {
                            input: '$membership',
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
                    $or: [
                        { 'membership': { $eq: [] } },
                        { 'membership.0.status': { $eq: 'Rejected' } }
                    ]




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
            groups
        }
        logger.info(resData);

        res.status(200).send(resData);
    }
    catch (e: any) {
        logger.error(e);
        res.status(400).send(e?.message);
    }
}

export async function getGroup(req: Request, res: Response) {
    try {
        let { groupId } = req.params;
        let { username } = req.body;

        let group = await Group.findById(groupId).lean();
        let membership = await Membership.findOne({ groupId, accountId: username }).lean();

        let resData = {
            group: {
                ...group,
                membership: membership === null ? [] : [membership]
            }
        }
        logger.info(resData);

        res.status(200).send(resData);
    }
    catch (e: any) {
        logger.error(e);
        res.status(400).send(e?.message);
    }
}

export async function createGroup(req: Request, res: Response) {
    try {
        let { username } = req.body;

        let group = new Group({ memberNumber: 1, ...req.body });
        await group.save();

        let membership = new Membership({
            accountId: username,
            groupId: group._id,
            role: "Admin",
            status: "Accepted"
        })
        await membership.save();

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

async function checkAdminGroup(accountId: String, groupId: String) {
    let membership = await Membership.findOne({
        accountId: accountId,
        groupId: groupId
    });
    if (membership == null || membership.role != "Admin") return false;
    return true;
}

export async function updateGroup(req: Request, res: Response) {
    try {
        let { username, accountRole } = req.body;

        let { groupId } = req.params;

        if (accountRole != "Admin" && !await checkAdminGroup(username, groupId)) throw new Error("Permission denied");

        await Group.updateOne({ _id: groupId })

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

export async function joinGroup(req: Request, res: Response) {
    try {
        let { username } = req.body;
        let { groupId } = req.params;

        let group = await Group.findById(groupId);

        if (group == null) throw new Error("Group is not existed");

        let membership = await Membership.findOne({ accountId: username, groupId: group._id });

        if (membership?.status === 'Accepted')
            throw new Error("Group included member")


        if (membership === null) membership = new Membership({
            accountId: username,
            groupId: group._id,
            role: 'Member',
            status: "Pending"
        })

        membership.status = "Pending";

        membership.createAt = new Date(Date.now());

        await membership.save();

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

export async function getJoinGroupRequests(req: Request, res: Response) {
    try {
        let { groupId, pageNumber } = req.params;
        let { username } = req.body;
        let perPage = 10;
        let skip = (Number(pageNumber) - 1) * perPage;

        if (!await checkAdminGroup(username, groupId)) throw new Error("Permission denied");

        let joinRequests = await Membership.find({ groupId: groupId, status: "Pending" }).sort({ createAt: 1 })
            .skip(skip).limit(perPage).populate("accountId").lean();

        let resData = {
            joinRequests
        }

        logger.info(resData);
        res.status(200).send(resData);
    }
    catch (e: any) {
        logger.error(e);
        res.status(400).send(e?.message);
    }
}

export async function getJoinGroupRequestOfUser(req: Request, res: Response) {
    try {
        let { groupId } = req.params;
        let { username } = req.body;

        let joinRequest = await Membership.findOne({ groupId, accountId: username }).lean();

        if (joinRequest == null) throw new Error("Join request is not existed");

        let resData = {
            joinRequest
        }

        logger.info(resData);
        res.status(200).send(resData);
    }
    catch (e: any) {
        logger.error(e);
        res.status(400).send(e?.message);
    }
}

export async function getJoinGroupRequest(req: Request, res: Response) {
    try {
        let { joinRequestId } = req.params;

        let joinRequest = await Membership.findById(joinRequestId).lean();

        if (joinRequest == null) throw new Error("Join request is not existed");

        let resData = {
            joinRequest
        }

        logger.info(resData);
        res.status(200).send(resData);
    }
    catch (e: any) {
        logger.error(e);
        res.status(400).send(e?.message);
    }
}

export async function acceptJoinGroup(req: Request, res: Response) {
    try {
        let { username } = req.body;

        let { joinRequestId } = req.params;

        let joinRequest = await Membership.findById(joinRequestId);

        if (joinRequest == null) throw new Error("Join request is not existed");

        if (joinRequest.status != "Pending") throw new Error("Join request is handeled")

        let groupId = joinRequest.groupId;

        if (!await checkAdminGroup(username, groupId)) throw new Error("Permission denied");

        joinRequest.status = "Accepted";

        joinRequest.role = "Member";

        joinRequest.createAt = new Date(Date.now());

        await joinRequest.save();

        let group = await Group.findById(groupId);

        if (group == null) throw new Error("Group is not existed");

        group.memberNumber = group.memberNumber + 1;

        await group.save();

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


export async function rejectJoinGroup(req: Request, res: Response) {
    try {
        let { username } = req.body;
        let { joinRequestId } = req.params;

        let joinRequest = await Membership.findById(joinRequestId);

        if (joinRequest == null) throw new Error("Join request is not existed");

        if (joinRequest.status != "Pending") throw new Error("Join request is handeled")

        let groupId = joinRequest.groupId;

        if (!await checkAdminGroup(username, groupId)) throw new Error("Permission denied");

        joinRequest.status = "Rejected";

        joinRequest.createAt = new Date(Date.now());

        await joinRequest.save();

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

export async function deleteMember(req: Request, res: Response) {
    try {
        let { username } = req.body;
        let { memberId, groupId } = req.params;

        if ((!await checkAdminGroup(username, groupId) || await checkAdminGroup(memberId, groupId)) && (memberId != username)) throw new Error("Permission denied");

        let membership = await Membership.findOne({ groupId, accountId: memberId })

        await Membership.deleteOne({ groupId, accountId: memberId });

        let group = await Group.findById(groupId);

        if (group == null) throw new Error("Group is not existed");

        if (membership?.status == 'Accepted')
            group.memberNumber = group.memberNumber - 1;

        await group.save();


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


export async function getMembers(req: Request, res: Response) {
    try {
        let { groupId, pageNumber } = req.params;

        let perPage = 10;
        let skip = (Number(pageNumber) - 1) * perPage;
        let members = await Membership.find({ groupId, status: 'Accepted' }).sort({ createAt: 1 }).skip(skip).limit(perPage)
            .populate("accountId").lean();

        let resData = {
            members
        }

        logger.info(resData);
        res.status(200).send(resData);
    }
    catch (e: any) {
        logger.error(e);
        res.status(400).send(e?.message);
    }
}

export async function getMember(req: Request, res: Response) {
    try {
        let { groupId, memberId } = req.params;

        let member = await Membership.findOne({ groupId, accountId: memberId }).populate("accountId").lean();

        let resData = {
            member
        }

        logger.info(resData);
        res.status(200).send(resData);
    }
    catch (e: any) {
        logger.error(e);
        res.status(400).send(e?.message);
    }
}


export async function updateMember(req: Request, res: Response) {
    try {
        let { username } = req.body;
        let { memberId, groupId } = req.params;

        if (!await checkAdminGroup(username, groupId)) throw new Error("Permission denied");

        let membership = await Membership.findOne({ groupId, accountId: memberId });

        if (membership == null) throw new Error("Group does not include member");

        membership.role = req.body.role;

        await membership.save();

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

export async function createEvent(req: Request, res: Response) {
    try {
        let { username, supportRequestId } = req.body;
        let { groupId } = req.params;

        if (!await checkAdminGroup(username, groupId)) throw new Error("Permission denied");

        if (supportRequestId != null) {
            let supportRequest = await SupportRequest.findById(supportRequestId);
            if (supportRequest == null) throw new Error("Support request is not existed")
            if (supportRequest.status != "Accepted") throw new Error("Support request is not accepted")
        }
        let event = new Event({
            ...req.body,
            groupId
        });
        event.status = "Pending";
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


export async function getEventsOfGroup(req: Request, res: Response) {
    try {
        let { pageNumber, groupId } = req.params;
        let { filter = ["Pending", "Accepted", "Rejected"] } = req.body;

        let perPage = 10;
        let skip = (Number(pageNumber) - 1) * perPage;

        let events = await Event.find({ groupId, $or: filter.map((e: String) => { return { status: e } }) })
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

export async function updateEvent(req: Request, res: Response) {
    try {
        let { username } = req.body;
        let { eventId, groupId } = req.params;

        if (!await checkAdminGroup(username, groupId)) throw new Error("Permission denied");

        await Event.updateOne({ _id: eventId }, req.body);

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

