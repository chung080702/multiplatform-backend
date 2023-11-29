import { Schema, Types, model } from "mongoose";

const NotificationSchema = new Schema({
    _id: {
        type: String,
        default: () => new Types.ObjectId().toHexString()
    },
    accountId: { type: String, ref: 'Account', required: true },
    content: String,
    createAt: { type: Date, default: Date.now },
    url: String
})

NotificationSchema.index({ createAt: 1 });

export const Notification = model("Notification", NotificationSchema)