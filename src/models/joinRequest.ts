import { Schema, model } from "mongoose";

export const JoinRequest = model("Join Request", new Schema({
    _id: String,
    accountId: String,
    groupId: String,
    status: {
        type: String,
        enum: ["pending", "accept", "reject"]
    }
}))