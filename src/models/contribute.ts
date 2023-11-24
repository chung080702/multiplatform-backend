import { Schema, Types, model } from "mongoose";

export const GroupContribute = model("Group Contribute", new Schema({
    _id: {
        type: String,
        default: () => new Types.ObjectId().toHexString()
    },
    eventId: String,
    groupId: String,
    accountId: String,
    status: {
        type: String,
        enum: ["pending", "accept", "reject"]
    },
    imageIds: [String]
}))

export const PersonalContribute = model("Personal Contribute", new Schema({
    _id: {
        type: String,
        default: () => new Types.ObjectId().toHexString()
    },
    supportRequestId: String,
    accountId: String,
    status: {
        type: String,
        enum: ["pending", "accept", "reject"]
    },
    imageIds: [String]
}))

