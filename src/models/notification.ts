import { Schema, Types, model } from "mongoose";

export const Notification = model("Notification", new Schema({
    _id: {
        type: String,
        default: () => new Types.ObjectId().toHexString()
    },
    accountId: String,
    content: String,
    url: String
}))