import { Schema, Types, model } from "mongoose";

export const Membership = model("Membership", new Schema({
    _id: {
        type: String,
        default: () => new Types.ObjectId().toHexString()
    },
    accountId: String,
    groupId: String,
    role: {
        type: String,
        enum: ["admin", "member"]
    }
}))