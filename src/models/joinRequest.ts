import { Schema, Types, model } from "mongoose";

export const JoinRequest = model("Join Request", new Schema({
    _id: {
        type: String,
        default: () => new Types.ObjectId().toHexString()
    },
    accountId: String,
    groupId: String,
    status: {
        type: String,
        enum: ["pending", "accept", "reject"]
    }
}))