import { Schema, model } from "mongoose";

export const Membership = model("Membership", new Schema({
    _id: String,
    accountId: String,
    groupId: String,
    role: {
        type: String,
        enum: ["admin", "member"]
    }
}))