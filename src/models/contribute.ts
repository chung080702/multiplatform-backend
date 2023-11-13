import { Schema, model } from "mongoose";

export const GroupContribute = model("Group Contribute", new Schema({
    _id: String,
    eventId: String,
    groupId: String,
    accountId: String,
    status: {
        type: String,
        enum: ["pending", "accept", "reject"]
    },
    imageUrls: [String]
}))

export const PersonalContribute = model("Personal Contribute", new Schema({
    _id: String,
    supportRequestId: String,
    accountId: String,
    status: {
        type: String,
        enum: ["pending", "accept", "reject"]
    },
    imageUrls: [String]
}))

